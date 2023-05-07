const { SlashCommandBuilder } = require(`discord.js`)


const jokes = ["https://miro.medium.com/v2/resize:fit:828/format:webp/1*iT5B6Mjv2lzWtTpSVxKQjw.png",
              `**A man walked into a copy shop, and requested that they print a book for him with pages 30 feet long and 1 foot wide.**\nPrinter: "Why do you need pages that long?"\nMan: "Well, it's a long story."`,
              `Jeg overvejer at gifte mig med en tysker, er det over grænsen?`,
              `Alle børnene hoppede ned i blenderen undtagen karlsmart han trykkede på start`,
              `Hvad kalder man en indbagt haj\n   - haj med dej`,
              `**When I was growing up # was pound, not hashtag**\nGood thing it changed, since "pound metoo" would've been sending the wrong message`,
              `https://preview.redd.it/ttfhavjmd1x51.png?width=640&crop=smart&auto=webp&v=enabled&s=50076483fd59d136c0d7dd2e7f183805ff08c32a`,
              `https://preview.redd.it/ycrjw204b9e61.gif?format=mp4&v=enabled&s=0e30fd4b93d0170baf6b5988a24157af26544715`,
              `https://preview.redd.it/vmadxu8d51o41.jpg?width=640&crop=smart&auto=webp&v=enabled&s=d170fef87504c05b2f04247b222a4b2e7c8b1445`,
              `https://i.redd.it/cjtg6wdt99951.jpg`,
              `https://preview.redd.it/nzkdkyfr2hz41.jpg?width=640&crop=smart&auto=webp&v=enabled&s=6f3a1c539af9c11b836ec818861e13feef6ca9ae`,
              `**What do you call a fake noodle?**\nAn impasta`]

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`joke`)
    .setDescription(`Sends a joke`),

  async execute(interaction) {
    const joke = jokes[parseInt(Math.random() * jokes.length)]
    await interaction.reply(joke)
  },
};