//30 elementi
const artist = [
  "Geolier",
  "Marco Mengoni",
  "Annalisa",
  "Lucio Corsi",
  "Nanowar Of Steel",
  "Lazza",
  "Elodie",
  "Alfa",
  "Blanco",
  "Tananai",
  "Madame",
  "Tedua",
  "Creepy Nuts",
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
  "Maluma",
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
  "Otonoke",
  "Midnights",
  "Happier Than Ever",
  "For All the Dogs",
  "Endless Summer Vacation",
  "Un Verano Sin Ti",
  "Harry's House",
  "Fake News Pinguini",
  "SOS",
  "Guts",
  "Utopia",
  "Austin",
  "From Zero",
];
const mainContainer = document.getElementById("main-Container");
const searchContainer = document.getElementById("second-main-Container");

let audioPlayer = document.getElementById("audioPlayer"); //VARIABILE GLOBALE PER IL PLAYER
let btnPlayPause = document.getElementById("playPause"); //bottone di play/pause

let musicElement = [];
let preferiti = JSON.parse(localStorage.getItem("Like")) || [];

let newArtistArray = [];
let newAlbumArray = [];
let recentSongs = []; //ARRAY POPOLATO CON LE CANZONI IN LOCAL STORAGE

class NewObject {
  constructor(
    _albumId,
    _albumCover,
    _albumTitle,
    _artistName,
    _artistId,
    _artistCover
  ) {
    this.albumId = _albumId;
    this.albumCover = _albumCover;
    this.albumTitle = _albumTitle;
    this.artistName = _artistName;
    this.artistId = _artistId;
    this.artistCover = _artistCover;
  }
}

searchContainer.classList.add("d-none");

window.addEventListener("load", init());

function init() {
  const updateView = () => {
    const param = new URLSearchParams(window.location.search).get("search");

    printRecentSong(); //RIVEDERE POSIZIONE DENTRO INIT

    if (!param) {
      //console.log("ciao");
      mainContainer.classList.remove("d-none");
      searchContainer.classList.add("d-none");
      getAlbum();
      getArtist();
      printLibrary();
    } else {
      mainContainer.classList.add("d-none");
      searchContainer.classList.remove("d-none");
      searchQuery(param);
      printLibrary();
      
    }
  };
  updateView();

  window.addEventListener("popstate", updateView);
  loadMusicOnPages();
}

document.getElementById("searchBtn").addEventListener("click", (e) => {
  e.preventDefault();
  const input = document.getElementById("searchInput");
  const query = input.value;
  const newUrl = `./index.html?search=${encodeURIComponent(
    query.replaceAll(" ", "-")
  )}`;
  history.pushState(null, "", newUrl);
  searchQuery(query);
});

async function getArtist() {
  const shuffledArtists = shuffle(artist);
  const promises = shuffledArtists.map((item) => {
    const artistUrl = `https://striveschool-api.herokuapp.com/api/deezer/search?q=${item.replaceAll(
      " ",
      "-"
    )}`;
    return fetch(artistUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        const object = data.data[0];
        return new NewObject(
          object.album.id,
          object.album.cover_medium,
          object.album.title,
          object.artist.name,
          object.artist.id,
          object.artist.picture_medium
        );
      })
      .catch((error) =>
        console.log("Errore durante il fetch dell'artista:", error)
      );
  });

  const results = await Promise.allSettled(promises);
  newArtistArray = results
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);

  if (newArtistArray.length >= 6) {
    const cardContainer = document.getElementById("artist");
    printArtistCard(newArtistArray, "artist");
  } else {
    console.log("Dati insufficienti per gli artisti, riprovo...");

    getArtist();
  }
}

