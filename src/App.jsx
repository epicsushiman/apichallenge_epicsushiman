import { useState } from 'react';
import './App.css';
const API_BASE = '/api';


export default function App() {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [weather, setWeather] = useState(null);
  const [playlist, setPlaylist] = useState(null);
  const [error, setError] = useState(null);

  /* ───────────────────────── helpers ───────────────────────── */

  async function safeJson(res) {
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) return res.json();

    const text = await res.text();
    throw new Error(text.trim().slice(0, 250) || 'Non-JSON response');
  }

  async function fetchWeatherByCity(name) {
    const res = await fetch(`${API_BASE}/weather/${encodeURIComponent(name)}`);
    if (!res.ok) throw new Error('City not found or weather API failed');
    return safeJson(res);
  }

  async function fetchWeatherByCoords(lat, lon) {
    const res = await fetch(`${API_BASE}/weather/coords?lat=${lat}&lon=${lon}`);
    if (!res.ok) throw new Error('Weather API failed with coordinates');
    return safeJson(res);
  }

  async function fetchPlaylist(desc) {
    const res = await fetch(
      `${API_BASE}/spotify/playlist?weather=${encodeURIComponent(desc)}`
    );
    if (!res.ok) throw new Error('No matching playlist');
    return safeJson(res);
  }

  /* ───────────────────────── handlers ───────────────────────── */

  const handleSubmit = async e => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError(null);
    setWeather(null);
    setPlaylist(null);

    try {
      const w = await fetchWeatherByCity(city.trim());
      setWeather(w);
      setPlaylist(await fetchPlaylist(w.description));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGeo = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported in this browser');
      return;
    }

    setGeoLoading(true);
    setError(null);
    setWeather(null);
    setPlaylist(null);

    navigator.geolocation.getCurrentPosition(
      async pos => {
        try {
          const { latitude, longitude } = pos.coords;
          const w = await fetchWeatherByCoords(latitude, longitude);
          setWeather(w);
          setPlaylist(await fetchPlaylist(w.description));
        } catch (err) {
          setError(err.message);
        } finally {
          setGeoLoading(false);
        }
      },
      err => {
        setError(err.message);
        setGeoLoading(false);
      }
    );
  };

  /* ───────────────────────── render ───────────────────────── */

  return (
    <div className="container">
      <h1>Travel Mood Playlist 🎵 ✈️</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter a city…"
          value={city}
          onChange={e => setCity(e.target.value)}
        />

        <div className="btn-group">
          <button type="submit" disabled={loading}>
            {loading ? 'Loading…' : 'Go'}
          </button>

          <button
            type="button"
            onClick={handleGeo}
            disabled={geoLoading || loading}
            title="Use my current location"
          >
            {geoLoading ? 'Locating…' : '📍'}
          </button>
        </div>
      </form>

      {error && <p className="error">{error}</p>}

      {weather && (
        <section className="card">
          <h2>
            Weather in {weather.city.length > 30 ? 'your location' : weather.city}
          </h2>
          <p>
            {weather.description} — {weather.temp} °C
          </p>
        </section>
      )}

    {playlist && (
      <section className="card">
        <h2>
          Recommended Playlist:{' '}
          <a href={playlist.url} target="_blank" rel="noreferrer">
            {playlist.name}
          </a>
        </h2>
        {playlist.description && <p>{playlist.description}</p>}
        {/* tracks no longer provided; link takes the user to Spotify */}
      </section>
    )}

    </div>
  );
}
