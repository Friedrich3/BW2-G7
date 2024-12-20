# BW2-G7

Build Week 2 - Gruppo 7

-Abbiamo creato un'App clone di Spotify, simulando alcune delle funzionalità principali.

# Struttura

-L'App è composta principalmente da 3 pagine html: index, album e artist. Ad ogni pagina html corrisponde un file JS, mentre il file CSS è unico per tutte le pagine;
-La pagina index.html, relativa alla HomePage, racchiude in essa le caratteristiche principali dell'interfaccia originale di Spotify;
-La pagina album.html riporta l'utente alla sezione "album" di un determinato artista;
-La pagina artist.html riporta infine l'utente alla pagina relativa alla discografia di un determinato artista.

# Elementi Comuni

HEADER
Nella header sono presenti:
-il logo dell'app;
-il bottone "Home" che riporta sempre alla HomePage;
-una searchBar per la funzione di ricerca;
-due icone finali, non funzionanti, che fanno riferimento alle sezioni Notifiche e Account.

SIDEBAR
All'interno della SideBar, sulla sinistra della pagina, troviamo la libreria dell'utente così composta:
-sezione "La mia Libreria" con relativa icona, che al click apre o chiude la sidebar;
-bottoni "Playlist", "Artisti" e "Album", non funzionanti, che simulano la sidebar dell'app originale;
-due icone, "cerca" e "lista", anch'esse non funzionanti;
-lista dei brani preferiti;

PLAYER
In fondo ad ogni pagina, è presente la barra del player come elemento fisso. E' composta da:
-sezione "brano" composta dall'immagine relativa all'album che contiene il brano in riproduzione, titolo del brano e artista;
-il player vero e proprio contiene 5 icone tipiche di ogni player, di cui soltanto l'icona centrale "play" è funzionante e permette di avviare e/o interrompere il brano;
-sotto la sezione delle icone è presente la progress bar funzionante che si riempie con lo scorrere dei secondi del brano (che può anche essere portato avanti o indietro con il mouse) con accanto il conteggio dei minuti/secondi trascorsi in riproduzione;
-una sezione "audio" contenente tre icone, non funzionanti, e una barra che simula la regolazione del volume;
-il player si attiverà, oltre che al click sul suo bottone "play", al click su un brano in qualsiasi pagina.

FOOTER
Si trova in fondo alla sezione main di ognuna delle pagine e contiene link vuoti e icone social. Tutte le componenti del footer sono non funzionanti.

# Funzionalità principali delle pagine

Oltre alle funzionalità degli elementi comuni già elencati, ogni pagina ha le sue peculiarità. Attraverso le funzionalità della HomePage, l'utente viene rimandato alle pagine Album e Artist.

HOMEPAGE
La sezione main della Homepage è così composta:
-4 bottoni, non funzionanti, che simulano la selezione rapida delle sezioni Playlist, Brani, Album e Artisti;
-sezione Recent Songs che contiene la cronologia dei brani riprodotti in precedenza per un massimo di 6 brani;
-sezione Albums contenente vari album di diversi artisti, stampati a video in maniera randomica tramite riferimento all'API. Selezionando la card relativa a un determinato album, l'app ci rimanda direttamente alla sezione Album specifica;
-sezione Artists contenente le schede dei vari artisti, anche in questo caso stampati a video in maniera randomica tramite riferimento all'API, che al click riporta l'utente alla scheda dell'artista selezionato.

ALBUM
L'utente viene riportato alla pagina Album al click di un determinato album presente all'interno della relativa sezione presente sulla HomePage. Su questa pagina sono presenti:
-nella parte superiore, apparirà l'immagine di copertina dell'album con accanto il relativo titolo. Al di sotto del titolo verranno stampati immagine e nome dell'artista e un riassunto del contenuto di quell'album, ovvero numero di brani, durata totale e anno di pubblicazione;
-al di sotto di questa sezione, verrà stampata la lista dei brani (con immagine di copertina e relativa durata) contenuti nell'album;
-su ogni brano, all'hover, appariranno le icone "aggiungi" (non funzionante) e "preferiti";
-al click sull'icona "preferiti", il brano verrà salvato su localStorage e stampato su "La mia Libreria" all'interno della sidebar;

ARTIST
L'utente viene riportato alla pagina Artist al click sulla card di un determinato artista presente all'interno della sezione Artists sulla HomePage. La Struttura della pagina è composta da:
-la parte superiore che contiene un'immagine di copertina in background che raffigura l'artista selezionato, il nome dell'artista e il numero di ascoltatori mensili;
-sotto l'immagine sono presenti un bottone "play", un bottone "segui" e una select che apre un elenco contenente le opzioni "follow", "share" e "block". Tutti questi componenti non sono funzionanti;
-nel corpo della sezione principale sono presenti due colonne di contenuto: quella a sinistra contiene una lista dei brani più popolari di quell'artista, mentre quella sulla destra contiene un album in evidenza che al click riporta l'utente alla sezione Album ad esso relativa;
-la lista dei brani popolari è nuovamente composta da Immagine, Titolo e durata, e anche in questo caso l'icona "preferiti" che compare all'hover salverà i dati su localStorage e li stamperà sulla sidebar;
-successivamente alla principale si trova la sezione relativa all'intera discografia dell'artista; anche in questo caso, al click sulla card di un album, l'utente verrà reindirizzato alla pagina Album

# Tecnologie utilizzate:

- **HTML**: Struttura delle pagine.
- **API Deezer**: endpoint di recupero dati per la creazione dell'app e l'integrazione delle sue funzionalità.
- **JavaScript**: implementazione delle funzionalità dell'interfaccia utente con riferimento ai dati provenienti dall'API.
- **Bootstrap**: gestione grafica dell'interfaccia utente, responsive e icone.
- **CSS**: Override delle propietà di Bootstrap e personalizzazione degli elementi, responsive.

# Requisiti del sistema:

- Navigazione compatibile con la maggior parte dei browser moderni.

# Licenza

Il progetto è sotto licenza MIT.

# Developers

- Ninfa Lissette Carreno Jacho
- Federico Tonti
- Chiara Giovanna Nughedu
- Federico Lepore
- Eliana Anglona Farina
