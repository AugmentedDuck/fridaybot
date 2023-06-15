const { SlashCommandBuilder } = require(`discord.js`)
var Scraper = require('images-scraper');

const google = new Scraper({
  puppeteer: {
    headless: false, //True takes to long :(
  },
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`image`)
    .setDescription(`search for an image`)
    .addStringOption(option =>
      option.setName('query')
        .setDescription('The search word(s)')
        .setRequired(true)
      ),
    
  async execute(interaction) {
    var searchWord = interaction.options.getString('query');

    await interaction.reply(`Due to high performance impact, the command **image** is not available`)//(`Searching for ${searchWord}...`); //Send a response to Discord !! NEEDED FOR TIMEOUT DO NOT REMOVE !!
    //const results = await google.scrape(searchWord, 1);
    //await interaction.editReply(results[0].url)
  },
};