// const IdClient = "4f1b2e091d6c46228401483cabb9b916";
// const SecretClient = "3a21d0dac02c4e629b9c3110a090741b";
const tokenUrl = "https://accounts.spotify.com/api/token";
let tokenData = "";
//let TokenAuth = "Bearer "+ getToken();
const artistUrl="https://api.spotify.com/v1/artists/40DqL6Tv84cKT2pH2NMs9r";

const trySong = 'https://api.spotify.com/v1/search?q=la%20notte&type=track'

// https://api.spotify.com/v1/search?q=pop&type=playlist

window.addEventListener("load",init());

function init(){
    getToken();
    
   
    
}
async function getToken() {
    try{
        let response = await fetch(tokenUrl, {
            method: "POST",
            headers:{
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `grant_type=client_credentials&client_id=4f1b2e091d6c46228401483cabb9b916&client_secret=3a21d0dac02c4e629b9c3110a090741b`,

        });
        let data = await response.json();
        let tokenData = data.access_token;
        let TokenAuth = `Bearer ${tokenData}`;
        console.log(TokenAuth);
        getData(TokenAuth);
    
    }catch(error){
        console.log("ERROR: " + error);
    }   
};

async function getData(token) {
    try{
        let response = await fetch(artistUrl,{
            method:"GET",
            headers:{
                "Authorization": token,
            }
        });
        let data = await response.json();
        console.log(data);

    }catch(error){
        console.log("ERRORE GET : " + error);
    }
    
}



window.onSpotifyWebPlaybackSDKReady = () => {
    const token = '[My access token]';
    const player = new Spotify.Player({
      name: 'Web Playback SDK Quick Start Player',
      getOAuthToken: cb => { cb(token); },
      volume: 0.5
    });
}






