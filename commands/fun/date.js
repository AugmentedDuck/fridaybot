const { SlashCommandBuilder } = require(`discord.js`)

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`date`)
    .setDescription(`Sends the current date`),

  async execute(interaction) {
    const currentDate = new Date().getDate() + " / " + new Date().getMonth(); //How long did it take?
    await interaction.reply(`The date is: ${currentDate}`)
  },
};