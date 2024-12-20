
const param = new URLSearchParams(window.location.search).get("id");

const albumUrl = `https://striveschool-api.herokuapp.com/api/deezer/album/${param}`;

let audioPlayer = document.getElementById("audioPlayer");   //VARIABILE GLOBALE PER IL PLAYER
let btnPlayPause = document.getElementById("playPause");    //bottone di play/pause

let musicElement = [];
let preferiti = JSON.parse(localStorage.getItem("Like")) || [];

let arraySong = [];
let album = {};

let recentSongs = []; //ARRAY POPOLATO CON LE CANZONI IN LOCAL STORAGE

let queryResult;

window.addEventListener("load", init());

function init() {
  getAlbum();
  printLibrary();
  
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

      queryResult = arraySong.map((item) => ({
      trackId: item.id,
      trackTitle: item.title,
      albumId: item.album.id,
      albumTitle: item.album.title,
      albumCover: item.album.cover_small,
      artistId: item.artist.id,
      artistName: item.artist.name,
      artistCover: item.artist.picture_medium,
      duration: item.duration,
      preview: item.preview,
    }));
    //console.log(arraySong);
    printHero(album);
    printSong(queryResult);
    loadMusicOnPages();

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
  imgTitle.innerText = `${album.title}`;
  sizeh2(album.title.length)

  // riduzione size h2
  function sizeh2(x) {
    //console.log("sono entrato")
    if (x >= 30) {
      title.style.fontSize = "40px"
    } else if (x >= 15) {
      title.style.fontSize = "55px"
    } else { }
  }


  imgBandLink.setAttribute("href", `artist.html?id=${album.artist.id}`);
  bandImage.setAttribute("src", album.artist.picture_medium);

  bandNameLink.setAttribute("href", `artist.html?id=${album.artist.id}`);
  bandName.innerText = `${album.artist.name}`;

  let anno = document.createElement("span");
  let numTrack = document.createElement("span");
  let durata = document.createElement("span");

  anno.classList.add("fw-bold", "text-light", "d-inline");
  anno.innerText = `${album.release_date.slice(0, 4)} • `; //Confermare come cosa se effettivamente fattibile con gli 0-4 come parametri
  numTrack.classList.add("fw-bold", "text-light", "d-inline");
  numTrack.innerText = `${album.nb_tracks} brani • `;
  durata.classList.add("opacity-75", "d-inline");
  durata.innerText = convertToMinSec(album.duration, true);


  albumInfo.append(anno, numTrack, durata);

};

function printSong(array) {
  let songList = document.getElementById("songList");
  songList.innerHTML = "";
  for (let i = 0; i < array.length; i++) {
    let music = JSON.stringify(array[i]);
    let songRow = document.createElement("div");
    songRow.classList.add("row", "row-cols-4", "justify-content-between", "hover-custom", "py-2", "mb-3", "card-padre");

    let songIndexCont = document.createElement("div");
    let songIndexPar = document.createElement("p");
    songIndexCont.classList.add("col-index", "align-items-center", "text-end", "ms-3");
    songIndexPar.innerText = `${i + 1}.`;
    songIndexCont.appendChild(songIndexPar);

    let songTitleCont = document.createElement("div");
    let songTitlePar = document.createElement("p");
    songTitleCont.classList.add("col-8", "d-flex", "align-items-center");
    songTitleCont.setAttribute("onclick", `addMusic(${music})`);
    songTitlePar.innerText = array[i].trackTitle;
    songTitleCont.appendChild(songTitlePar);

    let iconCont = document.createElement("div");     //QUA ANDRANNO INSERITE LE ICONE IN InnerHTML
    iconCont.classList.add("col-2", "text-end", "align-items-center", "icon-hover");
    iconCont.innerHTML = `<i class="bi bi-plus-lg mx-2"></i>`;

    const heartButton = document.createElement("button");
    heartButton.className = "btn";
    heartButton.setAttribute("type", "button");
    heartButton.setAttribute("onclick", `likeFeature(${music})`);
    iconCont.appendChild(heartButton);

    const heart = document.createElement("i");
    heart.className = "bi bi-heart mx-2 text-success";
    heart.setAttribute("id", array[i].trackId);
    heartButton.appendChild(heart);
    //console.log(item[i])



    let songDurationCont = document.createElement("div");
    let songDurationPar = document.createElement("p");
    songDurationCont.classList.add("col-1", "text-end", "align-items-center");
    songDurationPar.innerText = convertToMinSec(array[i].duration, false);
    songDurationCont.appendChild(songDurationPar);

    songRow.append(songIndexCont, songTitleCont, iconCont, songDurationCont);
    songList.appendChild(songRow);


  }
}