async function getAlbum() {
  const shuffledAlbums = shuffle(albums);
  const promises = shuffledAlbums.map((item) => {
    const albumUrl = `https://striveschool-api.herokuapp.com/api/deezer/search?q=${item.replaceAll(
      " ",
      "-"
    )}`;
    return fetch(albumUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        const object = data.data[0];
        return new NewObject(
          object.album.id,
          object.album.cover_medium,
          object.album.title,
          object.artist.name,
          object.artist.id
        );
      })
      .catch((error) =>
        console.log("Errore durante il fetch dell'album:", error)
      );
  });

  const results = await Promise.allSettled(promises);
  newAlbumArray = results
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);

  if (newAlbumArray.length >= 6) {
    printAlbumCard(newAlbumArray, "album");
  } else {
    console.log("Dati insufficienti per gli album");
    getAlbum();
  }
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5).slice(0, 6);
}

//Funzione per aggiungere o togliere la classe expanded alla sidebar
function toggleMenu() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("expanded");
}

//STAMPA DELLE CARTE ALBUM
function printAlbumCard(item, container) {
  let cardContainer = document.getElementById(container);
  cardContainer.innerHTML = "";
  for (let i = 0; i < item.length; i++) {
    let cardWrapper = document.createElement("div");
    let cardPadre = document.createElement("div");
    let card = document.createElement("div");
    let cardImageLink = document.createElement("a");
    let cardImage = document.createElement("img");
    let cardBody = document.createElement("div");
    let cardTitleLink = document.createElement("a");
    let cardTitle = document.createElement("p");

    cardWrapper.className =
      "col bg-schede d-flex justify-content-center card-prova g-0";

    cardPadre.className = "d-flex justify-content-center pt-4 card-padre";

    card.className = "card bg-transparent border-0 card-figlio";

    cardImageLink.setAttribute("href", `album.html?id=${item[i].albumId}`);

    cardImage.className = "card-img-top img-fluid rounded-5";
    cardImage.setAttribute("src", item[i].albumCover);
    cardImage.setAttribute("alt", "Logo Album");

    cardBody.className = "card-body";

    cardTitleLink.className = "text-light link-card";
    cardTitleLink.setAttribute("href", `album.html?id=${item[i].albumId}`);

    cardTitle.className = "card-text fs-5";

    cardTitle.innerText = `${item[i].albumTitle}`;

    cardTitleLink.appendChild(cardTitle);
    cardBody.appendChild(cardTitleLink);
    cardImageLink.appendChild(cardImage);

    card.append(cardImageLink, cardBody);
    cardPadre.appendChild(card);
    cardWrapper.appendChild(cardPadre);

    cardContainer.appendChild(cardWrapper);
  }
}

//STAMPA DELLE CARTE ARTISTA
function printArtistCard(item, container) {
  let cardContainer = document.getElementById(container);
  cardContainer.innerHTML = "";
  for (let i = 0; i < item.length; i++) {
    let cardWrapper = document.createElement("div");
    let cardPadre = document.createElement("div");
    let card = document.createElement("div");
    let cardImageLink = document.createElement("a");
    let cardImage = document.createElement("img");
    let cardBody = document.createElement("div");
    let cardTitleLink = document.createElement("a");
    let cardTitle = document.createElement("p");

    cardWrapper.classList.add(
      "col",
      "bg-schede",
      "d-flex",
      "justify-content-center",
      "card-prova",
      "g-0"
    );
    cardPadre.classList.add(
      "d-flex",
      "justify-content-center",
      "pt-4",
      "card-padre"
    );
    card.classList.add("card", "bg-transparent", "border-0", "card-figlio");

    cardImageLink.setAttribute("href", `artist.html?id=${item[i].artistId}`);

    cardImage.classList.add("card-img-top", "img-fluid", "rounded-circle");
    cardImage.setAttribute("src", item[i].artistCover);
    cardImage.setAttribute("alt", "Logo Artista");

    cardBody.classList.add("card-body");

    cardTitleLink.classList.add("text-light", "link-card");
    cardTitleLink.setAttribute("href", `artist.html?id=${item[i].artistId}`);

    cardTitle.classList.add("card-text", "fs-5");
    cardTitle.innerText = `${item[i].artistName}`;

    cardTitleLink.appendChild(cardTitle);
    cardBody.appendChild(cardTitleLink);
    cardImageLink.appendChild(cardImage);

    card.append(cardImageLink, cardBody);
    cardPadre.appendChild(card);
    cardWrapper.appendChild(cardPadre);

    cardContainer.appendChild(cardWrapper);
  }
}

