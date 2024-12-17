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
let albumArray;
const container = document.getElementById("album");

window.addEventListener("load", init());

function init() {
  getAlbum();
  //console.log(newAlbumArray);
}
class NewObject {
  constructor(_albumId, _albumCover, _albumTitle, _artistName, _artistId) {
    this.albumId = _albumId;
    this.albumCover = _albumCover;
    this.albumTitle = _albumTitle;
    this.artistName = _artistName;
    this.artistId = _artistId;
  }
}

async function getAlbum() {
  let albumShuffle = shuffle(albums, newAlbumArray);
  let albumCardInfo = []
  for (let i = 0; i < albumShuffle.length; i++) {
    let Url = albumShuffle[i].replaceAll(" ", "-");
    let albumUrl = `https://striveschool-api.herokuapp.com/api/deezer/search?q=${Url}`;
    try {
      let response = await fetch(albumUrl, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch album: ${response.status}`);
      }

      let data = await response.json();
      let object = data.data[0];
      albumCardInfo.push(
        new NewObject(
          object.album.id,
          object.album.cover_medium,
          object.album.title,
          object.artist.name,
          object.artist.id
        )
      );
    } catch (error) {
      console.log("ERRORE GET : " + error);
    }
  }
 printCard(albumCardInfo) ;

}

function shuffle(array, destinazione) {
  array.sort(() => Math.random() - 0.5);
  for (let i = 0; i < 6; i++) {
    destinazione.push(array[i]);
  }
  return destinazione;
}

//Funzione per aggiungere o togliere la classe expanded alla sidebar
function toggleMenu() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("expanded");
}

function printCard(item) {
  const container = document.getElementById("album");
  container.innerHTML = "";
  for (let i = 0; i < item.length; i++) {
    const element = item[i];
    const col = document.createElement("div");
    col.className = "col";
    container.appendChild(col);

    const card = document.createElement("div");
    card.className = "card  mb-3";
    col.appendChild(card);

    const imgContainer = document.createElement("div");
    imgContainer.className = "img-container";
    card.appendChild(imgContainer);

    const img = document.createElement("img");
    img.className = "card-img-top";
    img.setAttribute("src", element.albumCover);
    img.setAttribute("alt", element.albumTitle);
    imgContainer.appendChild(img);

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";
    card.appendChild(cardBody);

    const title = document.createElement("h5");
    title.className = "card-title";
    title.textContent = element.albumTitle;
    cardBody.appendChild(title);
  }
}
