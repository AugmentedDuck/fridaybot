const { SlashCommandBuilder, ChannelType } = require(`discord.js`)
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { AudioPlayerStatus, joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');

const queue = [];

module.exports = {
  data: new SlashCommandBuilder()
  .setName(`music`)
  .setDescription(`Control music in voice chat`)
  .addSubcommand(subcommand =>
		subcommand.setName('play')
			.setDescription('Info about a user')
			.addChannelOption((option) =>
        option.setName('channel')
          .setDescription('Channel to join')
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildVoice))
      .addStringOption((option) =>
        option.setName('query')
          .setDescription('The search word(s)')
          .setRequired(true)))
  ,
      
  async execute(interaction) {
    const player = createAudioPlayer();
    
    if (interaction.options.getSubcommand() === 'play') {
      const voiceChannel = interaction.options.getChannel('channel')
      const searchWord = interaction.options.getString('query')

      await interaction.reply(`Searching...`);
      
      const videoFinder = async (query) => {
        const videoResult = await ytSearch(query)
        return (videoResult.videos.length > 1) ? videoResult.videos[0] : videoResult.videos[0] = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
      }
      
      const video = await videoFinder(searchWord)
      await interaction.editReply(`Found Video ${video.title}`)       
      queue.push(video);
      console.log(queue.length);
      
      if (queue.length == 1) {
        playNextSong();
      }

      function playNextSong() {
        if(queue.length !== 0) {
          if(queue[0]){
            const stream = ytdl(queue[0].url, {filter: 'audioonly'})
            const resource = createAudioResource(stream)
            player.play(resource);
            interaction.editReply(`Now playing: ***${queue[0].title}***, in ${voiceChannel}`);
            
            const connection = joinVoiceChannel({
              channelId: voiceChannel.id,
              guildId: interaction.guildId,
              adapterCreator: interaction.guild.voiceAdapterCreator
            })
            
            const subscribtion = connection.subscribe(player);
          }
        }
      }

      player.on("stateChange", (oldState, newState) => {
        if (newState.status === AudioPlayerStatus.Idle) {
          queue.shift();
          playNextSong();
        }
      })
    }
  },
};