let queryResult;
let uniqueAlbum;
let uniqueArtist;

async function searchQuery(query) {
  document.title = `Spotify - Search`;
  const queryUrl = `https://striveschool-api.herokuapp.com/api/deezer/search?q=${query.replaceAll(
    " ",
    "-"
  )}`;
  try {
    const response = await fetch(queryUrl, {
      method: "GET",
    });
    let data = await response.json();
    queryResult = data.data.map((item) => ({
      trackId: item.id,
      trackTitle: item.title,
      albumId: item.album.id,
      albumTitle: item.album.title,
      albumCover: item.album.cover_medium,
      artistId: item.artist.id,
      artistName: item.artist.name,
      artistCover: item.artist.picture_medium,
      duration: item.duration,
      preview: item.preview,
    }));

    //Funzione per ottenre SOLO gli id unici di ALbum
    const albumIds = new Set(); //set serve per far si che crei un oggetti con elementi unici
    uniqueAlbum = queryResult.filter((element) => {
      if (!albumIds.has(element.albumId)) {
        albumIds.add(element.albumId);
        return true;
      }
      return false;
    });

    //Funzione per ottenre SOLO gli id unici di Artist
    const artistId = new Set();
    uniqueArtist = queryResult.filter((element) => {
      if (!artistId.has(element.artistId)) {
        artistId.add(element.artistId);
        return true;
      }
      return false;
    });

    //console.log("Risultati unici per albumId:", uniqueAlbum);

    //console.log(data);
    printSearch(queryResult);
    printAlbumCard(uniqueAlbum, "albumSearch");
    printArtistCard(uniqueArtist, "artistSearch");

    //let queryResult = data.data;
    //console.log(queryResult);
  } catch (error) {
    console.log("Error:" + error);
  }
}

function convertToMinSec(seconds, boolean) {
  let testo = "";
  const minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;
  if (remainingSeconds < 10) {
    remainingSeconds = `0${remainingSeconds}`;
  }

  if (boolean) {
    testo = `${minutes}min ${remainingSeconds}sec`;
  } else {
    testo = `${minutes}:${remainingSeconds}`;
  }

  return testo;
}

