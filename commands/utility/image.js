const { SlashCommandBuilder, time } = require(`discord.js`)
const { createApi } = require("unsplash-js");

const { accessKey } = require('../../.data/unsplash.json');

const serverApi = createApi({
  accessKey: accessKey
})

var timeout = []

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`image`)
    .setDescription(`search for an image, can be used every 10 minutes`)
    .addStringOption(option =>
      option.setName('query')
        .setDescription('The search word(s)')
        .setRequired(true)
      ),
    
  async execute(interaction) {
    var searchWord = interaction.options.getString('query');

    if (timeout.includes(interaction.user.id)) {
      await interaction.reply(`This command is only available every 10 minutes`)
      return 
    }

    await interaction.reply(`Searching for ${searchWord}...`); //Send a response to Discord !! NEEDED FOR TIMEOUT DO NOT REMOVE !!
    try {
      let response = await serverApi.search.getPhotos({
        query: searchWord,
        page: 1,
        perPage: 5
      })
    
      let results = response.response.results;

      console.log(results)

      let imageID = results[Math.floor(Math.random() * 5)].id

      let imageResponse = await serverApi.photos.get({
        photoId:imageID
      })

      let imageURL = imageResponse.response.urls.regular;
      let authorName = imageResponse.response.user.name;
      let authorUsername = imageResponse.response.user.username;
      
      await interaction.editReply(`Image by ${authorName} aka ${authorUsername}\n${imageURL}`)
    } catch (error) {
      console.error(error)
      await interaction.editReply(`An error occured with name ${error.name}`)
    }

    timeout.push(interaction.user.id)

    setTimeout(() => {
      timeout.shift();
    }, 600000)

  },
};