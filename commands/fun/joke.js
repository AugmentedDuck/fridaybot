const { SlashCommandBuilder } = require(`discord.js`)


const jokes = ["https://miro.medium.com/v2/resize:fit:828/format:webp/1*iT5B6Mjv2lzWtTpSVxKQjw.png",
              `**A man walked into a copy shop, and requested that they print a book for him with pages 30 feet long and 1 foot wide.**\nPrinter: "Why do you need pages that long?"\nMan: "Well, it's a long story."`,
              ``
              ``
              ``
              ``
              ``
              ``
              ``
              ``
              ``
              ``]

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`joke`)
    .setDescription(`Sends a joke`),

  async execute(interaction) {
    const joke = jokes[parseInt(Math.random() * jokes.length)]
    await interaction.reply(joke)
  },
};