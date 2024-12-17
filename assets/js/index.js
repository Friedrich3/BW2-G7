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

let artistArray = [];
let newArtistArray =[];

let newAlbumArray = [];

class NewObject {
  constructor(_albumId, _albumCover, _albumTitle, _artistName, _artistId, _artistCover) {
    this.albumId = _albumId;
    this.albumCover = _albumCover;
    this.albumTitle = _albumTitle;
    this.artistName = _artistName;
    this.artistId = _artistId;
    this.artistCover = _artistCover;
  }
}

window.addEventListener("load", init());

function init() {
  getArtist();
  getAlbum();
  
}


async function getArtist(){
  let array = shuffle(artist, artistArray)
  for(let i = 0; i < array.length; i++){
    item = array[i].replaceAll(" ","-");
      let artistUrl = `https://striveschool-api.herokuapp.com/api/deezer/search?q=${item}`;
      try{
        let response = await fetch(artistUrl,{
          method: "GET",
          headers:{
            "Content-Type": "application/json"
          },
        });
        let data = await response.json();
        let object = data.data[0];
        //console.log(object);
        newArtistArray.push(new NewObject(
          object.album.id,
          object.album.cover_medium,
          object.album.title,
          object.artist.name,
          object.artist.id,
          object.artist.picture_medium
          

        ));
        
      }catch(error){
        console.log("Error: "+  error);
      }
      
  }
  if(newArtistArray.length == 6){
    let cardContainer = document.getElementById("cardContainer");
    //printCard(newArtistArray, cardContainer);
  }else{
    getArtist();
  }
  
};


async function getAlbum(){

};



//FUNZIONE PER RANDOMICIZZARE UNO DEI DUE ARRAY (artisti o album) PER LA PRINT DELLA PRIMA PAGINA
function shuffle(array, destinazione) {
  array.sort(() => Math.random() - 0.5);
  for(let i = 0; i< 6; i++){
    destinazione.push(array[i]);
  }
  return destinazione;
};

function printCard(item, container) {
  console.log(item)
  container.innerHTML = "";
for(let i = 0 ; i < item.length; i++){
  let cardWrapper = document.createElement("div");
  let card = document.createElement("div");
  let cardImage = document.createElement("img");
  let cardBody = document.createElement("div");
  let cardTitle = document.createElement("p");

  cardWrapper.classList.add("col-2");

  card.classList.add("card","bg-dark","border-0");

  cardImage.classList.add("card-img-top","img-fluid");
  cardImage.setAttribute("src",item[i].artistCover);
  cardImage.setAttribute("alt","Logo Artista")

  cardBody.classList.add("card-body", "bg-dark","text-light");

  cardTitle.classList.add("card-text","fs-2");
  cardTitle.innerText = `${item[i].artistName}`;

  cardBody.appendChild(cardTitle);
  card.append(cardImage,cardBody);
  cardWrapper.appendChild(card);

  container.appendChild(cardWrapper);
}
}


 //Funzione per aggiungere o togliere la classe expanded alla sidebar
function toggleMenu() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("expanded");
}

function searchSelect() { 
    const selectContainer = document.getElementById("selectContainer"); 
    if (selectContainer.style.display === "none" || selectContainer.style.display === "") { 
        selectContainer.style.display = "block"; } 
        else { 
            selectContainer.style.display = "none"; 
        } 
    }

