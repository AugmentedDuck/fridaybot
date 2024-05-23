const { SlashCommandBuilder } = require(`discord.js`)

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`date`)
    .setDescription(`Sends amount of time to exams`),

  async execute(interaction) {
    await interaction.deferReply()
	await interaction.editReply('This command is no longer applicable')
    let today = new Date()
		let nowUNIX = Math.round(today.getTime() / 1000)
		const examDateUNIX = 1716384300 
		let timeToExamsSeconds = examDateUNIX - nowUNIX
		const secondsInDay = 60 * 60 * 24
		let timeToExamsDays = Math.round(timeToExamsSeconds / secondsInDay)
		//await interaction.editReply(alertToDays(timeToExamsDays)) 
    
		function alertToDays(daysBetween) {
			let schoolDays = Math.round( daysBetween * ( 5 / 7) - ( 37 * (daysBetween / 152)) ) 

			console.log(daysBetween,schoolDays, "days")

      		return `There is ${daysBetween} days left\nThat is ${schoolDays}\* school days left\n\*this is an estimation and may be wrong`
		}
  },
};