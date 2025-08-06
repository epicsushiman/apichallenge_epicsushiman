# Travel Mood Playlist 🎵 ✈️

A beautiful web application that combines real-time weather data with curated Spotify playlists to match your travel destination’s vibe. Simply enter a city name or use your current location to discover the perfect soundtrack for your journey.

---

## 🌟 Live Demo

| Service | URL |
|---------|-----|
| **Frontend (React)** | <https://apichallenge-epicsushiman.onrender.com> |
| **Backend API** | <https://apichallenge-epicsushiman-backend.onrender.com> |

---

## 📸 Screenshots

| Main Interface | Results View |
|:--------------:|:------------:|
| ![Travel Mood Playlist Interface](screenshot-main.png) | ![Weather and Playlist Results](screenshot-results.png) |

*Left: glassmorphism UI with animated gradient background • Right: weather data for Egypt with a matching summer playlist*

---

## 🚀 Features

- **Real-time Weather Data** – current conditions via **OpenWeatherMap**
- **Smart Mood Mapping** – intelligently links weather → musical mood
- **Spotify Integration** – pulls curated playlists that fit the vibe
- **Location Services** – optional GPS lookup for instant local weather
- **Modern UI/UX** – glassmorphism + smooth animations + responsive layout
- **Cross-platform** – works great on desktop, tablet, and mobile

---

## 🛠️ Tech Stack

| Layer | Key Tools |
|-------|-----------|
| **Frontend** | React 19.1.0 + Vite · Modern CSS3 (glassmorphism) · Google Fonts (Inter & Poppins) · CSS Grid / Flexbox |
| **Backend** | Node.js + Express · ES6 Modules · CORS middleware · dotenv for env-var management |
| **APIs & Services** | OpenWeatherMap · Spotify Web API · Browser Geolocation |

---

## 🏃‍♂️ Quick Start

### Prerequisites

- **Node.js 18+**
- **npm** (or **yarn**)
- API keys for **OpenWeatherMap** and **Spotify**

---

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/epicsushiman/apichallenge_epicsushiman_backend.git
   cd apichallenge_epicsushiman_backend
# 2. Install dependencies
npm install


# 3. Create a .env file in the project root
# (copy-paste the block below, then add your own keys)
cat << 'EOF' > .env
PORT=3000
OPENWEATHER_KEY=your_openweather_api_key_here
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
EOF


# 4. Start the server
# ─ Development (Nodemon / hot reload)
npm run dev

# ─ Production
npm start

