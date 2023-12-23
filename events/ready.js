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

			let today = new Date()
			let nowUNIX = Math.round(today.getTime() / 1000)
			const examDateUNIX = 1716384300 
			let timeToExamsSeconds = examDateUNIX - nowUNIX
			const secondsInDay = 60 * 60 * 24
			let timeToExamsDays = Math.round(timeToExamsSeconds / secondsInDay)
			alertToDays(timeToExamsDays)
		}

		function alertToDays(daysBetween) {
			const channelName = '876766059821150242'

			let schoolDays = Math.round( daysBetween * ( 5 / 7) - ( 37 * (daysBetween / 152)) ) 

			console.log(daysBetween,schoolDays, "days")

			if (daysBetween <= 10) {
				client.channels.cache.get(channelName).send(`There is ${daysBetween} days left to exams\n that is an estimated ${schoolDays}`)
			} else if (daysBetween < 100) {
				if (daysBetween % 10 == 0) {
				client.channels.cache.get(channelName).send(`There is ${daysBetween} days left to exams\n that is an estimated ${schoolDays}`)
				}
			}
		}
		
		runOncePerDay();	
	},
};