function printSearch(item) {
  let singleTrack = JSON.stringify(item[0]);

  //STAMPA SOLO DEL PRIMO ITEM
  mainContainer.classList.add("d-none");
  searchContainer.classList.remove("d-none");

  const firstAlbumCover = document.getElementById("firstAlbum");
  //console.log(firstAlbumCover);
  firstAlbumCover.setAttribute("src", item[0].albumCover);
  const popularSearchSong = document.getElementById("popularSearchSong");
  popularSearchSong.setAttribute("onclick", `addMusic(${singleTrack})`);

  const firstTrack = document.getElementById("firstTrack");
  firstTrack.innerText = item[0].trackTitle;

  const duration = document.getElementById("duration");
  duration.innerText = convertToMinSec(item[0].duration, true);

  const firstArtist = document.getElementById("firstArtistPic");
  firstArtist.setAttribute("src", item[0].artistCover);

  const artistLink = document.getElementById("firstArtistLink");

  artistLink.setAttribute("href", `artist.html?id=${item[0].artistId}`);

  const firstArtistName = document.getElementById("firstArtistName");
  firstArtistName.innerText = item[0].artistName;

  //ORA INIZIARE A STAMPRE NELLA TERZA COLONNA CON LE CANZONI PIù POPOLARI
  const popularTracks = document.getElementById("popularTracks");
  const songList = document.getElementById("songList");
  songList.innerHTML = "";
  popularTracks.innerHTML = "";
  //STAMPA DEI RISULTATI PIù INERENTI CON LA RICERCA
  for (let i = 0; i < 5; i++) {
    let music = JSON.stringify(item[i]); //fa diventare una stringa il tutto l'oggetto che serve
    //CREAZIONE DELLE RIGHE NELLA TERZA COLONNA RIMA SEZIONE
    const popRow = document.createElement("div");
    popRow.className = "row row-cols-4 mb-3 py-2 hover-custom list-hover";
    popularTracks.appendChild(popRow);

    const popularContainer = document.createElement("div");
    popularContainer.className = "col-index d-flex text-end ms-3 ";
    popularContainer.innerext = item[i].trackTitle;
    popRow.appendChild(popularContainer);

    //PRIMA SEZIONE: P
    const popRank = document.createElement("p");
    popRank.className = "m-0 p-0 align-self-center";
    popRank.innerText = i + 1; //???? da controllare
    popularContainer.appendChild(popRank);

    //SECONDA SEZIONE
    const popularBody = document.createElement("div");
    popularBody.className = "col-8 d-flex";
    popularBody.setAttribute("onclick", `addMusic(${music})`);
    popRow.appendChild(popularBody);

    //SECONDA SEZIONE: COVER ALBUM + TITOLO
    const popCover = document.createElement("img");
    popCover.setAttribute("src", item[i].albumCover);
    popCover.setAttribute("width", "30px");
    popularBody.appendChild(popCover);

    const popTitle = document.createElement("p");
    popTitle.className = "m-0 ps-2 align-self-center";
    popTitle.innerText = item[i].trackTitle;
    popularBody.appendChild(popTitle);

    const popIconContainer = document.createElement("div");
    popIconContainer.className = "col-2 text-end align-content-center";
    popIconContainer.innerHTML = ``;

    popRow.appendChild(popIconContainer);

    const popDurataContainer = document.createElement("div");
    popDurataContainer.className = "col-1 text-end d-flex";
    popRow.appendChild(popDurataContainer);

    const popDurata = document.createElement("p");
    popDurata.className = "m-0 p-0 align-self-center";
    popDurata.innerText = convertToMinSec(item[i].duration, false);
    popDurataContainer.appendChild(popDurata);
  }

  const collapseContainer = document.createElement("div");
  collapseContainer.className = "collapse";
  collapseContainer.id = "collapseList";

  //ORA LA PARTE SOTTO A TUTTA LARGHEZZA
  for (let i = 0; i < item.length; i++) {
    let music = JSON.stringify(item[i]); //fa diventare una stringa il tutto l'oggetto che serve
    //CREAZIONE DELLE RIGHE NELLA TERZA COLONNA RIMA SEZIONE
    const popRow = document.createElement("div");
    popRow.className =
      "row row-cols-4 mb-3 py-2 justify-content-between hover-custom list-hover";

    if (i < 7) {
      songList.appendChild(popRow);
    } else {
      collapseContainer.appendChild(popRow);
    }

    const popularContainer = document.createElement("div");
    popularContainer.className = "col-index d-flex text-end ms-3 ";
    popularContainer.innerext = item[i].trackTitle;
    popRow.appendChild(popularContainer);

    //PRIMA SEZIONE: P
    const popRank = document.createElement("p");
    popRank.className = "m-0 p-0 align-self-center";
    popRank.innerText = i + 1; //???? da controllare
    popularContainer.appendChild(popRank);

    //SECONDA SEZIONE
    const popularBody = document.createElement("div");

    popularBody.className = "col-8 d-flex";
    popularBody.setAttribute("onclick", `addMusic(${music})`); //AGGIUNGE LA FUNZIONE PER METTERE LA CANZONE NEL PLAYER

    popRow.appendChild(popularBody);

    //SECONDA SEZIONE: COVER ALBUM + TITOLO
    const popCover = document.createElement("img");
    popCover.setAttribute("src", item[i].albumCover);
    popCover.setAttribute("width", "30px");
    popularBody.appendChild(popCover);

    const popTitle = document.createElement("p");
    popTitle.className = "m-0 ps-2 align-self-center";
    popTitle.innerText = item[i].trackTitle;
    popularBody.appendChild(popTitle);

    const popIconContainer = document.createElement("div");
    popIconContainer.className =
      "col-2 text-end align-content-center icon-hover";
    popIconContainer.innerHTML = `
                      <i class="bi bi-plus-lg mx-2"></i>`;
    popRow.appendChild(popIconContainer);

    const heartButton = document.createElement("button");
    heartButton.className = "btn";
    heartButton.setAttribute("type", "button");
    heartButton.setAttribute("onclick", `likeFeature(${music})`);
    popIconContainer.appendChild(heartButton);

    const heart = document.createElement("i");
    heart.className = "bi bi-heart mx-2 text-success";
    heart.setAttribute("id", `r${item[i].trackId}`);
    heartButton.appendChild(heart);
    //console.log(item[i])

    const popDurataContainer = document.createElement("div");
    popDurataContainer.className = "col-1 text-end d-flex";
    popRow.appendChild(popDurataContainer);

    const popDurata = document.createElement("p");
    popDurata.className = "m-0 p-0 align-self-center";
    popDurata.innerText = convertToMinSec(item[i].duration, false);
    popDurataContainer.appendChild(popDurata);
  }

  songList.appendChild(collapseContainer);
  //BOTTONE COLLAPSE
  const show = document.createElement("button");
  show.className = "btn mt-3 text-light";
  show.setAttribute("type", "button");
  show.setAttribute("data-bs-toggle", "collapse");
  show.setAttribute("data-bs-target", "#collapseList");
  show.innerText = "Mostra altro";

  songList.appendChild(show);
}

