const { Events, time } = require('discord.js');
const birthday = require('../.data/birthday.js')



module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		function runOncePerDay(){
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

			alertToDays()
		}

		function alertToDays() {
			let today = new Date()
			let nowUNIX = Math.round(today.getTime())
			const examDateUNIX = 1716384300000
			console.log(nowUNIX)
			let timeToExamsSeconds = examDateUNIX - nowUNIX
			const millisecondsInDay = 60 * 60 * 24 * 1000
			let daysBetween = Math.round(timeToExamsSeconds / millisecondsInDay)

			const channelName = '876766059821150242'

			let schoolDays = Math.round( daysBetween * ( 5 / 7) - ( 28 * (daysBetween / 139)) ) 

			console.log(daysBetween,schoolDays, "days")

			if (daysBetween <= 10) {
				client.channels.cache.get(channelName).send(`There is a total of ${daysBetween} days left to exams\nThat is an estimated ${schoolDays} days in school`)
			} else if (daysBetween % 10 == 0) {
				client.channels.cache.get(channelName).send(`There is a total of ${daysBetween} days left to exams\nThat is an estimated ${schoolDays} days in school`)
			}
		}
		
		runOncePerDay();	
	},
};



