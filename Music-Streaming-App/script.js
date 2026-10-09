const ADMIN_EMAIL="admin@melodyhub.com",ADMIN_PASSWORD="admin123";
const defaultSongs=[
{id:1,title:"Midnight Drive",artist:"Luna Ray",genre:"Pop",duration:"3:42",icon:"✦"},
{id:2,title:"Golden Hour",artist:"Aria Bloom",genre:"Chill",duration:"3:18",icon:"☀"},
{id:3,title:"Neon Hearts",artist:"The Echoes",genre:"Electronic",duration:"4:02",icon:"◈"},
{id:4,title:"Ocean Eyes",artist:"Mira Vale",genre:"Chill",duration:"3:56",icon:"◉"},
{id:5,title:"City Lights",artist:"Nova Lane",genre:"Pop",duration:"3:25",icon:"✧"},
{id:6,title:"Afterglow",artist:"Kai Stone",genre:"Indie",duration:"4:11",icon:"☾"},
{id:7,title:"Dreamscape",artist:"Velvet Sky",genre:"Indie",duration:"3:49",icon:"◇"},
{id:8,title:"Electric Soul",artist:"Pulse Avenue",genre:"Electronic",duration:"3:31",icon:"⚡"}];
let songs=JSON.parse(localStorage.getItem("mh_songs")||"null")||defaultSongs,currentIndex=-1,isPlaying=false,selectedGenre="All";
const audio=document.getElementById("audio");
const users=()=>JSON.parse(localStorage.getItem("mh_users")||"[]");
const session=()=>JSON.parse(localStorage.getItem("mh_session")||"null");
function saveSongs(){localStorage.setItem("mh_songs",JSON.stringify(songs))}
function saveUsers(x){localStorage.setItem("mh_users",JSON.stringify(x))}
function switchAuth(m){loginForm.classList.toggle("hidden",m!=="login");signupForm.classList.toggle("hidden",m!=="signup");loginTab.classList.toggle("active",m==="login");signupTab.classList.toggle("active",m==="signup")}
function signup(e){e.preventDefault();let n=signupName.value.trim(),em=signupEmail.value.trim().toLowerCase(),p=signupPassword.value,u=users();if(u.some(x=>x.email===em)){signupMsg.textContent="Email already registered.";return}u.push({name:n,email:em,password:p,role:"user",favorites:[]});saveUsers(u);signupMsg.style.color="#91e6b4";signupMsg.textContent="Account created!";e.target.reset();setTimeout(()=>switchAuth("login"),700)}
function login(e){e.preventDefault();let em=loginEmail.value.trim().toLowerCase(),p=loginPassword.value;if(em===ADMIN_EMAIL&&p===ADMIN_PASSWORD){localStorage.setItem("mh_session",JSON.stringify({name:"Administrator",email:em,role:"admin"}));openApp();return}let u=users().find(x=>x.email===em&&x.password===p);if(!u){loginMsg.textContent="Invalid email or password.";return}localStorage.setItem("mh_session",JSON.stringify({name:u.name,email:u.email,role:"user"}));openApp()}
function openApp(){authView.classList.add("hidden");appView.classList.remove("hidden");let s=session();avatar.textContent=(s?.name||"M")[0].toUpperCase();sideUser.innerHTML=`<strong>${safe(s?.name||"User")}</strong><span>${safe(s?.email||"")}</span>`;adminNav.classList.toggle("hidden",s?.role!=="admin");showSection(s?.role==="admin"?"admin":"home");renderAll()}
function logout(){localStorage.removeItem("mh_session");audio.pause();authView.classList.remove("hidden");appView.classList.add("hidden");switchAuth("login")}
function showSection(id){document.querySelectorAll(".section").forEach(x=>x.classList.add("hidden"));document.getElementById(id)?.classList.remove("hidden");document.querySelectorAll(".nav-btn").forEach(x=>x.classList.toggle("active",x.dataset.section===id));pageTitle.textContent=({home:"Good morning",discover:"Discover music",favorites:"Your favorites",playlists:"Your playlists",admin:"Admin dashboard"})[id]||"MelodyHub";if(id==="favorites")renderFavorites();if(id==="playlists")renderPlaylists();if(id==="admin")renderAdmin()}
function renderAll(){renderGenres();renderSongs();renderFavorites();renderPlaylists();renderAdmin()}
function renderGenres(){let g=["All",...new Set(songs.map(x=>x.genre))];genreRow.innerHTML=g.map(x=>`<button class="genre ${selectedGenre===x?"active":""}" onclick="selectGenre('${safeAttr(x)}')">${safe(x)}</button>`).join("")}
function selectGenre(x){selectedGenre=x;renderGenres();renderSongs()}
function card(s){let a=getFavorites().includes(s.id);return `<article class="song-card"><div class="cover">${s.icon||"♪"}</div><h3>${safe(s.title)}</h3><p>${safe(s.artist)} · ${safe(s.genre)}</p><div class="song-bottom"><span>${safe(s.duration)}</span><div><button class="heart ${a?"active":""}" onclick="toggleFavorite(${s.id})">${a?"♥":"♡"}</button><button class="play-small" onclick="playSong(${s.id})">▶</button></div></div></article>`}
function renderSongs(){let q=(searchInput.value||"").toLowerCase(),f=songs.filter(s=>`${s.title} ${s.artist} ${s.genre}`.toLowerCase().includes(q)&&(selectedGenre==="All"||s.genre===selectedGenre));songGrid.innerHTML=f.length?f.map(card).join(""):"<p class='message'>No songs found.</p>";homeSongs.innerHTML=songs.slice(0,4).map(card).join("")}
function currentUser(){let s=session();return users().find(x=>x.email===s?.email)}
function getFavorites(){return currentUser()?.favorites||[]}
function toggleFavorite(id){let s=session();if(!s||s.role==="admin")return;let u=users(),x=u.find(y=>y.email===s.email);x.favorites=x.favorites||[];x.favorites=x.favorites.includes(id)?x.favorites.filter(y=>y!==id):[...x.favorites,id];saveUsers(u);renderAll()}
function renderFavorites(){let f=songs.filter(x=>getFavorites().includes(x.id));favoriteGrid.innerHTML=f.length?f.map(card).join(""):`<div class="playlist"><div class="playlist-icon">♡</div><h3>No favorites yet</h3><p>Tap the heart on a song to save it here.</p></div>`}
function renderPlaylists(){let u=currentUser(),k="mh_playlists_"+(u?.email||"guest"),p=JSON.parse(localStorage.getItem(k)||"[]");playlistList.innerHTML=p.length?p.map(x=>`<div class="playlist"><div class="playlist-icon">♫</div><h3>${safe(x.name)}</h3><p>${x.count} songs · Created locally</p></div>`).join(""):`<div class="playlist"><div class="playlist-icon">☷</div><h3>My first playlist</h3><p>Create a playlist to organize tracks.</p></div>`}
function createPlaylist(){let n=prompt("Enter playlist name:");if(!n?.trim())return;let u=currentUser(),k="mh_playlists_"+u.email,p=JSON.parse(localStorage.getItem(k)||"[]");p.push({name:n.trim(),count:0});localStorage.setItem(k,JSON.stringify(p));renderPlaylists()}
function playSong(id){let i=songs.findIndex(x=>x.id===id);if(i<0)return;currentIndex=i;let s=songs[i];playerTitle.textContent=s.title;playerArtist.textContent=s.artist;playerCover.textContent=s.icon||"♪";duration.textContent=s.duration;isPlaying=true;if(s.file){audio.src=s.file;audio.play().catch(()=>{});playBtn.textContent="❚❚"}else{audio.pause();playBtn.textContent="❚❚"}}
function togglePlay(){if(currentIndex<0){if(songs[0])playSong(songs[0].id);return}let s=songs[currentIndex];if(s.file){if(audio.paused){audio.play();isPlaying=true;playBtn.textContent="❚❚"}else{audio.pause();isPlaying=false;playBtn.textContent="▶"}}else{isPlaying=!isPlaying;playBtn.textContent=isPlaying?"❚❚":"▶"}}
function nextSong(){if(songs.length){currentIndex=(currentIndex+1)%songs.length;playSong(songs[currentIndex].id)}}
function previousSong(){if(songs.length){currentIndex=(currentIndex-1+songs.length)%songs.length;playSong(songs[currentIndex].id)}}
function seekSong(v){if(audio.duration)audio.currentTime=v/100*audio.duration}
audio.addEventListener("timeupdate",()=>{if(audio.duration){progress.value=audio.currentTime/audio.duration*100;currentTime.textContent=fmt(audio.currentTime);duration.textContent=fmt(audio.duration)}});audio.addEventListener("ended",nextSong)
function fmt(x){x=Number(x)||0;return`${Math.floor(x/60)}:${String(Math.floor(x%60)).padStart(2,"0")}`}
function renderAdmin(){if(session()?.role!=="admin")return;let u=users();statUsers.textContent=u.length;statSongs.textContent=songs.length;statFavs.textContent=u.reduce((n,x)=>n+(x.favorites?.length||0),0);adminSongList.innerHTML=songs.map(s=>`<div class="admin-row"><div><strong>${safe(s.title)}</strong><br><small>${safe(s.artist)} · ${safe(s.genre)} · ${safe(s.duration)}</small></div><button class="danger" onclick="deleteSong(${s.id})">Delete</button></div>`).join("");adminUsers.innerHTML=u.length?u.map(x=>`<div class="admin-row"><div><strong>${safe(x.name)}</strong><br><small>${safe(x.email)}</small></div><span>${x.favorites?.length||0} favorites</span></div>`).join(""):"<p class='message'>No registered users.</p>"}
function addSong(e){e.preventDefault();songs.push({id:Date.now(),title:newTitle.value.trim(),artist:newArtist.value.trim(),genre:newGenre.value.trim(),duration:newDuration.value.trim(),icon:"♪"});saveSongs();e.target.reset();renderAll()}
function deleteSong(id){songs=songs.filter(x=>x.id!==id);saveSongs();renderAll()}
function safe(x){return String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function safeAttr(x){return safe(x).replace(/"/g,"&quot;")}
if(session())openApp();
