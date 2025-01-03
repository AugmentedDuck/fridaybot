const { SlashCommandBuilder, ChannelType } = require(`discord.js`)
const { AudioPlayerStatus, joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus, StreamType } = require('@discordjs/voice');
const ytdl = require('youtube-dl-exec');
const fs = require('fs');
const spotify = require('spotifydl-core').default;
const credentials = require('../../.data/spotifysecrets.json');

let queue = [];
let voiceChannel;
let player = createAudioPlayer();
const spotifydl = new spotify(credentials);
const regexYT = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/g;
const regexSpotify = /(?:https?:\/\/)?(?:www\.)?(?:open\.spotify\.com\/track\/)([a-zA-Z0-9]{22})/g;

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
  async execute(interaction) {

    //////////////////////////////////////////////////////////////
    //
    // EXECUTE INTERACTION
    //
    //////////////////////////////////////////////////////////////

    player.on(AudioPlayerStatus.Idle, async () => {
      let isNew = false
      
      try {
        fs.rmSync('./currentSong.mp3');
        isNew = true
      } catch (error) {
        isNew = false
      }

      if (isNew) {
        let response = queue.shift();
        if (response != undefined) {
          playSong();
        }
      }
    });

    async function playSong() {
      console.log("Playing song")

      if (queue[0].match(regexYT)) {
        const stream = await ytdl(queue[0], {extractAudio: true, audioFormat: 'mp3', output: 'currentSong'});
        await interaction.editReply("Playing song...")
        
      } else if (queue[0].match(regexSpotify)) {
        console.log(queue[0])
        const data = await spotifydl.getTrack(queue[0]);
        const song = await spotifydl.downloadTrack(data, "currentSong.mp3");
      }
      
      const resource = createAudioResource('./currentSong.mp3', { inputType: StreamType.Arbitrary });
      player.play(resource);
      
      
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator
      });

      const subscribe = connection.subscribe(player);
    }

    if (interaction.options.getSubcommand() === 'play') {
    
      //////////////////////////////////////////////////////////////////////////
      //
      // ADD A SONG TO THE QUEUE
      //
      //////////////////////////////////////////////////////////////////////////

      voiceChannel = interaction.options.getChannel('channel')
      const searchWord = interaction.options.getString('query')

      await interaction.deferReply();

      async function addToQueue() {
        if (searchWord != undefined || searchWord != '') {
          if (searchWord.match(regexYT) || searchWord.match(regexSpotify)) {
            queue.push(searchWord)

            if (queue.length == 1) {
              playSong();
            } else {
              await interaction.editReply("Added to queue")
              console.log(queue)
            }

          } else {
            await interaction.editReply("NOT A VALID LINK")
            return
          }
        }
      }

      addToQueue();
      
    } else if (interaction.options.getSubcommand() === 'stop'){

      //////////////////////////////////////////////////////////////////////////
      //
      // STOP THE PLAYER AND CLEAR THE QUEUE
      //
      //////////////////////////////////////////////////////////////////////////


      queue = [];
      
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator
      })
      
      const subscribtion = connection.subscribe(player);
      
      subscribtion.unsubscribe();
      
      player.stop();
      fs.rmSync('./currentSong.mp3');
      await interaction.reply("Stopped playing")

    } else if (interaction.options.getSubcommand() === 'clear'){

      //////////////////////////////////////////////////////////////////////////
      //
      // CLEAR THE QUEUE
      //
      //////////////////////////////////////////////////////////////////////////

      queue = [];
      await interaction.reply("Cleared queue")

    } else if (interaction.options.getSubcommand() === 'pause_resume'){

      //////////////////////////////////////////////////////////////////////////
      //
      // PAUSE OR RESUME THE PLAYER
      //
      //////////////////////////////////////////////////////////////////////////

      if (player.state.status === AudioPlayerStatus.Paused) {
        player.unpause()
        await interaction.reply("Resuming...")

      } else if (player.state.status === AudioPlayerStatus.Playing) {
        player.pause()
      await interaction.reply("Pausing...")
      }

    } else if (interaction.options.getSubcommand() === 'skip'){

      //////////////////////////////////////////////////////////////////////////
      //
      // SKIP THE CURRENT SONG
      //
      //////////////////////////////////////////////////////////////////////////

      if (player.state.status === AudioPlayerStatus.Playing) {
        await interaction.reply("Skipping song...")
        queue.shift();
        fs.rmSync('./currentSong.mp3');
        player.stop();

      } else {
        await interaction.reply("No song is playing")
      } 

    } else if (interaction.options.getSubcommand() === 'queue'){
      
      //////////////////////////////////////////////////////////////////////////
      //
      // VIEW THE CURRENT QUEUE
      //
      //////////////////////////////////////////////////////////////////////////

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
      
      //////////////////////////////////////////////////////////////////////////
      //
      // SHUFFLE THE QUEUE
      //
      //////////////////////////////////////////////////////////////////////////
      
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