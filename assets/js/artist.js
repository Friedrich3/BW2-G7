
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
        console.log(data);
    } catch (error) {
        console.log("Error: " + error)
    }
};



//Funzione per aggiungere o togliere la classe expanded alla sidebar
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('expanded'); // Aggiunge o rimuove la classe "expanded"
}