const { SlashCommandBuilder, ChannelType } = require(`discord.js`)
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { AudioPlayerStatus, joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder()
  .setName(`play`)
  .setDescription(`Play music in voice chat`)
  .addChannelOption((option) =>
  option.setName('channel')
  .setDescription('Channel to join')
  .setRequired(true)
  .addChannelTypes(ChannelType.GuildVoice))
  .addStringOption((option) =>
  option.setName('query')
      .setDescription('The search word(s)')
      .setRequired(true)),
      
  async execute(interaction) {
    const voiceChannel = interaction.options.getChannel('channel')
    const searchWord = interaction.options.getString('query')
    
    const player = createAudioPlayer();
        
    await interaction.reply(`Searching...`);

    player.on(AudioPlayerStatus.Playing, () => {
			console.log('The audio player has started playing!');
		});
    
    
    const videoFinder = async (query) => {
      const videoResult = await ytSearch(query)
      
      return (videoResult.videos.length > 1) ? videoResult.videos[0] : videoResult.videos[0] = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    }
    
    const video = await videoFinder(searchWord)
    
    await interaction.editReply(`Found Video ${video.title}`)       
    
    if(video){
      const stream = ytdl(video.url, {filter: 'audioonly'})
      const resource = createAudioResource(stream)
      player.play(resource);
    }
    
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guildId,
      adapterCreator: interaction.guild.voiceAdapterCreator
    })
    
    const subscribtion = connection.subscribe(player);

    await interaction.editReply(`Now playing: ***${video.title}***, in ${voiceChannel}`);

    player.addListener("stateChange", (oldOne, newOne) => {
      if (newOne.status == "idle") {
        console.log('Song finished')
        subscribtion.unsubscribe()
        connection.destroy()
      }
    })
  
  },
};
