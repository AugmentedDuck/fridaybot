const { SlashCommandBuilder } = require(`discord.js`)

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`waifu`)
    .setDescription(`Get a picture of an anime girl`)
    .addStringOption(option =>
        option.setName('tag')
            .setDescription('What tag do you want to search for?')
            .addChoices(
                { name: 'Maid', value: 'maid'},
                { name: 'Waifu', value: 'waifu'},
                { name: 'Marin Kitagawa', value: 'marin-kitagawa'},
                { name: 'Mori Colliope', value: 'mori-clliope'},
                { name: 'Raiden Shogun', value: 'raiden-shogun'},
                { name: 'Oppai', value: 'oppai'},
                { name: 'Selfies', value: 'selfies'},
                { name: 'Uniform', value: 'uniform'},
                { name: 'Kamisato Ayaka', value: 'kamisato-ayaka'},
            )
    )
    .addBooleanOption(option => 
        option.setName('private')
            .setDescription('Should you be the only one able to see the picture?')
    )
    .addBooleanOption(option =>
        option.setName('nsfw')
            .setDescription('Should it be nsfw?')),
    async execute(interaction) {
        const apiURL = 'https://api.waifu.im/search'
        const tag = interaction.options.getString('tag') ?? null
        const private = interaction.options.getBoolean('private') ?? false
        let nsfw = interaction.options.getBoolean('nsfw') ?? false
        let changed = false

        if (private) {
            await interaction.deferReply({ ephemeral: true });
        } else {
            await interaction.deferReply();
        }

        if (!interaction.channel.nsfw && !private){
            nsfw = false
            changed = true
            interaction.editReply("Can't show nsfw in this channel")
            return
        }

        const queryParams = new URLSearchParams();

        queryParams.set('included_tags', tag)
        let query = queryParams.toString()
        
        
        if (tag == null) query = ""
        
        const requestUrl = `${apiURL}?is_nsfw=${nsfw}&${query}`

        try {
            let request = await fetch(requestUrl)
            let data = await request.json()
            let image = data.images[0].url
            let author = data.images[0].artist?.name

            interaction.editReply(image)

            if (private) {
                await interaction.followUp({ content: `Author: ${author}`, ephemeral: true });        
            } else {
                await interaction.followUp(`Author: ${author}`);        
            }

        } catch (error) {
            console.log(error)
            await interaction.editReply(`Something went wrong:\n${error.name}`)
        }
    },
};
