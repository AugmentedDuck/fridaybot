const { SlashCommandBuilder, ChannelType } = require(`discord.js`)
const ytdl = require('ytdl-core');
const play = require('play-dl');
const ytSearch = require('yt-search');
const { AudioPlayerStatus, joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');

let queue = [];
let voiceChannel;
let player = createAudioPlayer();

module.exports = {
  data: new SlashCommandBuilder()
  .setName(`music`)
  .setDescription(`Control music in voice chat`)

  .addSubcommand(subcommand =>
		subcommand.setName('play')
			.setDescription('Put a song in queue !WARNING SPOTIFY IS NOT FULLY SUPPORTED!')
			.addChannelOption((option) =>
        option.setName('channel')
          .setDescription('Channel to join')
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildVoice))
      .addStringOption((option) =>
        option.setName('query')
          .setDescription('The search word(s)')
          .setRequired(true)))

  .addSubcommand(subcommand =>
    subcommand.setName('stop')
      .setDescription('Stop the song and clear queue'))

  .addSubcommand(subcommand =>
    subcommand.setName('clear')
      .setDescription('Clear the queue'))

  .addSubcommand(subcommand =>
    subcommand.setName('pause_resume')
      .setDescription('Pause or resume the music'))
      
      .addSubcommand(subcommand =>
        subcommand.setName('skip')
        .setDescription('Skips current song'))
        
        .addSubcommand(subcommand =>
          subcommand.setName('queue')
          .setDescription('View the current queue'))
          
          .addSubcommand(subcommand =>
            subcommand.setName('shuffle')
      .setDescription('Shuffles the current queue'))
      ,
      //------------------------------------------------------------------------------------------------------------------
      
  async execute(interaction) {    
    if (interaction.options.getSubcommand() === 'play') {
      voiceChannel = interaction.options.getChannel('channel')


      //TEMP-----------------------------------------
      await interaction.reply("Music is currently not working")
      //TEMP-----------------------------------------
      /*
      const searchWord = interaction.options.getString('query')
          
      await interaction.deferReply();
          
      const playNextSong = async () => {
        if(queue.length !== 0) {
          if(queue[0]){
            //const stream = ytdl(queue[0].url, {filter: 'audioonly'})
            const streamMusic = await play.stream(queue[0].url, {discordPlayerCompatibility: true});
            const resource = createAudioResource(streamMusic.stream, { inputType : streamMusic.type })
            player.play(resource);
            interaction.editReply(`Now playing: ***${queue[0].title}***, in ${voiceChannel} \nQueue length: ${queue.length}`);
          }
        
          const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator
          })
              
          const subscribtion = connection.subscribe(player);
        }
      }
          
      const videoFinder = async (query) => {
        //const videoResult = await ytSearch(query)

        if(play.yt_validate(query) == 'video' && query.startsWith('https')){ //YOUTUBE VIDEO
          const videoResult = await play.video_basic_info(query)
          await interaction.editReply(`Added ***${videoResult.video_details.title}*** to queue\nQueue length: ${queue.length}`)
          
          return videoResult.video_details;
        } else if (play.yt_validate(query) == 'playlist' && query.startsWith('https')) { //YOUTUBE PLAYLIST
          const playList = await play.playlist_info(query, { incomplete : true } );
          let count = 0

          for (let i = 0; i < playList.videos.length; i++){
            queue.push(playList.videos[i])
            count++
          }

          await interaction.editReply(`Added ***${count}*** songs from **${playList.title}** to queue\nQueue length: ${queue.length}`)
          
          if(queue.length == count) {
            playNextSong();
          }

          return { url: "https://www.youtube.com/watch?v=jhFDyDgMVUI", title: "return", needeToWork: true } //ONE SECOND EMPTY VIDEO

        } else if (play.sp_validate(query) == 'track') { //SPOTIFY TRACK
          const song = await play.spotify(query)
          if (song == null) {
            await interaction.editReply(`Spotify not working: <@535841235064324106> Update you API token!`)
          }
          const videoResult = await videoFinder(song.name);

          return videoResult
        } else if (play.sp_validate(query) == 'album' || play.sp_validate(query) == 'playlist') { //SPOTIFY ALBUM
          const playlist = await play.spotify(query)
          const playlistSongs = playlist.fetched_tracks.get('1');

          let count = 0

          for (let i = 0; i < playlistSongs.length; i++){
            let song = await videoFinder(playlistSongs[i].name)
            queue.push(song)
            count++
          }
          
          await interaction.editReply(`Added ***${count}*** songs from **${playlist.name}** to queue\nQueue length: ${queue.length}`)

          if(queue.length == count) {
            playNextSong();
          }

          return { url: "https://www.youtube.com/watch?v=jhFDyDgMVUI", title: "return", needeToWork: true } //ONE SECOND EMPTY VIDEO
        } else { //SEARCH FOR VIDEO ON YOUTUBE
          const videoResult = await play.search(query, { limit: 1 });

          await interaction.editReply(`Added ***${videoResult[0].title}*** to queue\nQueue length: ${queue.length}`)
          
          return videoResult[0];
        }
      }
      
      const video = await videoFinder(searchWord)
      if (!video.needeToWork) {
        queue.push(video);
      }
         
      
      
      if (queue.length == 1) {
        await playNextSong();
      }


      player.on("stateChange", (oldState, newState) => {
        if (newState.status === AudioPlayerStatus.Idle) { 
          if(queue.length > 1) {
            queue.shift();
            playNextSong();
          } else {
            const connection = joinVoiceChannel({
              channelId: voiceChannel.id,
              guildId: interaction.guildId,
              adapterCreator: interaction.guild.voiceAdapterCreator
            })
            
            const subscribtion = connection.subscribe(player);
  
            subscribtion.unsubscribe();
          }

        }
      })
*/
    } else if (interaction.options.getSubcommand() === 'stop'){
      queue = [];
      player.stop();
      await interaction.reply("Stopped playing")
      
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator
      })
      
      const subscribtion = connection.subscribe(player);

      subscribtion.unsubscribe();

    } else if (interaction.options.getSubcommand() === 'clear'){
      queue = [];
      await interaction.reply("Cleared queue")

    } else if (interaction.options.getSubcommand() === 'pause_resume'){
      if (player.state.status === AudioPlayerStatus.Paused) {
        player.unpause()
        await interaction.reply("Resuming...")

      } else if (player.state.status === AudioPlayerStatus.Playing) {
        player.pause()
      await interaction.reply("Pausing...")
      }

    } else if (interaction.options.getSubcommand() === 'skip'){
      if (player.state.status === AudioPlayerStatus.Playing) {
        queue.shift();
        await interaction.reply("Skipping song...")
        
        if(queue[0]){
          //const stream = ytdl.stream(queue[0].url, {filter: 'audioonly'})
          const streamMusic = await play.stream(queue[0].url, {discordPlayerCompatibility: true});
          const resource = createAudioResource(streamMusic.stream, { inputType : streamMusic.type })
          player.play(resource);
          interaction.editReply(`Now playing: ***${queue[0].title}***, in ${voiceChannel}`);

          const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator
          })
          
          const subscribtion = connection.subscribe(player);
        } else {
          interaction.editReply(`No songs left, leaving`)
          player.stop();
          
          const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator
          })
          
          const subscribtion = connection.subscribe(player);

          subscribtion.unsubscribe();
        }

      } else {
        await interaction.reply("No song is playing")
      } 
    } else if (interaction.options.getSubcommand() === 'queue'){
      
      if (queue.length == 0) {
        await interaction.reply("No songs in queue")
        return
      }

      let queueString = ""

      await interaction.reply("Counting...")
      for (let i = 0; i < queue.length; i++) {
        queueString += (i+1) + ") **" + queue[i].title + "**\n"
      }

      await interaction.editReply("The current queue is:\n" + queueString);

    } else if (interaction.options.getSubcommand() === 'shuffle'){
      await interaction.reply("Shuffling...")
      
      queue.shift();

      for (let i = queue.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [queue[i], queue[j]] = [queue[j], queue[i]];
      }
      await interaction.editReply("Shuffled the queue");
    }

  },
};