import { useState } from 'react';
import './App.css';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export default function App() {
  const [city, setCity]       = useState('');
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeo]  = useState(false);
  const [weather, setWeather] = useState(null);
  const [playlist, setPl]     = useState(null);
  const [error, setError]     = useState(null);

  /* ───────── helpers ───────── */

  const safeJson = async r => {
    if (r.ok) return r.json();
    throw new Error((await r.json()).error || 'Request failed');
  };

  const wByCity   = n   => fetch(`${API_BASE}/weather/${encodeURIComponent(n)}`).then(safeJson);
  const wByCoords = (x, y) => fetch(`${API_BASE}/weather/coords?lat=${x}&lon=${y}`).then(safeJson);
  const plByDesc  = d   => fetch(`${API_BASE}/spotify/playlist?weather=${encodeURIComponent(d)}`).then(safeJson);

  /* ───────── handlers ───────── */

  const showWeather = async w => {
    setWeather(w);
    try {
      setPl(await plByDesc(w.description));
    } catch (e) {
      setPl(null);
      setError(e.message);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!city.trim()) return;
    setLoading(true); setError(null); setPl(null); setWeather(null);
    try   { await showWeather(await wByCity(city.trim())); }
    catch (e) { setError(e.message); }
    finally  { setLoading(false); }
  };

  const handleGeo = () => {
    if (!navigator.geolocation) return setError('Geolocation not supported');
    setGeo(true); setError(null); setPl(null); setWeather(null);
    navigator.geolocation.getCurrentPosition(
      async pos => {
        try   { await showWeather(await wByCoords(pos.coords.latitude, pos.coords.longitude)); }
        catch (e) { setError(e.message); }
        finally  { setGeo(false); }
      },
      err => { setError(err.message); setGeo(false); }
    );
  };

  /* ───────── view ───────── */

  return (
    <div className="container">
      <h1>Travel Mood Playlist 🎵 ✈️</h1>

      <form onSubmit={handleSubmit}>
        <input value={city} onChange={e => setCity(e.target.value)} placeholder="Enter a city…" />
        <div className="btn-group">
          <button disabled={loading}>{loading ? 'Loading…' : 'Go'}</button>
          <button type="button" onClick={handleGeo} disabled={geoLoading || loading}>
            {geoLoading ? 'Locating…' : '📍'}
          </button>
        </div>
      </form>

      {error   && <p className="error">{error}</p>}
      {weather && (
        <section className="card">
          <h2>Weather in {weather.city}</h2>
          <p>{weather.description} — {weather.temp} °C</p>
        </section>
      )}
      {playlist && (
        <section className="card">
          <h2>
            Recommended Playlist:&nbsp;
            <a href={playlist.url} target="_blank" rel="noreferrer">{playlist.name}</a>
          </h2>
          {playlist.description && <p>{playlist.description}</p>}
        </section>
      )}
    </div>
  );
}
