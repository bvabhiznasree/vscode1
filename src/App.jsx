import React, { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

const audioSamples = [
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
];

const initialSongs = [
  { id: 1, title: "Vellipomaakey", artist: "Sid Sriram", movie: "Saahasam Swaasaga Saagipo", duration: "4:21", color: ["#8b4b9f", "#e77b9c"], audio: audioSamples[0], lyrics: "నీలి నీలి ఆకాశం\nమనసులోనే ఈ మౌనం\nచిన్ని చిన్ని ఆశలతో\nసాగిపోదాం ఈ పయనం\n\n(Original demo lyrics)" },
  { id: 2, title: "Inkem Inkem Inkem Kaavaale", artist: "Sid Sriram", movie: "Geetha Govindam", duration: "4:26", color: ["#d36a91", "#693d87"], audio: audioSamples[1], lyrics: "నీ నవ్వే నా ఉదయం\nనీ మాటే నా హృదయం\nప్రతి క్షణం ఒక కథలా\nనీతో సాగె ప్రయాణం\n\n(Original demo lyrics)" },
  { id: 3, title: "Samajavaragamana", artist: "Sid Sriram", movie: "Ala Vaikunthapurramuloo", duration: "3:39", color: ["#db9654", "#9e4777"], audio: audioSamples[2], lyrics: "సరిగమల సవ్వడిలో\nసందడిగా ఈ వేళలో\nరాగమై నువ్వు రావా\nరంగుల కలలు తేవా\n\n(Original demo lyrics)" },
  { id: 4, title: "Butta Bomma", artist: "Armaan Malik", movie: "Ala Vaikunthapurramuloo", duration: "3:18", color: ["#e1a64d", "#d55e82"], audio: audioSamples[3], lyrics: "చిరునవ్వుల హరివిల్లు\nచూపుల్లోని మెరుపులు\nఅడుగడుగున ఆనందం\nమనసంతా సంగీతం\n\n(Original demo lyrics)" },
  { id: 5, title: "Oo Antava (Instrumental Demo)", artist: "D. S. P.", movie: "Pushpa: The Rise", duration: "3:05", color: ["#b24c42", "#e39c54"], audio: audioSamples[4], lyrics: "Beat లో ఒక కొత్త జోష్\nDance లోనే happy dose\nరంగుల రేయి మనదే\nసంగీతమే తోడే\n\n(Original demo lyrics)" },
  { id: 6, title: "Priyathama Priyathama", artist: "Chinmayi", movie: "Majili", duration: "4:02", color: ["#695aaf", "#b77ac5"], audio: audioSamples[5], lyrics: "చందమామ వెలుగులో\nచల్లని ఈ గాలిలో\nఒక చిన్న కలలా\nనువ్వుంటే చాలుగా\n\n(Original demo lyrics)" },
  { id: 7, title: "Nee Kannu Neeli Samudram", artist: "Javed Ali", movie: "Uppena", duration: "5:12", color: ["#247b91", "#5bb9c4"], audio: audioSamples[0], lyrics: "అలల మాట వినిపించె\nమనసు పాట పాడించె\nనీలి కలల తీరంలో\nకొత్త లోకం కనిపించె\n\n(Original demo lyrics)" },
  { id: 8, title: "Adiga Adiga", artist: "Sid Sriram", movie: "Ninnu Kori", duration: "3:40", color: ["#5e6b9e", "#b87ba2"], audio: audioSamples[1], lyrics: "వెన్నెల జారే వేళలో\nవేల కథలు దాచుకొని\nనీతో నడిచే దారిలో\nనవ్వుల పూలు పూయనీ\n\n(Original demo lyrics)" },
];

const artists = [
  { name: "Sid Sriram", genre: "Melody • Telugu", emoji: "🎙️", colors: ["#8d5ac6", "#e779a9"] },
  { name: "Chinmayi", genre: "Soulful • Playback", emoji: "🎤", colors: ["#d66d91", "#8752b8"] },
  { name: "Armaan Malik", genre: "Pop • Playback", emoji: "🎧", colors: ["#4f91ae", "#7565bd"] },
  { name: "Javed Ali", genre: "Romantic • Playback", emoji: "🎼", colors: ["#d08a4f", "#a64f72"] },
  { name: "D. S. P.", genre: "Composer • Singer", emoji: "🎹", colors: ["#b75a42", "#d9a14f"] },
];

const movies = [
  { name: "Geetha Govindam", year: "2018 • Romance", emoji: "🌸" },
  { name: "Ala Vaikunthapurramuloo", year: "2020 • Drama", emoji: "✨" },
  { name: "Pushpa: The Rise", year: "2021 • Action", emoji: "🔥" },
  { name: "Majili", year: "2019 • Romance", emoji: "🌙" },
  { name: "Uppena", year: "2021 • Romance", emoji: "🌊" },
];

const defaultPlaylists = {
  "Telugu Hits": [1, 2, 3, 4, 6],
  "Chill Vibes": [1, 6, 7],
  "Road Trip": [3, 4, 5],
};

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [songs] = useState(initialSongs);
  const [liked, setLiked] = useState(() => readStorage("rv_react_liked", []));
  const [playlists, setPlaylists] = useState(() => readStorage("rv_react_playlists", defaultPlaylists));
  const [user, setUser] = useState(() => readStorage("rv_react_user", null));
  const [authMode, setAuthMode] = useState("login");
  const [view, setView] = useState("home");
  const [search, setSearch] = useState("");
  const [current, setCurrent] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [toast, setToast] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDesc, setPlaylistDesc] = useState("");
  const [volume, setVolume] = useState(0.75);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [pageTitle, setPageTitle] = useState("");
  const audioRef = useRef(null);
  const toastTimer = useRef(null);

  useEffect(() => localStorage.setItem("rv_react_liked", JSON.stringify(liked)), [liked]);
  useEffect(() => localStorage.setItem("rv_react_playlists", JSON.stringify(playlists)), [playlists]);
  useEffect(() => {
    if (user) localStorage.setItem("rv_react_user", JSON.stringify(user));
    else localStorage.removeItem("rv_react_user");
  }, [user]);
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const notify = (message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2200);
  };

  const playSong = (song) => {
    setCurrent(song);
    setProgress(0);
    setPlaying(true);
    // Audio element source is updated by the effect below.
  };

  useEffect(() => {
    if (!current || !audioRef.current) return;
    audioRef.current.src = current.audio;
    audioRef.current.load();
    audioRef.current.play().then(() => setPlaying(true)).catch(() => {
      setPlaying(false);
      notify("Audio sample could not load. Check your internet connection.");
    });
  }, [current]);

  const togglePlay = () => {
    if (!current) {
      playSong(songs[0]);
      return;
    }
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().then(() => setPlaying(true)).catch(() => notify("Could not play this sample."));
    else {
      audio.pause();
      setPlaying(false);
    }
  };

  const playNext = (direction = 1) => {
    if (!current) return playSong(songs[0]);
    const index = songs.findIndex((song) => song.id === current.id);
    const next = (index + direction + songs.length) % songs.length;
    playSong(songs[next]);
  };

  const toggleLike = (id) => {
    setLiked((old) => old.includes(id) ? old.filter((item) => item !== id) : [...old, id]);
    notify(liked.includes(id) ? "Removed from Liked Songs" : "Added to Liked Songs");
  };

  const createPlaylist = (event) => {
    event.preventDefault();
    const name = playlistName.trim();
    if (!name) return;
    if (playlists[name]) {
      notify("A playlist with that name already exists.");
      return;
    }
    setPlaylists((old) => ({ ...old, [name]: [] }));
    setPlaylistName("");
    setPlaylistDesc("");
    setShowPlaylist(false);
    setView("playlists");
    notify("Playlist created!");
  };

  const openPlaylist = (name) => {
    setPageTitle(name);
    setView("playlist-detail");
  };

  const openArtist = (name) => {
    setPageTitle(name);
    setView("artist-detail");
  };

  const openMovie = (name) => {
    setPageTitle(name);
    setView("movie-detail");
  };

  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return songs;
    return songs.filter((song) => `${song.title} ${song.artist} ${song.movie}`.toLowerCase().includes(q));
  }, [search, songs]);

  const visibleSongs = useMemo(() => {
    if (view === "liked") return songs.filter((song) => liked.includes(song.id));
    if (view === "playlist-detail") return (playlists[pageTitle] || []).map((id) => songs.find((song) => song.id === id)).filter(Boolean);
    if (view === "artist-detail") return songs.filter((song) => song.artist === pageTitle);
    if (view === "movie-detail") return songs.filter((song) => song.movie === pageTitle);
    if (view === "search") return searchResults;
    if (view === "discover") return songs;
    return songs.slice(0, 5);
  }, [view, songs, liked, playlists, pageTitle, searchResults]);

  const title = {
    home: "Trending Telugu picks",
    discover: "Discover music",
    liked: "Liked Songs ♥",
    playlists: "Your playlists",
    "playlist-detail": pageTitle,
    "artist-detail": pageTitle,
    "movie-detail": pageTitle,
    search: `Search results for “${search}”`,
  }[view] || "Music";

  const changeView = (next) => {
    setView(next);
    setSearch("");
    setPageTitle("");
  };

  const onAudioTime = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setProgress(audio.currentTime || 0);
    setDuration(audio.duration || 0);
  };

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return "0:00";
    return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
  };

  const handleAuth = (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const name = authMode === "signup" ? event.target.name.value.trim() : (email.split("@")[0] || "Listener");
    setUser({ name, email });
    setShowAuth(false);
    notify(authMode === "signup" ? "Welcome to RaagaVibe!" : "Logged in (demo).");
  };

  const addSongToPlaylist = (playlist, songId) => {
    setPlaylists((old) => ({
      ...old,
      [playlist]: old[playlist].includes(songId) ? old[playlist] : [...old[playlist], songId],
    }));
    notify(`Added to ${playlist}`);
  };

  const renderTrackList = (list) => (
    <div className="track-list">
      {list.length ? list.map((song, index) => (
        <div className="track-row" key={song.id}>
          <span className="track-number">{String(index + 1).padStart(2, "0")}</span>
          <div className="track-cover" style={{ "--c1": song.color[0], "--c2": song.color[1] }}>♫</div>
          <div className="track-main"><b>{song.title}</b><small>{song.artist}</small></div>
          <span className="track-album">{song.movie}</span>
          <span className="track-time">{song.duration}</span>
          <button className="row-play" onClick={() => playSong(song)} aria-label={`Play ${song.title}`}>▶</button>
          <button className={`row-like ${liked.includes(song.id) ? "liked" : ""}`} onClick={() => toggleLike(song.id)} aria-label="Like song">{liked.includes(song.id) ? "♥" : "♡"}</button>
          <select className="add-select" aria-label="Add to playlist" defaultValue="" onChange={(e) => { if (e.target.value) addSongToPlaylist(e.target.value, song.id); e.target.value = ""; }}>
            <option value="">＋</option>
            {Object.keys(playlists).map((name) => <option value={name} key={name}>{name}</option>)}
          </select>
        </div>
      )) : <div className="empty-state"><b>No songs here yet</b>Like a song or add one to a playlist.</div>}
    </div>
  );

  const renderHome = () => (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><i /> YOUR DAILY SOUNDTRACK</span>
          <h1>Every beat has<br /><em>a feeling.</em></h1>
          <p>Discover your next favourite song — from Telugu chartbusters to sounds from everywhere.</p>
          <div className="hero-actions"><button className="primary-btn" onClick={() => playSong(songs[0])}>▶ Explore music</button><button className="ghost-btn" onClick={() => changeView("discover")}>Discover more ↗</button></div>
          <div className="hero-stats"><div><b>Telugu</b><small>music & more</small></div><div><b>Made for you</b><small>your own playlists</small></div><div><b>Lyrics</b><small>sing along</small></div></div>
        </div>
        <div className="hero-art"><div className="orbit orbit-a" /><div className="orbit orbit-b" /><div className="vinyl"><div className="vinyl-center">♫</div></div><div className="floating-note note-one">♪</div><div className="floating-note note-two">♫</div><div className="hero-tag"><span>NOW PLAYING</span><b>Feel the rhythm ✨</b></div></div>
      </section>
      <section className="section-block">
        <div className="section-heading"><div><span className="eyebrow">HANDPICKED FOR YOU</span><h2>Made for your mood</h2></div></div>
        <div className="mood-grid">
          {[["💗", "Love & Romance", "Romance", "mood-pink"], ["☁️", "Chill mode", "Chill", "mood-blue"], ["⚡", "Full energy", "Energy", "mood-orange"], ["🎶", "Telugu feels", "Telugu", "mood-purple"]].map(([emoji, name, mood, cls]) => <button key={mood} className={`mood-card ${cls}`} onClick={() => { setPageTitle(`${mood} vibes`); setView("mood"); }}><span>{emoji}</span><b>{name}</b><small>Explore this mood</small></button>)}
        </div>
      </section>
      <section className="section-block"><div className="section-heading"><div><span className="eyebrow">THE GOOD STUFF</span><h2>Trending Telugu picks</h2></div><button className="text-link" onClick={() => changeView("discover")}>See all →</button></div>{renderTrackList(songs.slice(0, 5))}</section>
      <section className="section-block"><div className="section-heading"><div><span className="eyebrow">MEET THE VOICES</span><h2>Popular singers</h2></div><button className="text-link" onClick={() => changeView("artists")}>All singers →</button></div><div className="artist-grid">{artists.map((artist) => <button className="artist-card" key={artist.name} onClick={() => openArtist(artist.name)}><div className="artist-avatar" style={{ "--c1": artist.colors[0], "--c2": artist.colors[1] }}>{artist.emoji}</div><b>{artist.name}</b><small>{artist.genre}</small></button>)}</div></section>
      <section className="section-block"><div className="section-heading"><div><span className="eyebrow">SOUNDTRACK STORIES</span><h2>Music from movies</h2></div><button className="text-link" onClick={() => changeView("movies")}>All movies →</button></div><div className="movie-grid">{movies.slice(0, 4).map((movie, i) => <button className="movie-card" key={movie.name} onClick={() => openMovie(movie.name)}><div className={`movie-poster poster-${i}`}>{movie.emoji}</div><div className="movie-info"><b>{movie.name}</b><small>{movie.year}</small></div></button>)}</div></section>
    </>
  );

  const renderArtistPage = () => <div className="artist-grid">{artists.map((artist) => <button className="artist-card" key={artist.name} onClick={() => openArtist(artist.name)}><div className="artist-avatar" style={{ "--c1": artist.colors[0], "--c2": artist.colors[1] }}>{artist.emoji}</div><b>{artist.name}</b><small>{artist.genre}</small></button>)}</div>;
  const renderMoviePage = () => <div className="movie-grid">{movies.map((movie, i) => <button className="movie-card" key={movie.name} onClick={() => openMovie(movie.name)}><div className={`movie-poster poster-${i % 4}`}>{movie.emoji}</div><div className="movie-info"><b>{movie.name}</b><small>{movie.year}</small></div></button>)}</div>;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" onClick={(e) => { e.preventDefault(); changeView("home"); }}><span className="brand-mark">♫</span><span>raaga<span className="brand-accent">vibe</span></span></a>
        <div className="side-label">MENU</div>
        {[["home", "⌂", "Home"], ["discover", "◉", "Discover"], ["artists", "♬", "Singers"], ["movies", "▣", "Movies"]].map(([key, icon, label]) => <button key={key} className={`nav-item ${view === key ? "active" : ""}`} onClick={() => changeView(key)}><span>{icon}</span>{label}</button>)}
        <div className="side-label library-label">YOUR LIBRARY</div>
        <button className={`nav-item ${view === "liked" ? "active" : ""}`} onClick={() => changeView("liked")}><span>♥</span>Liked Songs</button>
        <button className={`nav-item ${view === "playlists" ? "active" : ""}`} onClick={() => changeView("playlists")}><span>▤</span>Your Playlists</button>
        <div className="sidebar-playlist"><div className="side-label">MADE FOR YOU</div>{Object.keys(playlists).slice(0, 4).map((name, i) => <button className="mini-playlist" key={name} onClick={() => openPlaylist(name)}>{["🎧", "🌙", "🚗", "✨"][i]} <span>{name}</span></button>)}</div>
        <div className="sidebar-bottom"><div className="profile-mini"><div className="avatar">{user?.name?.[0]?.toUpperCase() || "G"}</div><div><b>{user?.name || "Guest listener"}</b><small>{user ? "Your vibe is saved here" : "Sign in to save your vibe"}</small></div></div><button className="outline-btn full" onClick={() => { setAuthMode("login"); setShowAuth(true); }}>{user ? "Switch account" : "Log in / Sign up"}</button></div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="history-buttons"><button className="circle-btn" onClick={() => changeView("home")}>‹</button><button className="circle-btn" onClick={() => changeView("discover")}>›</button></div>
          <label className="search-box"><span>⌕</span><input value={search} onChange={(e) => { setSearch(e.target.value); setView("search"); }} placeholder="Search songs, singers, movies..." /><kbd>Ctrl K</kbd></label>
          <div className="top-actions"><button className="premium-pill" onClick={() => setShowPlaylist(true)}>＋ Create playlist</button><button className="user-button" onClick={() => { setAuthMode("login"); setShowAuth(true); }}>● {user?.name?.split(" ")[0] || "Log in"}</button></div>
        </header>

        <section className="content">
          {view === "home" ? renderHome() : (
            <>
              <div className="section-heading page-heading"><div><span className="eyebrow">YOUR RAAGAVIBE COLLECTION</span><h2>{view === "mood" ? pageTitle : title}</h2></div>{view === "playlists" && <button className="premium-pill" onClick={() => setShowPlaylist(true)}>＋ Create playlist</button>}</div>
              {view === "artists" ? renderArtistPage() : view === "movies" ? renderMoviePage() : view === "playlists" ? (
                <div className="movie-grid">{Object.entries(playlists).map(([name, ids], i) => <button className="movie-card" key={name} onClick={() => openPlaylist(name)}><div className={`movie-poster poster-${i % 4}`}>♫</div><div className="movie-info"><b>{name}</b><small>{ids.length} songs • Your collection</small></div></button>)}</div>
              ) : view === "mood" ? renderTrackList(pageTitle.startsWith("Energy") ? songs.slice(2, 5) : pageTitle.startsWith("Chill") ? [songs[0], songs[5], songs[6]] : pageTitle.startsWith("Romance") ? [songs[1], songs[5], songs[7]] : songs.slice(0, 6)) : renderTrackList(visibleSongs)}
            </>
          )}
        </section>
      </main>

      <footer className="player-bar">
        <div className="now-playing"><div className="cover-art" style={current ? { background: `linear-gradient(135deg,${current.color[0]},${current.color[1]})` } : {}}>♫</div><div className="now-meta"><b>{current?.title || "Choose a song"}</b><small>{current ? `${current.artist} • ${current.movie}` : "Your soundtrack starts here"}</small></div><button className={`like-btn ${current && liked.includes(current.id) ? "liked" : ""}`} onClick={() => current && toggleLike(current.id)}>{current && liked.includes(current.id) ? "♥" : "♡"}</button></div>
        <div className="player-center"><div className="player-controls"><button className="control-btn" title="Shuffle" onClick={() => notify("Shuffle is a demo control")}>⤨</button><button className="control-btn" onClick={() => playNext(-1)}>◂</button><button className="play-main" onClick={togglePlay}>{playing ? "Ⅱ" : "▶"}</button><button className="control-btn" onClick={() => playNext(1)}>▸</button><button className="control-btn" title="Repeat" onClick={() => notify("Repeat is a demo control")}>↻</button></div><div className="progress-row"><span>{formatTime(progress)}</span><input type="range" min="0" max={duration || 100} value={Math.min(progress, duration || 100)} onChange={(e) => { if (audioRef.current) audioRef.current.currentTime = Number(e.target.value); }} /><span>{formatTime(duration)}</span></div></div>
        <div className="player-extra"><button className="extra-btn" onClick={() => current ? setShowLyrics(true) : notify("Play a song first to view lyrics")}>▤</button><span>♫</span><input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(Number(e.target.value))} /></div>
      </footer>

      <audio ref={audioRef} onTimeUpdate={onAudioTime} onEnded={() => playNext(1)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
      {showAuth && <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setShowAuth(false)}><div className="modal"><button className="modal-close" onClick={() => setShowAuth(false)}>×</button><div className="modal-brand">♫ raagavibe</div><span className="eyebrow">WELCOME TO YOUR SOUND</span><h2>{authMode === "login" ? "Log in to your vibe" : "Create your account"}</h2><p className="modal-subtitle">Save your favourites and keep your playlists close.</p><div className="auth-tabs"><button className={authMode === "login" ? "auth-tab active" : "auth-tab"} onClick={() => setAuthMode("login")}>Log in</button><button className={authMode === "signup" ? "auth-tab active" : "auth-tab"} onClick={() => setAuthMode("signup")}>Sign up</button></div><form onSubmit={handleAuth}>{authMode === "signup" && <label>Your name<input name="name" placeholder="Your name" required /></label>}<label>Email address<input name="email" type="email" placeholder="you@example.com" required /></label><label>Password<input name="password" type="password" minLength="6" placeholder="At least 6 characters" required /></label><button className="primary-btn full" type="submit">{authMode === "login" ? "Log in" : "Create account"}</button></form><p className="tiny-note">Demo only: account details are stored in this browser. This is not secure production authentication.</p></div></div>}
      {showPlaylist && <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setShowPlaylist(false)}><div className="modal"><button className="modal-close" onClick={() => setShowPlaylist(false)}>×</button><span className="eyebrow">MAKE IT YOURS</span><h2>Create a playlist</h2><p className="modal-subtitle">Give your collection a name and start adding songs.</p><form onSubmit={createPlaylist}><label>Playlist name<input value={playlistName} onChange={(e) => setPlaylistName(e.target.value)} placeholder="e.g. Late night Telugu" maxLength="30" required /></label><label>Short description<input value={playlistDesc} onChange={(e) => setPlaylistDesc(e.target.value)} placeholder="A little mood description" /></label><button className="primary-btn full" type="submit">＋ Create playlist</button></form></div></div>}
      {showLyrics && current && <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setShowLyrics(false)}><div className="modal lyrics-modal"><button className="modal-close" onClick={() => setShowLyrics(false)}>×</button><div className="lyrics-top"><span className="eyebrow">SING ALONG</span><span className="lyrics-chip">LYRICS</span></div><h2>{current.title}</h2><p className="modal-subtitle">{current.artist} • {current.movie}</p><div className="lyrics-text">{current.lyrics}</div><p className="tiny-note">Original demo lyrics for this project. Use licensed lyrics before publishing.</p></div></div>}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
