
<div align="center">
  <a href="https://github.com/yourusername/IdeaBucket">
    <img src="frontend/public/ideabucket.png" alt="IdeaBucket Logo" width="120" height="120">
  </a>

  <h1 align="center">IdeaBucket</h1>

  <p align="center">
    <strong>Intelligent Insight Capture & Organization System</strong>
    <br />
    <em>Powered by Google Gemini Pro Vision</em>
  </p>

  <p align="center">
    <a href="#key-features">Key Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#roadmap">Roadmap</a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Status-Beta-orange?style=for-the-badge" alt="Status">
    <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License">
    <img src="https://img.shields.io/badge/Docker-Enabled-0db7ed?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  </p>
</div>

<br />

## 🌟 About The Project

**IdeaBucket** solves the chaos of scattered thoughts. Whether it's a screenshot, a quick scribble, or a voice note, IdeaBucket uses advanced AI to automatically categorize, tag, and organize your insights into a searchable knowledge base.

It's not just a note-taking app; it's an **AI-native workspace** designed for modern creators and teams.

### ✨ Key Features

- **🧠 Auto-Categorization**: `Gemini Pro` analyzes text and image context to assign relevant tags and categories automatically.
- **👁️ Visual Intelligence**: Drop a screenshot, and IdeaBucket extracts the text, intent, and design patterns.
- **🎨 Modern UI**: Built with a "Glassmorphism" design system, dark mode first, and fluid animations.
- **🐳 Production Ready**: Fully Dockerized with strict security practices (Secrets management, Volume persistence).
- **🔒 Enterprise Security**: Role-based access control (Admin/User) and detailed audit trails.

---

## 🛠️ Tech Stack

<table align="center">
  <tr>
    <td align="center" width="96">
      <a href="https://reactjs.org/">
        <img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" />
      </a>
      <br>React
    </td>
    <td align="center" width="96">
      <a href="https://www.typescriptlang.org/">
        <img src="https://skillicons.dev/icons?i=ts" width="48" height="48" alt="TypeScript" />
      </a>
      <br>TypeScript
    </td>
    <td align="center" width="96">
      <a href="https://tailwindcss.com/">
        <img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="Tailwind" />
      </a>
      <br>Tailwind
    </td>
    <td align="center" width="96">
      <a href="https://fastapi.tiangolo.com/">
        <img src="https://skillicons.dev/icons?i=fastapi" width="48" height="48" alt="FastAPI" />
      </a>
      <br>FastAPI
    </td>
    <td align="center" width="96">
      <a href="https://www.mongodb.com/">
        <img src="https://skillicons.dev/icons?i=mongo" width="48" height="48" alt="MongoDB" />
      </a>
      <br>MongoDB
    </td>
    <td align="center" width="96">
      <a href="https://www.docker.com/">
        <img src="https://skillicons.dev/icons?i=docker" width="48" height="48" alt="Docker" />
      </a>
      <br>Docker
    </td>
  </tr>
</table>

---

## 🚀 Getting Started

Getting your own IdeaBucket running is simple with Docker.

### Prerequisites

*   Docker & Docker Compose
*   A Google Gemini API Key

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/yourusername/IdeaBucket.git
    cd IdeaBucket
    ```

2.  **Configure Environment**
    ```sh
    cp .env.example .env
    # Open .env and add your GEMINI_API_KEY
    ```

3.  **Lift Off 🚀**
    ```sh
    docker-compose up --build
    ```

    - Frontend: `http://localhost:3000`
    - Backend API: `http://localhost:8000/docs`

---

## 📂 Project Structure

```bash
IdeaBucket/
├── backend/            # FastAPI Application (MVC)
│   ├── app/
│   │   ├── services/   # Business Logic (Gemini, S3)
│   │   ├── routers/    # API Endpoints
│   │   └── core/       # Config & Security
├── frontend/           # React + Vite Application
│   ├── src/
│   │   ├── components/ # Dumb/Presentational Components
│   │   ├── hooks/      # Smart Controllers (useWorkspace)
│   │   └── services/   # API Clients
└── docker-compose.yml  # Orchestration
```

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<p align="center">
  Built with ❤️ by the ShoreAI Team
</p>
