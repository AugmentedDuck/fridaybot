const { SlashCommandBuilder } = require(`discord.js`)

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`ping`)
    .setDescription(`Replies with Pong!`),
  async execute(interaction) {
    const sentTimestap = interaction.createdTimestamp; //When the message is created
    await interaction.reply(`Pinging...`);

    const responseTime = Date.now() - sentTimestap; //How long did it take?
    await interaction.editReply(`Pong! Response time: ${responseTime}ms`)
  },
};
