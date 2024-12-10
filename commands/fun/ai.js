const { SlashCommandBuilder, ChannelType } = require(`discord.js`)
//!! Requires Ollama & Stable Diffusion!!

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`ai`)
    .setDescription(`different AI commands`)

    .addSubcommand(subcommand =>
		subcommand.setName('response')
    .setDescription('Gives an AI text response')
		
      .addStringOption((option) =>
        option.setName('prompt')
          .setDescription('the prompt for the AI')
          .setRequired(true))
    )

    .addSubcommand(subcommand =>
        subcommand.setName('picture')
            .setDescription('Generate an AI picture')
        
            .addStringOption((option) => 
                option.setName('prompt')
                      .setDescription('Prompt for diffusion model')
                      .setRequired(true))
            
            .addStringOption((option) => 
                option.setName('model')
                      .setDescription('What diffusion model')
                      .setRequired(true)
                      .addChoices(
                        { name: 'Realistic', value: 'epicphoto'}, //TO-DO
                        { name: 'Anime', value: 'abstract'}, //TO-DO
                    ))

            .addStringOption((option) => 
                option.setName('negative-prompt')
                      .setDescription('Prompt for what not to include in diffusion model'))

            .addIntegerOption((option) => 
                option.setName('size')
                      .setDescription('size of the picture 128x128 to 1024x1024 (512x512)'))
            
            .addIntegerOption((option) => 
                option.setName('seed')
                      .setDescription('Seed for generaton (Leave blank for random)'))
    )
      ,
      //------------------------------------------------------------------------------------------------------------------
      
  async execute(interaction) {    
    if (interaction.options.getSubcommand() === 'response') {
      const API_URL = "http://localhost:11434/api/generate";
      let prompt = interaction.options.getString('prompt');

      interaction.deferReply();

      try {
        let response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type" : "application/json"
          },
          body: JSON.stringify({
            model: "llama3.2",
            prompt: `${prompt}`,
            stream: false
          })
        })

        let data = await response.json();

        await interaction.editReply(data.response);

      } catch (error) {
        console.log(error)

        await interaction.editReply("Something went wrong");
      }

    } else if (interaction.options.getSubcommand() === 'picture'){
      const API_URL = "http://127.0.0.1:7860/sdapi/v1/txt2img"
      let prompt = interaction.options.getString('prompt');

      await interaction.deferReply()

      try {
        let response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type" : "application/json"
          },
          body: JSON.stringify({
            "prompt": `${prompt}`,
            "steps": 5
          })
        })

        let data = await response.json();
        console.log(data)
        //await interaction.editReply(data);
      } catch (error) {
        console.log(error)
        //await interaction.editReply("Something went wrong");
      }
      await interaction.editReply("Something went wrong");

    }
  },
};