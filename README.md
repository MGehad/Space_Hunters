# Space Hunters – NASA Space Biology Knowledge Engine

Space Hunters is a two‑app project created for NASA Space Apps Challenge 2025. The repository contains a production‑ready Flutter mobile app and a companion website. The mobile app is the primary deliverable and includes full AI summaries, AI chat, charts, and favorites. The website is a lightweight showcase with mostly static data and a public demo.

## Quick links
- Mobile live demo: https://appetize.io/app/b_irjfqddzwqp4o4vzl2skhad4va
- Mobile APK Download: https://drive.google.com/drive/folders/1JcKwLZikQUFakTZKuYTlZ0qq2wmFodLw?usp=sharing 
- Mobile live demo (alt): https://appetize.io/app/b_vcshm5adskrcqpm35jqkb3zwsi
- Website live demo: https://space-hunters.netlify.app/
- Mobile source: Space_Hunters/Mobile_Application
- Website source: Space_Hunters/WebSite_Application

## What this project does

- Helps users explore NASA space biology publications with search, filters, and clear AI summaries.
- Answers questions about a selected study through an integrated AI chat.
- Visualizes trends with simple charts and supports saving favorites for later reading.
- Provides a public website that mirrors the experience for fast sharing and judging.

## Repository structure

```
Space_Hunters/
├─ Mobile_Application/        # Flutter app (main, fully functional)
│  ├─ lib/                    # Screens, widgets, services, AI helpers
│  ├─ assets/                 # Icons, images, configs
│  ├─ screenshots/            # Mobile screenshots
│  └─ pubspec.yaml
└─ WebSite_Application/       # Next.js website (mostly static data)
   ├─ app/                    # App Router pages (home, publications, dashboard)
   ├─ components/             # UI components (cards, charts, chat)
   ├─ public/                 # Static files and screenshots
   └─ package.json
```

## Features at a glance

- Mobile app
  - AI summaries split into Background, Results, and Conclusion.
  - AI chat to ask questions about the current paper.
  - Search, category filters, and favorites with local persistence.
  - Charts for distribution and trends.
  - External links to NASA resources when available.

- Website app
  - Responsive UI with dark theme and quick navigation.
  - Publications list, details pages, and simple analytics.
  - Optional AI copilot section for Q&A (using static or mock data).
  - Public demo suitable for quick judging and sharing.

## Data source

The publications list is based on NASA’s public Space Biology publications dataset:
- https://github.com/jgalazka/SB_publications/tree/main

## Live demos

- Mobile (no install required): Appetize links above.
- Website: https://space-hunters.netlify.app/

## Tech stack

- Mobile: Flutter, Dart, Provider, http, Gemini AI for summaries and chat.
- Web: Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn‑style components, Recharts.
- Hosting: Netlify (web), Appetize (mobile demo).

## Getting started – Mobile (primary)

Prerequisites:
- Flutter SDK (stable), Dart SDK
- Android Studio or Xcode, and an emulator or device
- Internet connection

Install and run:
```bash
git clone https://github.com/MGehad/Space_Hunters.git
cd Space_Hunters/Mobile_Application
flutter pub get
flutter run
```

Environment (example):
- Gemini API key for summaries/chat: set it in your secure config or as a dart‑define as used in your code.
- Optional keys for any external services can be added later.

Project notes:
- Screenshots are available under `Mobile_Application/screenshots`.
- The app runs fully from this folder without the website.

## Getting started – Website (auxiliary)

Prerequisites:
- Node.js 18+
- pnpm, npm, or Yarn

Install and run:
```bash
git clone https://github.com/MGehad/Space_Hunters.git
cd Space_Hunters/WebSite_Application
pnpm install   # or: npm install / yarn
pnpm dev       # or: npm run dev / yarn dev
```

Environment (optional):
- If you enable the AI copilot on the web, add your key in a local `.env` file as used by the code.
- Public APIs like APOD or SpaceX can be configured in `.env.local` if needed.

## Screenshots

- Mobile screenshots: `Mobile_Application/screenshots/` (home, lists, details, charts, chat, favorites).
- Website screenshots: `WebSite_Application/public/Screenshots/` (home, publications, dashboard, APOD, charts).

## Roadmap

- Deeper links to NASA OSDR datasets and Task Book pages inside study details.
- Knowledge gaps dashboard with coverage and trend indicators.
- Knowledge graph view for entities and relations across studies.
- Offline caching for mobile and smarter sync.
- Arabic and English localization.

## Contributing

Issues and pull requests are welcome. Please open an issue first to discuss major changes. Keep commits small and clear.

## Acknowledgments

Thanks to NASA Space Apps Challenge 2025, the Space Biology community, and open data contributors. The team also thanks the maintainers of the public publications dataset and the platforms that host the demos.

## Disclaimer

Space Hunters is a community project for educational and hackathon use. It is not an official NASA product. Names and logos may be the property of their respective owners.

***
