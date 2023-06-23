const { Events } = require('discord.js');
const birthday = require('../.data/birthday.js')



module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		let yesterday = null;
		
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
							client.channels.cache.get(channelName).send('https://imgur.com/a/5XZocEX')
					}, 500);
				}
		}
		
		runOncePerDay();
		let dayInMilliseconds = 1000 * 60 * 60 * 24;
		setInterval(runOncePerDay, dayInMilliseconds);		
	},
};



