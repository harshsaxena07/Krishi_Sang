# KrishiSangh

KrishiSangh is a digital farming support platform built with React + Vite to help farmers access schemes, loans, crop guidance, tools, and AI chat support from one place.

## Features

- Dashboard with quick agricultural actions
- Government scheme exploration and filtering
- Bank loan discovery and details
- Crop image upload and prediction UI
- Tool rental listing
- AI farming chatbot interface
- Farmer profile section
- Language switcher (EN / HI)
- Text-to-speech support for scheme details

## Pages

- `/` Home
- `/dashboard` Dashboard
- `/schemes` Government Schemes
- `/loans` Loans
- `/crop-detection` Crop Disease Detection
- `/tool-rental` Tool Rental
- `/chatbot` AI Chatbot
- `/profile` Farmer Profile

## Architecture

```text
src/
  components/
    layout/
    dashboard/
    schemes/
    loans/
    crop/
    tools/
    chat/
  pages/
  data/
  context/
  styles/
  App.jsx
  main.jsx
```

### Key Notes

- Routing is handled in `App.jsx` using `react-router-dom`.
- Global language state is managed through `context/LanguageContext.jsx`.
- Mock datasets are in `src/data`.
- Styling uses global CSS split by concern in `src/styles`.

## Tech Stack

- React 19
- Vite 8
- React Router DOM 7
- ESLint 9

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
