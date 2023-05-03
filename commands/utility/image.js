const { SlashCommandBuilder } = require(`discord.js`);
var Scraper = require('images-scraper');

const google = new Scraper({
  pupperteer: {
    headless: true
  }
});


module.exports = {
  data: new SlashCommandBuilder()
    .setName(`image`)
    .setDescription(`Find an image of the specified thing`)
    .addStringOption(option =>
      option.setName('Image query')
        .setDescription(`The search word to find images`)
        .setRequired(true)
    ),
  
    async execute(interaction) {
    const imageQuery = interaction.option.getString(`Image query`);

    if (!imageQuery){
      await interaction.reply(`Error in query`);
      return;
    } 

    const imageResults = await google.scrape(imageQuery, 1);
    await interaction.reply(imageResults[0].url)

  },
};