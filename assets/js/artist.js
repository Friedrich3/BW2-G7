const param = new URLSearchParams(window.location.search).get("id");

const artistUrl = `https://striveschool-api.herokuapp.com/api/deezer/artist/${param}`;

let audioPlayer = document.getElementById("audioPlayer"); //VARIABILE GLOBALE PER IL PLAYER
let btnPlayPause = document.getElementById("playPause"); //bottone di play/pause

let musicElement = [];
let preferiti = JSON.parse(localStorage.getItem("Like")) || [];

window.addEventListener("load", init());

function init() {
    getArtist();
    printLibrary();
}

async function getArtist() {
    try {
        let response = await fetch(artistUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        let data = await response.json();
        let object = { ...data };
        printHero(object);
        getDatas(data.name);
    } catch (error) {
        console.log("Error: " + error);
    }
}

let queryResult;

async function getDatas(name) {
    let url = `https://striveschool-api.herokuapp.com/api/deezer/search?q=${name}`;
    try {
        let response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        let data = await response.json();
        let object = data.data;
        queryResult = object.map((item) => ({
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
        printSongList(queryResult);
        printRecomendedAlbum(object[0]);
        filterAlbum(object)

        console.log(queryResult);
    } catch (error) {
        console.log("Error: " + error);
    }
}

function printHero(object) {
    let heroSection = document.getElementById("heroSection");
    let verifiedArtist = document.getElementById("verifiedArtist");
    let heroArtistName = document.getElementById("heroArtistName");
    let heroArtistView = document.getElementById("heroArtistView");
    let imgHero = document.getElementById("imgHero");

    imgHero.setAttribute("src", `${object.picture_xl}`);
    verifiedArtist.innerHTML = `<i class="bi bi-patch-check-fill text-info fs-4"></i><span>&nbsp;Artista Verificato</span>`;
    heroArtistName.innerText = object.name;
    heroArtistView.innerText = `${fixNumber(object.nb_fan)} Ascoltatori Mensili`;
}

function printSongList(object) {
    let artistSongList = document.getElementById("artistSongList");
    let songListDue = document.getElementById("songListDue");

    for (let i = 0; i < object.length; i++) {
        let music = JSON.stringify(object[i]);
        let songContainer = document.createElement("div");
        songContainer.className =
            "row row-cols-4 justify-content-between hover-custom card-padre w-100 py-1";

        if (i < 5) {
            artistSongList.appendChild(songContainer);
        } else {
            songListDue.appendChild(songContainer);
        }

        let indexContainer = document.createElement("div");
        let indexPar = document.createElement("p");
        indexContainer.className = "col-index align-content-center text-end ms-3";
        indexPar.innerText = `${i + 1}.`;
        indexContainer.appendChild(indexPar);

        let titleContainer = document.createElement("div");
        titleContainer.className = "col-8 d-flex align-items-center";
        titleContainer.setAttribute("onclick", `addMusic(${music})`);
        let titleImage = document.createElement("img");
        titleImage.className = "imgSong";
        titleImage.setAttribute("alt", "Cover");
        titleImage.setAttribute("src", `${object[i].albumCover}`);
        let titlePar = document.createElement("p");
        titlePar.className = "ps-2";
        titlePar.innerText = `${object[i].trackTitle}`;
        titleContainer.append(titleImage, titlePar);

        let iconContainer = document.createElement("div");
        iconContainer.className = "col-2 text-end align-content-center icon-hover";
        iconContainer.innerHTML = `<i class="bi bi-plus-lg mx-2"></i>`;

        let heartButton = document.createElement("button");
        heartButton.className = "btn";
        heartButton.setAttribute("type", "button");
        heartButton.setAttribute("onclick", `likeFeature(${music})`);
        iconContainer.appendChild(heartButton);

        let heart = document.createElement("i");
        heart.className = "bi bi-heart mx-2 text-success";
        heart.setAttribute("id", object[i].trackId);
        heartButton.appendChild(heart);


        let durataContainer = document.createElement("div");
        durataContainer.className = "col-1 text-end align-content-center";
        let durataPar = document.createElement("p");
        durataPar.innerText = `${convertToMinSec(object[i].duration, false)}`;
        durataContainer.appendChild(durataPar);

        songContainer.append(
            indexContainer,
            titleContainer,
            iconContainer,
            durataContainer
        );
    }
}
function printRecomendedAlbum(object) {
    let artistSelection = document.getElementById("artistSelection");
    let artistAlbumLink = document.createElement("a");
    artistAlbumLink.setAttribute("href", `./album.html?id=${object.album.id}`);
    let albumCover = document.createElement("img");
    albumCover.setAttribute("src", `${object.album.cover_medium}`);
    albumCover.className = "rounded-4";
    let newBadge = document.createElement("span");
    newBadge.className = "badge text-bg-danger position-absolute top-0 start-0";
    newBadge.innerText = "New!";
    let titleBadge = document.createElement("span");
    titleBadge.className =
        "badge text-bg-dark position-absolute bottom-0 start-0";
    titleBadge.innerText = `${object.album.title} - out Now!`;

    artistAlbumLink.append(newBadge, titleBadge, albumCover);
    artistSelection.appendChild(artistAlbumLink);
}

function filterAlbum(object) {
    let newObjectArray = [];
    let controlArray = [];

    for (let i = 0; i < object.length; i++) {
        if (newObjectArray.length === 0) {
            newObjectArray.push(object[i]);
            controlArray.push(object[i].album.id);
        } else if (!controlArray.includes(object[i].album.id)) {
            newObjectArray.push(object[i]);
            controlArray.push(object[i].album.id);
        } else {
            //console.log("E' presente all'interno");
        }

        //console.log(newObjectArray);
        let listDiscografia = document.getElementById("listDiscografia");
        listDiscografia.innerHTML = "";

        for (let i = 0; i < newObjectArray.length; i++) {
            let cardWrapper = document.createElement("div");
            cardWrapper.className =
                "col-4 col-md-3 col-lg-2 col-xxl-1 bg-schede d-flex justify-content-center card-prova g-0";

            let cardContainer = document.createElement("div");
            cardContainer.className = "card-padre d-flex justify-content-center pt-4";
            let card = document.createElement("div");
            card.className = "card bg-transparent border-0 card-figlio";

            let linkImage = document.createElement("a");
            linkImage.setAttribute(
                "href",
                `album.html?id=${newObjectArray[i].album.id}`
            );
            let albumImage = document.createElement("img");
            albumImage.className = "card-img-top img-fluid rounded-4";
            albumImage.setAttribute("src", `${newObjectArray[i].album.cover_medium}`);
            albumImage.setAttribute("alt", "Cover Album");

            let cardBody = document.createElement("div");
            cardBody.className = "card-body";
            let linkTitle = document.createElement("a");
            linkTitle.className = "text-light link-card";
            linkTitle.setAttribute(
                "href",
                `album.html?id=${newObjectArray[i].album.id}`
            );
            let albumTitle = document.createElement("p");
            albumTitle.className = "card-text fs-5";
            albumTitle.innerText = newObjectArray[i].album.title;

            linkTitle.appendChild(albumTitle);
            cardBody.appendChild(linkTitle);

            linkImage.appendChild(albumImage);

            card.append(linkImage, cardBody);
            cardContainer.appendChild(card);
            cardWrapper.appendChild(cardContainer);

            listDiscografia.appendChild(cardWrapper);
        }
    }
}

//Funzione per aggiungere o togliere la classe expanded alla sidebar
function toggleMenu() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("expanded"); // Aggiunge o rimuove la classe "expanded"
}

//FUNZIONE che usa una regex(internetFounded) per inserire uno spacer ogni 3 digit
function fixNumber(element) {
    return element.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
function convertToMinSec(seconds, boolean) {
    let testo = "";
    const minutes = Math.floor(seconds / 60); // ottieni i minuti
    let remainingSeconds = seconds % 60; // ottieni i secondi rimanenti
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

//SEARCH function che riporta alla prima pagina:

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
        listenedSong(object);
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

function likeFeature(element) {
    //console.log(item);
    const song = preferiti.find((item) => item.trackId === element.trackId);

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

        const trashBtn = document.createElement('button');
        trashBtn.className = 'btn ms-auto';
        trashBtn.innerHTML = '<i class="bi bi-trash3 grey-icon fs-small"></i>';
        trashBtn.setAttribute("onclick", `likeFeature(${music})`);
        popularBody.appendChild(trashBtn);
    });
};

//FUNZIONE CHE PERMETTE IL SALVATAGGIO NEL LOCAL STORAGE DELLE CANZONE RECENTEMENTE ASCOLTATE
function listenedSong(canzone) {
    console.log(canzone);
    if (!localStorage.getItem("CanzoniRecenti")) {
        recentSongs.push(canzone);
        localStorage.setItem("CanzoniRecenti", JSON.stringify(recentSongs));
        return;
    } else {
        recentSongs = JSON.parse(localStorage.getItem("CanzoniRecenti"));
        if (recentSongs.length > 10) {
            recentSongs = recentSongs.splice(0, 10);
        }
        const boolean = recentSongs.find((item) => item.trackId === canzone.trackId); //SE è TRUE l'ha trovata
        if (!boolean) { //SE non viene trovata
            recentSongs.unshift(canzone);
            localStorage.setItem("CanzoniRecenti", JSON.stringify(recentSongs));
            return;
        } else {
            //SE POSIZIONE INDEX CANZONE = 0 RETURN ELSE FAI POP DI QUELLA CANZONE E UNSHIFT
            let index = recentSongs.findIndex((item) => item.trackId === canzone.trackId);
            if (index == 0) {
                return;
            } else {
                recentSongs.splice(index, 1);
                console.log(canzone);
                recentSongs.unshift(canzone);
                localStorage.setItem("CanzoniRecenti", JSON.stringify(recentSongs));
                return;
            }


        }
    }
};
