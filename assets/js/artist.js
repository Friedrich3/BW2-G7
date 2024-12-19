
const param = new URLSearchParams(window.location.search).get("id");

const artistUrl = `https://striveschool-api.herokuapp.com/api/deezer/artist/${param}`;

window.addEventListener("load", init());

function init() {
    getArtist();

};

async function getArtist() {

    try {
        let response = await fetch(artistUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });
        let data = await response.json();
        let object = { ...data };
        printHero(object);
        getDatas(data.name)
    } catch (error) {
        console.log("Error: " + error)
    }
};
async function getDatas(name) {
    let url = `https://striveschool-api.herokuapp.com/api/deezer/search?q=${name}`
    try {
        let response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });
        let data = await response.json();
        let object = data.data;
        console.log(object);
        printSongList(object);
        printRecomendedAlbum(object[0]);
        filterAlbum(object)

    } catch (error) {
        console.log("Error: " + error)
    }
};

function printHero(object) {
    let heroSection = document.getElementById("heroSection");
    let verifiedArtist = document.getElementById("verifiedArtist");
    let heroArtistName = document.getElementById("heroArtistName");
    let heroArtistView = document.getElementById("heroArtistView");

    heroSection.setAttribute("style", `background-image: url(${object.picture_xl})`);
    verifiedArtist.innerHTML = `<i class="bi bi-patch-check-fill text-info fs-4"></i><span>&nbsp;Artista Verificato</span>`;
    heroArtistName.innerText = object.name;
    heroArtistView.innerText = `${fixNumber(object.nb_fan)} Ascoltatori Mensili`;
}

function printSongList(object) {
    let artistSongList = document.getElementById("artistSongList");
    let songListDue = document.getElementById("songListDue");



    for (let i = 0; i < object.length; i++) {
        let songContainer = document.createElement("div");
        songContainer.className = "row row-cols-4 justify-content-between hover-custom card-padre w-100 py-1";

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
        titleContainer.className = "col-7 d-flex align-items-center";
        let titleImage = document.createElement("img");
        titleImage.className = "imgSong";
        titleImage.setAttribute("alt", "Cover")
        titleImage.setAttribute("src", `${object[i].album.cover_small}`)
        let titlePar = document.createElement("p");
        titlePar.className = "ps-2"
        titlePar.innerText = `${object[i].title}`;
        titleContainer.append(titleImage, titlePar);

        let iconContainer = document.createElement("div");
        iconContainer.className = "col-2 text-end align-content-center icon-hover";
        iconContainer.innerHTML = `<i class="bi bi-heart mx-2 text-success"></i><i class="bi bi-plus-lg mx-2"></i>`;

        let durataContainer = document.createElement("div");
        durataContainer.className = "col-2 text-end align-content-center";
        let durataPar = document.createElement("p");
        durataPar.innerText = `${convertToMinSec(object[i].duration, false)}`;
        durataContainer.appendChild(durataPar);

        songContainer.append(indexContainer, titleContainer, iconContainer, durataContainer);
    }

};
function printRecomendedAlbum(object) {
    let artistSelection = document.getElementById("artistSelection");
    let artistAlbumLink = document.createElement("a");
    artistAlbumLink.setAttribute("href", `./album.html?id=${object.album.id}`);
    let albumCover = document.createElement("img");
    albumCover.setAttribute("src", `${object.album.cover_medium}`);
    albumCover.className = "rounded-4"
    let newBadge = document.createElement("span");
    newBadge.className = "badge text-bg-danger position-absolute top-0 start-0"
    newBadge.innerText = "New!"
    let titleBadge = document.createElement("span");
    titleBadge.className = "badge text-bg-dark position-absolute bottom-0 start-0"
    titleBadge.innerText = `${object.album.title} - out Now!`;

    artistAlbumLink.append(newBadge, titleBadge, albumCover);
    artistSelection.appendChild(artistAlbumLink);
};

function filterAlbum(object) {
    let newObjectArray = [];
    let controlArray = [];

    for (let i = 0; i < object.length; i++) {
        if (newObjectArray.length === 0) {
            newObjectArray.push(object[i]);
            controlArray.push(object[i].album.id);

        } else if (!controlArray.includes(object[i].album.id)) {
            newObjectArray.push(object[i]);
            controlArray.push(object[i].album.id)
        } else {
            //console.log("E' presente all'interno");
        }

        //console.log(newObjectArray);
let listDiscografia = document.getElementById("listDiscografia");
        listDiscografia.innerHTML="";

    for (let i = 0; i < newObjectArray.length; i++) {
            let cardWrapper = document.createElement("div");
            cardWrapper.className = "col-4 col-md-3 col-lg-2 col-xxl-1 bg-schede d-flex justify-content-center card-prova g-0";
            
            let cardContainer = document.createElement("div");
            cardContainer.className = "card-padre d-flex justify-content-center pt-4";
            let card = document.createElement("div");
            card.className = "card bg-transparent border-0 card-figlio";

            let linkImage = document.createElement("a");
            linkImage.setAttribute("href",`album.html?id=${newObjectArray[i].album.id}`);
            let albumImage = document.createElement("img");
            albumImage.className = "card-img-top img-fluid rounded-4";
            albumImage.setAttribute("src",`${newObjectArray[i].album.cover_medium}`);
            albumImage.setAttribute("alt","Cover Album");

            let cardBody = document.createElement("div");
            cardBody.className = "card-body";
            let linkTitle = document.createElement("a");
            linkTitle.className = "text-light link-card";
            linkTitle.setAttribute("href",`album.html?id=${newObjectArray[i].album.id}`);
            let albumTitle = document.createElement("p");
            albumTitle.className = "card-text fs-5";
            albumTitle.innerText = newObjectArray[i].album.title;

            linkTitle.appendChild(albumTitle);
            cardBody.appendChild(linkTitle);

            linkImage.appendChild(albumImage);

            card.append(linkImage,cardBody);
            cardContainer.appendChild(card);
            cardWrapper.appendChild(cardContainer);

            listDiscografia.appendChild(cardWrapper);
            


        }
    }




}



//Funzione per aggiungere o togliere la classe expanded alla sidebar
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('expanded'); // Aggiunge o rimuove la classe "expanded"
}


//FUNZIONE che usa una regex(internetFounded) per inserire uno spacer ogni 3 digit
function fixNumber(element) {
    return element.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
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