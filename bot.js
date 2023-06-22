const birthday = require('../.data/birthday.js')

//Debug, just to see if the script runs
console.log(`Bip bop i am a bot!`);

// Require the necessary discord.js classes
const fs = require(`node:fs`)
const path = require(`node:path`)
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

//Dynamically retrive the command files
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands'); //Where are the commands located
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	
  for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		
    // Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

//Event handler
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Log in to Discord with your client's token
client.login(token);

// checks if one day has passed. 
function hasOneDayPassed(){
  // get today's date. eg: "7/37/2007"
  var date = new Date().getDay();

  // if there's a date in localstorage and it's equal to the above: 
  // inferring a day has yet to pass since both dates are equal.
  if( yesterday == date ) {
		return false;
	}

  // this portion of logic occurs when a day has passed
  yesterday = date;
  return true;
}


// some function which should run once a day
function runOncePerDay(){
  if( !hasOneDayPassed() ) return false;

  // your code below
  const channelName = '876766059821150242'

		let message = birthday.isToday()

		if (message != null) {
			client.channels.cache.get(channelName)
			.send(message);
		}

		if ((new Date()).getDay() === 5) {
			setTimeout(() => {
					client.channels.cache.get(channelName)
							.send('https://imgur.com/a/5XZocEX')
			}, 500);
		}
}

runOncePerDay();
let dayInMilliseconds = 1000 * 60 * 60 * 24;
setInterval(runOncePerDay, dayInMilliseconds);