//ARRIVA IN INPUT L'URL della canzone da eseguire
function addMusic(object) {
  let currentSongImg = document.getElementById("current-song-img");
  currentSongImg.setAttribute("src", `${object.albumCover}`);
  currentSongImg.style.boxShadow="0.1px 0.1px 5px 1px rgba(25, 133, 83, 0.5)";
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
    printRecentSong();
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
    printRecentSong();
    progressBar();
    return;
  }
}

function playPause() {
  if (
    btnPlayPause.innerHTML ===
    `<i class="bi bi-play-circle-fill text-success"></i>`
  ) {
    audioPlayer.play();
    btnPlayPause.innerHTML = `<i class="bi bi-pause-circle-fill text-success"></i>`;
  } else {
    audioPlayer.pause();
    btnPlayPause.innerHTML = `<i class="bi bi-play-circle-fill text-success"></i>`;
  }
}

//FUNZIONE PER METTERE I LIKE
function likeFeature(element) {
  const param = new URLSearchParams(window.location.search).get("search");
  //console.log(item);
  const song = preferiti.find((item) => item.trackId === element.trackId);
  console.log(song);

  if (!song) {
    preferiti.push(element);

    if (param) {
      const fill = document.getElementById(`r${element.trackId}`);
      fill.className = "bi bi-heart-fill mx-2 text-success";
    }
  } else {
    preferiti = preferiti.filter((x) => x.trackId !== element.trackId);
    if (param) {
      const fill = document.getElementById(`r${element.trackId}`);
      fill.className = "bi bi-heart mx-2 text-success";
    }
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
    libraryList.appendChild(popularBody);

    //SECONDA SEZIONE: COVER ALBUM + TITOLO
    const popCover = document.createElement("img");

    popCover.setAttribute("src", element.albumCover);
    popCover.setAttribute("width", "25px");
    popCover.setAttribute("height", "25px");
    popCover.setAttribute("onclick", `addMusic(${music})`);
    popularBody.appendChild(popCover);

    const info = document.createElement("div");
    info.className = "m-0 ps-2";
    popularBody.appendChild(info);

    const x = document.createElement("a");
    x.className='link-card'
    x.setAttribute("href", `artist.html?id=${element.artistId}`);
    info.appendChild(x)

    const a = document.createElement("p");
    a.className = "m-0 ps-2 fs-small custom-text-library";
    a.innerText = element.artistName;
    x.appendChild(a);


    const b = document.createElement("p");
    b.className = "m-0 ps-2 fs-small custom-text-library";
    b.innerText = element.trackTitle;
    info.appendChild(b);

    const trashBtn = document.createElement("button");
    trashBtn.className = "btn ms-auto";
    trashBtn.innerHTML = '<i class="bi bi-trash3 grey-icon fs-small"></i>';
    trashBtn.setAttribute("onclick", `likeFeature(${music})`);
    popularBody.appendChild(trashBtn);
  });
}

