
const param = new URLSearchParams(window.location.search).get("id");

const albumUrl = `https://striveschool-api.herokuapp.com/api/deezer/album/${param}`;

let arraySong = [];
let album = {};



window.addEventListener("load", init());

function init() {
  getAlbum();


};

async function getAlbum() {
  try {
    let response = await fetch(albumUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    });
    let data = await response.json();
    album = { ...data };
    arraySong = data.tracks.data;
    console.log(album);
    printHero(album);
    printSong(arraySong);

  } catch (error) {
    console.log("Error: " + error);
  }
};



function printHero(album) {
  let imgAlbum = document.getElementById("imgAlbum");
  let imgTitle = document.getElementById("title");
  let bandImage = document.getElementById("imgBand");
  let imgBandLink = document.getElementById("imgBandLink");
  let bandName = document.getElementById("bandName");
  let bandNameLink = document.getElementById("bandNameLink");
  let albumInfo = document.getElementById("albumInfo");

  imgAlbum.setAttribute("src", album.cover_medium);
  imgTitle.innerText =  `${album.title}`;

  imgBandLink.setAttribute("href",`artist.html?id=${album.artist.id}`);
  bandImage.setAttribute("src", album.artist.picture_medium);

  bandNameLink.setAttribute("href",`artist.html?id=${album.artist.id}`);
  bandName.innerText = `${album.artist.name}`;

  let anno = document.createElement("span");
  let numTrack = document.createElement("span");
  let durata = document.createElement("span");

  anno.classList.add("fw-bold", "text-light","d-inline");
  anno.innerText = `${album.release_date.slice(0,4)} • `; //Confermare come cosa se effettivamente fattibile con gli 0-4 come parametri
  numTrack.classList.add("fw-bold", "text-light","d-inline");
  numTrack.innerText = `${album.nb_tracks} brani • `;
  durata.classList.add("opacity-75","d-inline");
  durata.innerText = convertToMinSec(album.duration);

  //albumInfo.innerHTML = `${anno.innerText} • ${numTrack.innerHTML} • ${durata.innerHTML}.`
  albumInfo.append(anno,numTrack,durata);

  //ANno  BOLD
  //numeroBrani BOLD
  //Durata Spento



};


//Funzione per aggiungere o togliere la classe expanded alla sidebar
function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('expanded');
};

function convertToMinSec(seconds) {
  const minutes = Math.floor(seconds / 60); // ottieni i minuti
  const remainingSeconds = seconds % 60;  // ottieni i secondi rimanenti
  return `${minutes}min ${remainingSeconds}sec`;
}