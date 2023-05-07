const { SlashCommandBuilder } = require(`discord.js`)

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`dice`)
    .setDescription(`makes a random number`)
    .addIntegerOption(option =>
      option.setName('dice_size')
        .setDescription('Set the size of the die, default: 6')
        .setMinValue(1)
        .setRequired(false)
      ),
    
  async execute(interaction) {
    var diceSize = interaction.options.getInteger('dice_size');

    if(!diceSize) diceSize = 6 

    var chosenNumber = parseInt(Math.random() * diceSize)
    await interaction.reply(`You rolled a ${chosenNumber}`);
  },
};