//FUNZIONE CHE PERMETTE IL SALVATAGGIO NEL LOCAL STORAGE DELLE CANZONE RECENTEMENTE ASCOLTATE
function listenedSong(canzone) {
  if (!localStorage.getItem("CanzoniRecenti")) {
    recentSongs.push(canzone);
    localStorage.setItem("CanzoniRecenti", JSON.stringify(recentSongs));
    return;
  } else {
    recentSongs = JSON.parse(localStorage.getItem("CanzoniRecenti"));
    if (recentSongs.length > 10) {
      recentSongs = recentSongs.splice(0, 10);
    }
    const boolean = recentSongs.find(
      (item) => item.trackId === canzone.trackId
    ); //SE è TRUE l'ha trovata
    if (!boolean) {
      //SE non viene trovata
      recentSongs.unshift(canzone);
      localStorage.setItem("CanzoniRecenti", JSON.stringify(recentSongs));
      return;
    } else {
      //SE POSIZIONE INDEX CANZONE = 0 RETURN ELSE FAI POP DI QUELLA CANZONE E UNSHIFT
      let index = recentSongs.findIndex(
        (item) => item.trackId === canzone.trackId
      );
      if (index == 0) {
        return;
      } else {
        recentSongs.splice(index, 1);
        recentSongs.unshift(canzone);
        localStorage.setItem("CanzoniRecenti", JSON.stringify(recentSongs));
        return;
      }
    }
  }
}

function printRecentSong() {
  let recentSongsTitle = document.getElementById("recentSongsTitle");
  let recentSongWrapper = document.getElementById("recentSongWrapper");
  let recentArray = [];
  recentSongWrapper.innerHTML = "";

  recentArray = JSON.parse(localStorage.getItem("CanzoniRecenti"));
  let maxlength;
  if (!localStorage.getItem("CanzoniRecenti")) {
    recentSongsTitle.innerHTML = "";
    return;
  } else if (recentArray.length > 6) {
    maxlength = 6;
  } else {
    maxlength = recentArray.length;
  }
  for (let i = 0; i < maxlength; i++) {
    let music = JSON.stringify(recentArray[i]);
    let recentSongCard = document.createElement("div");
    recentSongCard.className = "col-sm-12 col-lg-6 col-xl-3 d-flex rounded-4 card-Track recent-height ";//MODIFICARE QUA LE CARTE PER LA GRAFICA

    // let indexContainer = document.createElement("div");
    // let indexPar = document.createElement("p");
    // indexContainer.className = "col-index align-content-center text-end";
    // indexPar.innerText = `${i + 1}.`;
    // indexContainer.appendChild(indexPar);

    let titleContainer = document.createElement("div");
    titleContainer.className = "col-9 d-flex align-items-center";
    titleContainer.setAttribute("onclick", `addMusic(${music})`);
    let titleImage = document.createElement("img");
    titleImage.className = "imgSong ps-1";
    titleImage.setAttribute("alt", "Cover");
    titleImage.setAttribute("src", `${recentArray[i].albumCover}`);
    let titlePar = document.createElement("p");
    titlePar.className = "ps-2 fs-5 card-recent";
    titlePar.innerText = `${recentArray[i].trackTitle}`;
    titleContainer.append(titleImage, titlePar);

    let durataContainer = document.createElement("div");
    durataContainer.className = "col-3 text-center align-content-center";
    let durataPar = document.createElement("p");
    durataPar.innerText = `${convertToMinSec(recentArray[i].duration, false)}`;
    durataContainer.appendChild(durataPar);

    recentSongCard.append(
      //indexContainer,
      titleContainer,
      durataContainer
    );
    recentSongWrapper.appendChild(recentSongCard);
  }
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
  if (format < 10) {
    return `0:0${format}`;
  } else {
    return `0:${format}`;
  }
}

function loadMusicOnPages() {
  let canzone = JSON.parse(localStorage.getItem("InfoCanzone"));
  addMusic(canzone);
  audioPlayer.pause();
  btnPlayPause.innerHTML = `<i class="bi bi-play-circle-fill text-success"></i>`;
}
