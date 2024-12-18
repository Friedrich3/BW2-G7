
const param = new URLSearchParams(window.location.search).get("id");

const albumUrl = `https://striveschool-api.herokuapp.com/api/deezer/album/${param}`;




window.addEventListener("load", init());

function init() {
  getAlbum();

};

async function getAlbum() {
  console.log(albumUrl)
  try {
    let response = await fetch(albumUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    });
    let data = await response.json();
    console.log(data);
  } catch (error) {
    console.log("Error: " + error)
  }
};


//Funzione per aggiungere o togliere la classe expanded alla sidebar
function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('expanded');
};