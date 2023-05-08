const { SlashCommandBuilder, ChannelType } = require(`discord.js`)
const { AudioPlayerStatus, joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const voice = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`leave`)
    .setDescription(`Leaves the current voice channel`),

  async execute(interaction) {
    const guildId = interaction.guildId;
    const connection = voice.getVoiceConnection(guildId);

    if (connection) {
      connection.destroy(); // Destroy the voice connection
      await interaction.reply('😭 Left the channel');
    }
  },
};