const { Events } = require('discord.js');
const birthday = require('../.data/birthday.js')


module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
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

		console.log(`Ready! Logged in as ${client.user.tag}`);

	},
};


