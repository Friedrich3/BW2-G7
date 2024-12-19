
const param = new URLSearchParams(window.location.search).get("id");

const albumUrl = `https://striveschool-api.herokuapp.com/api/deezer/album/${param}`;

let audioPlayer = document.getElementById("audioPlayer");   //VARIABILE GLOBALE PER IL PLAYER
let btnPlayPause = document.getElementById("playPause");    //bottone di play/pause

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
    //console.log(arraySong);
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
  sizeh2(album.title.length)

  // riduzione size h2
  function sizeh2(x){
    //console.log("sono entrato")
    if(x>=30){
      title.style.fontSize="40px"
    }else if(x>=15){
      title.style.fontSize="55px"
    }else{}
  }
  

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

  
  albumInfo.append(anno,numTrack,durata);
  
};

function printSong(array){

let songList = document.getElementById("songList");
songList.innerHTML = "";
for(let i = 0; i< array.length; i++){
let music = JSON.stringify(array[i]);
let songRow = document.createElement("div");
songRow.classList.add("row", "row-cols-4", "justify-content-between", "hover-custom","py-2","mb-3","card-padre");

let songIndexCont = document.createElement("div");
let songIndexPar = document.createElement("p");
songIndexCont.classList.add("col-index", "align-items-center", "text-end", "ms-3");
songIndexPar.innerText = `${i + 1}.`;
songIndexCont.appendChild(songIndexPar);

let songTitleCont = document.createElement("div");
let songTitlePar = document.createElement("p");
songTitleCont.classList.add("col-8", "d-flex", "align-items-center");
songTitleCont.setAttribute("onclick" ,`addMusic(${music})`);
songTitlePar.innerText = array[i].title;
songTitleCont.appendChild(songTitlePar);

let iconCont = document.createElement("div");     //QUA ANDRANNO INSERITE LE ICONE IN InnerHTML
iconCont.classList.add("col-2", "text-end", "align-items-center","icon-hover");
iconCont.innerHTML = `<i class="bi bi-heart mx-2 text-success"></i><i class="bi bi-plus-lg mx-2"></i>`;

let songDurationCont = document.createElement("div");
let songDurationPar = document.createElement("p");
songDurationCont.classList.add("col-1","text-end", "align-items-center");
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
//va richiamata dopo aver stampato il logo nel DOM
//funzione per il calcolo della media colori
function calcolaMediaColori() {
  const img = document.getElementById('imgAlbum');
  const canvas = document.getElementById('copertinaCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = img.width;
  canvas.height = img.height;

  // Disegna l'immagine sul canvas
  ctx.drawImage(img, 0, 0);

  // Ottieni i dati dei pixel
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  let r = 0, g = 0, b = 0;
  const totalPixels = pixels.length / 4; //valori: R, G, B, A

  // Calcola la somma dei colori
  for (let i = 0; i < pixels.length; i += 4) {
      r += pixels[i];
      g += pixels[i + 1];
      b += pixels[i + 2];
  }

  // Calcola la media
  r = Math.round(r / totalPixels);
  g = Math.round(g / totalPixels);
  b = Math.round(b / totalPixels);

  let hero=document.getElementById("hero");
  hero.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  hero.style.boxShadow = `0px 80px 200px 150px rgba(${r}, ${g}, ${b}, 0.6)`;
}

const img = document.getElementById('imgAlbum');

img.addEventListener('load', () => {
img.onload=calcolaMediaColori();
});


//ALBUM search che porta alla pagina index

document.getElementById("searchBtn").addEventListener("click", (e) => {
  e.preventDefault();
  const input = document.getElementById("searchInput");
  const query = input.value;
  const newUrl = `./index.html?search=${encodeURIComponent(
    query.replaceAll(" ", "-")
  )}`;
  window.location.href = newUrl;
});


//ARRIVA IN INPUT L'URL della canzone da eseguire
function addMusic(object) {

  let currentSongImg = document.getElementById("current-song-img");
  currentSongImg.setAttribute("src", `${object.album.cover_small}`);
  let songTitle = document.getElementById("song-title");
  songTitle.innerText = object.title_short;
  let artistName = document.getElementById("artist-name");
  artistName.innerText = object.artist.name;
  let songDuration = document.getElementById("songDuration");
  songDuration.innerText = "0:30";
  let likeSongButton = document.getElementById("likeSongButton");
  likeSongButton.innerHTML = `<i class="bi bi-heart" onclick=("aggiungereFunzione")></i>`;

  //PUNTA il Tag AUDIO E se c'è una canzone in corso la interrompe e riproduce la selezionata , altrimenti mette la canzone selezionata
  if (!localStorage.getItem("Canzone")) {
    audioPlayer.setAttribute("src", object.preview);
    audioPlayer.play();
    btnPlayPause.innerHTML = `<i class="bi bi-pause-circle-fill text-success"></i>`;
    localStorage.setItem("Canzone", object.preview);
    let canzone = JSON.stringify(object);
    localStorage.setItem("InfoCanzone", canzone);
    return;
  } else {
    audioPlayer.pause();
    btnPlayPause.innerHTML = `<i class="bi bi-play-circle-fill text-success"></i>`;
    audioPlayer.setAttribute("src", object.preview);
    audioPlayer.play();
    btnPlayPause.innerHTML = `<i class="bi bi-pause-circle-fill text-success"></i>`;
    localStorage.setItem("Canzone", object.preview);
    let canzone = JSON.stringify(object);
    localStorage.setItem("InfoCanzone",canzone);
    return;
  }
}

function playPause() {

  if (btnPlayPause.innerHTML === `<i class="bi bi-play-circle-fill text-success"></i>`) {
    audioPlayer.play();
    btnPlayPause.innerHTML = `<i class="bi bi-pause-circle-fill text-success"></i>`;
  } else {
    audioPlayer.pause();
    btnPlayPause.innerHTML = `<i class="bi bi-play-circle-fill text-success"></i>`;
  }
}