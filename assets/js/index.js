// const IdClient = "75023370ae47498eae5b110f6ec8ff52";
// const SecretClient = "7c7a6b5f53444ffca5931d034e16b2d2";
const tokenUrl = "https://accounts.spotify.com/api/token";
let tokenData = "";
const newReleaseUrl = "https://api.spotify.com/v1/browse/new-releases?limit=10";
//let TokenAuth = "Bearer "+ getToken();

// https://api.spotify.com/v1/search?q=pop&type=playlist

//30 elementi
const artist = [
  "Geolier",
  "Marco Mengoni",
  "Annalisa",
  "Lucio Corsi",
  "Daniela Pes",
  "Lazza",
  "Elodie",
  "Maneskin",
  "Blanco",
  "Tananai",
  "Madame",
  "Tedua",
  "Sfera Ebbasta",
  "Pinguini Tattici Nucleari",
  "Giorgia",
  "Taylor Swift",
  "Harry Styles",
  "The Weeknd",
  "Beyonce",
  "Billie Eilish",
  "Olivia Rodrigo",
  "Dua Lipa",
  "Travis Scott",
  "Drake",
  "Lana Del Rey",
  "Ed Sheeran",
  "Bad Bunny",
  "Rosalia",
  "Sam Smith",
  "Linkin Park",
];
const albums = [
  "Materia",
  "Gioventu Brucata Pinguini",
  "Sirio",
  "L'Amore",
  "Mondo Senza Pensi",
  "Dance Comet",
  "Faccio Un Casino",
  "OK",
  "Hello World Pinguini",
  "Magmamemoria",
  "Disumano",
  "Flop",
  "Siamo Qui",
  "La Lunga Attesa",
  "Rush!",
  "Dawn FM",
  "Did You Know That There's a Tunnel Under Ocean Blvd",
  "Midnights",
  "Happier Than Ever",
  "For All the Dogs",
  "Endless Summer Vacation",
  "Motomami",
  "Un Verano Sin Ti",
  "Harry's House",
  "Fake News Pinguini",
  "SOS",
  "Guts",
  "Utopia",
  "Austin",
  "From Zero",
];

// https://api.spotify.com/v1/search?q=pop&type=playlist&market=IT&limit=5&include_external=audio

//'https://api.spotify.com/v1/search?q=${genereUno}&type=playlist&market=IT&limit=5&include_external=audio'
//https://api.spotify.com/v1/search?q=Rock&type=playlist&limit=5

// https://api.spotify.com/v1/browse/new-releases?limit=10
let newArtistArray = [];
let newAlbumArray = [];
let newReleaseArray = [];

window.addEventListener("load", init());

function init() {
  getToken();
}

async function getToken() {
  try {
    let response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=75023370ae47498eae5b110f6ec8ff52&client_secret=7c7a6b5f53444ffca5931d034e16b2d2`,
    });
    let data = await response.json();
    let tokenData = data.access_token;
    let TokenAuth = `Bearer ${tokenData}`;
    //console.log(TokenAuth);
    getNewReleases(TokenAuth);
    //getGenderLikes(TokenAuth);
    //getLastResearch();        ANDRA FATTO IL GET ITEM DAL LOCAL STORAGE
  } catch (error) {
    console.log("ERROR: " + error);
  }
}

let newReleasAlbum = [];
async function getNewReleases(token) {
  try {
    let response = await fetch(newReleaseUrl, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    });
    let data = await response.json();
    let newReleasData = data.albums.items;
    newReleasAlbum = newReleasData.map((item) => item.name);
    //  console.log(newReleasAlbum)
    newReleasAlbum.forEach((element) => striveNewReleases(element));
    console.log(newReleaseArray);
    printNewRelease(newReleaseArray)
    //striveNewReleases(newReleasAlbum)
    //console.log(newReleasData);
    //console.log(newReleasAlbum);
  } catch (error) {
    console.log("ERRORE GET : " + error);
  }
}

class NewRelease {
  constructor(_albumId, _albumCover, _albumTitle, _artistName, _artistId) {
    this.albumId = _albumId;
    this.albumCover = _albumCover;
    this.albumTitle = _albumTitle;
    this.artistName = _artistName;
    this.artistId = _artistId;
  }
}

async function striveNewReleases(item) {
  let object = {};
  item = item.replaceAll(" ", "-");
  searchUrl = `https://striveschool-api.herokuapp.com/api/deezer/search?q=${item}`;
  //console.log(searchUrl)
  try {
    let response = await fetch(searchUrl, {
      method: "GET",
    });
    let data = await response.json();
    let object = data.data[0];
    newReleaseArray.push(
      new NewRelease(
        object.album.id,
        object.album.cover_small,
        object.album.title,
        object.artist.name,
        object.artist.id
      )
    );

    if (response.ok) {
      return newReleaseArray
    }
    //printNewRelease(newReleaseArray);

    // console.log(data);
  } catch (error) {
    console.log("ERRORE GET : " + error);
  }
}

function shuffle(array, destinazione) {
  array.sort(() => Math.random() - 0.5);
  for(let i = 0; i< 6; i++){
    destinazione.push(array[i]);
  }
  return destinazione;
}

console.log(shuffle(artist,newArtistArray));



//Funzione per aggiungere o togliere la classe expanded alla sidebar
function toggleMenu() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("expanded");
}

function printNewRelease(item) {
  console.log(item)
  item.forEach(element => {

  })
}
