
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
  durata.innerText = convertToMinSec(album.duration,true);

  //albumInfo.innerHTML = `${anno.innerText} • ${numTrack.innerHTML} • ${durata.innerHTML}.`
  albumInfo.append(anno,numTrack,durata);
};

function printSong(array){
let songList = document.getElementById("songList");
songList.innerHTML = "";
for(let i = 0; i< array.length; i++){
let songRow = document.createElement("div");
songRow.classList.add("row", "row-cols-4", "justify-content-between", "hover-custom","py-2","mb-3","card-padre","w-100");

let songIndexCont = document.createElement("div");
let songIndexPar = document.createElement("p");
songIndexCont.classList.add("col-index", "align-items-center", "text-end", "ms-3");
songIndexPar.innerText = `${i + 1}.`;
songIndexCont.appendChild(songIndexPar);

let songTitleCont = document.createElement("div");
let songTitlePar = document.createElement("p");
songTitleCont.classList.add("col-7", "d-flex", "align-items-center");
songTitlePar.innerText = array[i].title;
songTitleCont.appendChild(songTitlePar);

let iconCont = document.createElement("div");     //QUA ANDRANNO INSERITE LE ICONE IN InnerHTML
iconCont.classList.add("col-2", "text-end", "align-items-center","icon-hover");
iconCont.innerHTML = `<i class="bi bi-heart mx-2 text-success"></i><i class="bi bi-plus-lg mx-2"></i>`;

let songDurationCont = document.createElement("div");
let songDurationPar = document.createElement("p");
songDurationCont.classList.add("col-2","text-end", "align-items-center");
songDurationPar.innerText = convertToMinSec(array[i].duration,false);
songDurationCont.appendChild(songDurationPar);

songRow.append(songIndexCont,songTitleCont,iconCont,songDurationCont);
songList.appendChild(songRow);


}
}


//Funzione per aggiungere o togliere la classe expanded alla sidebar
function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('expanded');
};


//Funzione Per il titolo
function convertToMinSec(seconds,boolean) {
  let testo = "";
  const minutes = Math.floor(seconds / 60); // ottieni i minuti
  let remainingSeconds = seconds % 60;  // ottieni i secondi rimanenti
  if (remainingSeconds < 10) {
    remainingSeconds = `0${remainingSeconds}`;
  }
  if(boolean){
  testo =  `${minutes}min ${remainingSeconds}sec`;
  }else{
  testo = `${minutes}:${remainingSeconds}`;
  }
  return testo
}