//Funzione per aggiungere o togliere la classe expanded alla sidebar
function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('expanded');
};


//Funzione Per il titolo
function convertToMinSec(seconds, boolean) {
  let testo = "";
  const minutes = Math.floor(seconds / 60); // ottieni i minuti
  let remainingSeconds = seconds % 60;  // ottieni i secondi rimanenti
  if (remainingSeconds < 10) {
    remainingSeconds = `0${remainingSeconds}`;
  }
  if (boolean) {
    testo = `${minutes}min ${remainingSeconds}sec`;
  } else {
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

  let hero = document.getElementById("hero");
  hero.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  hero.style.boxShadow = `0px 80px 200px 150px rgba(${r}, ${g}, ${b}, 0.6)`;
}

const img = document.getElementById('imgAlbum');

img.addEventListener('load', () => {
  img.onload = calcolaMediaColori();
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
  currentSongImg.setAttribute("src", `${object.albumCover}`);
  let songTitle = document.getElementById("song-title");
  songTitle.innerText = object.trackTitle;
  let artistName = document.getElementById("artist-name");
  artistName.innerText = object.artistName;
  let songDuration = document.getElementById("songDuration");
  songDuration.innerText = "0:30";

  //PUNTA il Tag AUDIO E se c'è una canzone in corso la interrompe e riproduce la selezionata , altrimenti mette la canzone selezionata
  if (!localStorage.getItem("Canzone")) {
    audioPlayer.setAttribute("src", object.preview);
    audioPlayer.play();
    btnPlayPause.innerHTML = `<i class="bi bi-pause-circle-fill text-success"></i>`;
    localStorage.setItem("Canzone", object.preview);
    let canzone = JSON.stringify(object);
    localStorage.setItem("InfoCanzone", canzone);
    listenedSong(object);
    progressBar();
    return;
  } else {
    audioPlayer.pause();
    btnPlayPause.innerHTML = `<i class="bi bi-play-circle-fill text-success"></i>`;
    audioPlayer.setAttribute("src", object.preview);
    audioPlayer.play();
    btnPlayPause.innerHTML = `<i class="bi bi-pause-circle-fill text-success"></i>`;
    localStorage.setItem("Canzone", object.preview);
    let canzone = JSON.stringify(object);
    localStorage.setItem("InfoCanzone", canzone);
    listenedSong(object);
    progressBar();
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

//FUNZIONE CHE PERMETTE IL SALVATAGGIO NEL LOCAL STORAGE DELLE CANZONE RECENTEMENTE ASCOLTATE
function listenedSong(canzone){
  //console.log(canzone);
  if(!localStorage.getItem("CanzoniRecenti")){
    recentSongs.push(canzone);
    localStorage.setItem("CanzoniRecenti", JSON.stringify(recentSongs));
    return;
  }else{
    recentSongs = JSON.parse(localStorage.getItem("CanzoniRecenti"));
    if(recentSongs.length > 10){
      recentSongs = recentSongs.splice(0,10);
    }
    const boolean = recentSongs.find((item) => item.trackId === canzone.trackId); //SE è TRUE l'ha trovata
    if(!boolean){ //SE non viene trovata
      recentSongs.unshift(canzone);
      localStorage.setItem("CanzoniRecenti", JSON.stringify(recentSongs));
      return;
    }else{
      //SE POSIZIONE INDEX CANZONE = 0 RETURN ELSE FAI POP DI QUELLA CANZONE E UNSHIFT
      let index = recentSongs.findIndex((item) => item.trackId === canzone.trackId);
      if(index == 0 ){
        return;
      }else{
        recentSongs.splice(index,1);
        recentSongs.unshift(canzone);
        localStorage.setItem("CanzoniRecenti", JSON.stringify(recentSongs));
        return;
      }
      
    
    }
  }
  };


function likeFeature(element) {
  //console.log(item);
  const song = preferiti.find((item) => item.trackId === element.trackId);     //PER cercare un id dentro un array

  if (!song) {
    preferiti.push(element);
    const fill = document.getElementById(`${element.trackId}`);
    fill.className = "bi bi-heart-fill mx-2 text-success";
  } else {
    preferiti = preferiti.filter((x) => x.trackId !== element.trackId);
    const fill = document.getElementById(`${element.trackId}`);
    fill.className = "bi bi-heart mx-2 text-success";
  }

  localStorage.setItem("Like", JSON.stringify(preferiti));
  printLibrary();
}

function printLibrary() {
  const libraryList = document.getElementById("libraryList");
  libraryList.innerHTML = "";
  //console.log(preferiti)
  preferiti.forEach((element) => {
    let music = JSON.stringify(element);

    const popularBody = document.createElement("div");
    popularBody.className = "d-flex mb-2 hover-custom";
    popularBody.setAttribute("onclick", `addMusic(${music})`);
    libraryList.appendChild(popularBody);

    //SECONDA SEZIONE: COVER ALBUM + TITOLO
    const popCover = document.createElement("img");

    popCover.setAttribute("src", element.albumCover);
    popCover.setAttribute("width", "25px");
    popCover.setAttribute("height", "25px");
    popularBody.appendChild(popCover);

    const info = document.createElement("div");
    info.className = "m-0 ps-2";
    popularBody.appendChild(info);

    const a = document.createElement("p");
    a.className = "m-0 ps-2 fs-small custom-text-library";
    a.innerText = element.artistName;
    info.appendChild(a);

    const b = document.createElement("p");
    b.className = "m-0 ps-2 fs-small custom-text-library";
    b.innerText = element.trackTitle;
    info.appendChild(b);

    const trashBtn=document.createElement('button');
    trashBtn.className='btn ms-auto';
    trashBtn.innerHTML='<i class="bi bi-trash3 grey-icon fs-small"></i>';
    trashBtn.setAttribute("onclick",`likeFeature(${music})`);
    popularBody.appendChild(trashBtn);
  });
  
}

//FUNZIONE PER FAR FUNZIONARE LA PROGRESS BAR
function progressBar() {
  const audioPlayer = document.getElementById("audioPlayer");
  const Barra = document.getElementById("Barra");
  const currentTime = document.getElementById("currentTime");
  currentTime.innerText = "ciao";

  audioPlayer.addEventListener("loadedmetadata", () => {
    Barra.min = 0;
    Barra.max = Math.min(29, audioPlayer.duration);
    Barra.value = 0;
    //console.log( audioPlayer.currentTime);
  });

  Barra.addEventListener("input", () => {
    audioPlayer.currentTime = Barra.value;
  });

  audioPlayer.addEventListener("timeupdate", () => {
    Barra.value = audioPlayer.currentTime;
    currentTime.innerText = `${formatTime(audioPlayer.currentTime)}`;
  });
}

function formatTime(seconds) {
  let sec = seconds % 60;
  let format = parseFloat(sec.toFixed(0));
  if (format<10){
    return `0:0${format}`
  }else{
    return `0:${format}`
  }
}


function loadMusicOnPages(){
  let canzone = JSON.parse(localStorage.getItem("InfoCanzone"));
  addMusic(canzone);
  audioPlayer.pause();
  btnPlayPause.innerHTML = `<i class="bi bi-play-circle-fill text-success"></i>`; 
}
