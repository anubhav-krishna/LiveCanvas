# 🎨 Real-Time Collaborative Drawing Canvas

A real-time, multi-user drawing application where multiple users can draw simultaneously on a shared canvas and see each other’s strokes instantly.

This project demonstrates **Canvas mastery**, **real-time system design**, and **global state synchronization**, including **global undo/redo**.

---

## 🚀 Live Demo

- **Frontend (Vercel):** https://live-canvas-c0mw2l5jl-anubhav-krishnas-projects.vercel.app  
- **Backend (Railway):** https://livecanvas-production.up.railway.app

---

## ✨ Features

### 🎨 Drawing
- Brush & Eraser tools
- Multiple colors
- Adjustable stroke width
- Smooth freehand drawing using raw Canvas API

### ⚡ Real-Time Collaboration
- Live drawing while strokes are in progress
- No refresh required
- Cursor movement visible in real time

### 👥 Multi-User Awareness
- Per-user cursor indicators
- Unique color per user
- Inactive cursors fade automatically

### 🔄 Undo / Redo
- Fully **global undo/redo**
- Any user can undo any other user’s drawing or only their own based on choice
- Server-authoritative canvas state

---

## 🧑‍💻 Tech Stack

### Frontend
- React (Vite)
- HTML Canvas API
- Socket.io Client

### Backend
- Node.js
- Express
- Socket.io Server

### Deployment
- Frontend: Vercel
- Backend: Railway

---

## 📁 Project Structure

```
collaborative-canvas/
├── client/
│   ├── index.html
│   ├── style.css
│   ├── canvas.js
│   ├── websockets.js
│   └── App.jsx
├── server/
│   ├── server.js
│   ├── rooms.js
│   └── drawing-state.js
├── package.json
├── README.md
└── ARCHITECTURE.md
```

---

## ⚙️ Installation & Running Locally

### Clone Repository
```bash
git clone https://github.com/anubhav-krishna/LiveCanvas.git
cd LiveCanvas
```

### Install Dependencies
```bash
npm install
```

### Start Backend
```bash
cd server
npm start
```
Runs on `http://localhost:3000`

### Start Frontend
```bash
cd client
npm run dev
```
Runs on `http://localhost:5173`

---

## 🧪 Testing with Multiple Users

1. Open the app in multiple browser tabs
2. Draw on one tab
3. Observe real-time updates on others
4. Test undo/redo across users

---

## ⚠️ Known Limitations

- In-memory canvas state (no persistence)
- No authentication
- Single shared canvas
- Server restart clears canvas

---

## ⏱️ Time Spent

~ 4 days total:
- Design & architecture
- Real-time sync
- Global undo/redo
- Debugging WebSocket & CORS issues
- Deployment

---

## 📄 Documentation

See **ARCHITECTURE.md** for:
- Data flow Diagram
- WebSocket protocol
- Undo/redo strategy
- Conflict handling
- Performance decisions

---

## 🙌 Author

**Anubhav Krishna**  
