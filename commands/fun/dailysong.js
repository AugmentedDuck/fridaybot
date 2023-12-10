const { SlashCommandBuilder } = require(`discord.js`)
const { client_id, client_secret } = require('../../.data/spotifysecrets.json');

const clientId = client_id;
const clientSecret = client_secret;

let accessToken = null;

async function getToken() {
    if (accessToken) {
        return accessToken
    }

    const authString = `${clientId}:${clientSecret}`
    const authBase64 = btoa(authString);
    
    const url = "https://accounts.spotify.com/api/token"
    const headers = {
        "Authorization": "Basic " + authBase64,
        "Content-Type": "application/x-www-form-urlencoded"
    }
    const data = "grant_type=client_credentials"
    
    try {
        let result = await fetch(url, {method: "POST", headers: headers, body: data})
        
        let jsonResult = await result.json()
        accessToken = jsonResult.access_token
        return accessToken;
    } catch (error) {
        console.error("Error fetching token", error)
        return null
    }
}

function getAuthHeader(token) {
    return {"Authorization": "Bearer " + token}
}

async function searchForArtistID(name) {
    const month = new Date().getMonth() + 1
    const year = new Date().getFullYear() % 1000

    try {
        const url = "https://api.spotify.com/v1/search"
        const query = `?q=${name}&type=artist&limit=${month}&offset=${year}`;
        const queryURL = url + query;
        let headers = { ...getAuthHeader(await getToken()) }
        
        
        let result = await fetch(queryURL, {method: "GET", headers: headers})
        let jsonResult = await result.json()
        let resultItems = jsonResult.artists.items
        
        if (resultItems.length == 0) {
            console.warn('No artist were found!')
            return null
        }

        if (resultItems.length >= month) {
            return resultItems[month - 1]
        }

        return resultItems[0]
    } catch (error) {
        console.error("Error searching for artist:", error)
        return null
    }

}

async function getSongByArtist(id) {
    try {
        const url = `https://api.spotify.com/v1/artists/${id}/top-tracks?country=US`
        let headers = { ...getAuthHeader(await getToken()) }
    
        let result = await fetch(url, {method: "GET", headers: headers})
        let jsonResult = await result.json()
        let resultItems = jsonResult.tracks
    
        return resultItems;
    } catch (error) {
        console.error("Error fetching top tracks:", error);
    }
}

function getSearchTerm() {
    const characters = 'abcdefghijklmnopqrstuvwxyzæøå012'

    const date = new Date()
    const dateDay = date.getDate()

    const todaysCharacter = characters.charAt(dateDay)

    return todaysCharacter;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`dailysong`)
    .setDescription(`Finds a song based on the date`),

  async execute(interaction) {
    await interaction.reply(`Finding song`)
    let artistId = await searchForArtistID(getSearchTerm())

    if(!artistId.id) {
        return "No artist found!"
    }
    
    let tracks = await getSongByArtist(artistId.id);
    if (!tracks || tracks.length === 0) {
        return "No tracks found for this artist!"
    }

    await interaction.editReply(`Song: ${tracks[0].name} by...`)

    let artistString = ""

    for (const artist of tracks[0].artists) {
        artistString += artist.name + ", "
    }

    await interaction.editReply(`Song: ${tracks[0].name} by ${artistString}`)
  },
};