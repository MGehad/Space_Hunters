# Space Hunters – NASA Space Biology App

Discover NASA space biology publications, explore themes, view real‑time space data, and chat with an AI copilot.

## 1. Project Title

Space Hunters – NASA Space App

## 2. Overview

Space Hunters is a modern web application that aggregates NASA space biology publications and augments them with dashboards, knowledge gaps, and real‑time data (APOD, Near‑Earth Objects, and SpaceX launches). It also includes an AI assistant to answer questions about studies and datasets. Built with Next.js App Router, Tailwind CSS, and a rich set of UI components.

## 3. Live Demo

- Website: [Live Demo](https://space-hunters.netlify.app/)

## 4. Features

- Responsive, accessible UI with dark theme
- Publications library with search, quick filters, and detail pages
- Favorites system with local persistence
- Space Dashboard: APOD, Near‑Earth Objects, SpaceX launches, quotes
- Knowledge Gaps view synthesized from publications
- Data Integrations overview (OSDR, GeneLab, more)
- AI Copilot chat for Q&A about publications (Gemini API)
- Charts and analytics for publications per year and by category
- Fast routing, loading states, and cached API calls

## 5. Tech Stack

- Framework: Next.js 14 (App Router), React 18, TypeScript
- Styling: Tailwind CSS 4, Radix UI, shadcn‑style components
- Charts: Recharts
- Forms: React Hook Form, Zod
- State/UX: next-themes, Sonner toasts
- APIs: NASA APOD, SpaceX, local mock data; Google Gemini for AI

## 6. Screenshots


![Home](./screenshots/screenshot1.png)
![Publications](./screenshots/screenshot2.png)
![Dashboard](./screenshots/screenshot3.png)
![APOD](./screenshots/screenshot4.png)
![Details](./screenshots/screenshot5.png)
![Favorites](./screenshots/screenshot6.png)
![Knowledge Gaps](./screenshots/screenshot7.png)
![Data Integrations](./screenshots/screenshot8.png)

## 7. Installation

Prerequisites:

- Node.js 18+
- PNPM, npm, or Yarn

Clone and install:

```bash
git clone https://github.com/MGehad/Space_Hunters.git
cd nasa-space-biology-app
pnpm install  # or npm install / yarn
```

Project structure (high level):

```
app/                # App Router pages (dashboard, APOD, publications, etc.)
components/         # UI components (cards, charts, sidebar, AI chat)
lib/                # API clients, config, utilities
public/             # Static assets (data, images)
styles/             # Global styles
```
