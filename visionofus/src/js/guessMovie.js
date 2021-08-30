const axios = require("axios");

class GuessMovie {
  async spotify(song) {
    const spotify_options = {
      method: "GET",
      url: "https://unsa-unofficial-spotify-api.p.rapidapi.com/search",
      params: { query: song, count: "5", type: "tracks" },
      headers: {
        "x-rapidapi-host": "unsa-unofficial-spotify-api.p.rapidapi.com",
        "x-rapidapi-key": "2790459afbmsh0829a35c472249bp1b1bc2jsne1b0df98f7d8",
      },
    };
    let output = [];
    await axios
      .request(spotify_options)
      .then(function(response) {
        console.log("Songs songs", response.data);

        if (response.data && response.data.Results && response.data.Results.length > 0) {
          let album = response.data.Results.slice(0, 5);
          let songs = [];
          album.map((song) => {
            songs.push({ title: song.name, singer: song.artists[0].name, movie: song.album.name, song: song.preview_url });
          });
          //   output = { title: response.data.Results[0].name, singer: response.data.Results[0].artists[0].name, movie: response.data.Results[0].album.name };
          output = songs;
        }
      })
      .catch(function(error) {
        console.error(error);
      });
    return output;
  }

  async shazam(song) {
    const shazam_options = {
      method: "GET",
      url: "https://shazam.p.rapidapi.com/search",
      params: { term: song, locale: "en-US", offset: "0", limit: "5" },
      headers: {
        "x-rapidapi-host": "shazam.p.rapidapi.com",
        "x-rapidapi-key": "c162ef3bcamsh362ea71965394fep1f3dc3jsn6a184419325c",
      },
    };

    let output = [];
    await axios
      .request(shazam_options)
      .then(function(response) {
        console.log("Songs songs", response.data);
        

        if (response.data && response.data.tracks && response.data.tracks.hits && response.data.tracks.hits.length > 0) {
          let album = response.data.tracks.hits.slice(0, 5);
          let songs = [];
          album.map((song) => {
            songs.push({ title: song.track.title, singer: song.track.subtitle, movie: song.track.title , image : song.track.images.coverart});
          });
          //   output = { title: response.data.Results[0].name, singer: response.data.Results[0].artists[0].name, movie: response.data.Results[0].album.name };
          output = songs;
        }
      })
      .catch(function(error) {
        console.error(error);
      });
    return output;
  }
}
export default new GuessMovie();
