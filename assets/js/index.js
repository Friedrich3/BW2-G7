// const IdClient = "75023370ae47498eae5b110f6ec8ff52";
// const SecretClient = "7c7a6b5f53444ffca5931d034e16b2d2";
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
            body: `grant_type=client_credentials&client_id=75023370ae47498eae5b110f6ec8ff52&client_secret=7c7a6b5f53444ffca5931d034e16b2d2`,

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







