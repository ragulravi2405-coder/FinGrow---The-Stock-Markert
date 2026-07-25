# FinGrow

FinGrow is a modern personal finance and investment tracker built as a full-stack web and mobile application. It helps users monitor their portfolio, goals, watchlist, savings progress, and financial news in one place.

## Features

- Responsive web dashboard
- Investment portfolio tracking with CRUD support
- Savings goals and progress tracking
- Watchlist management
- AI-style finance chat experience
- Financial news integration
- Flutter mobile app experience

## Tech Stack

- Frontend: React, Vite, Material UI
- Backend: Node.js, Express
- Database: MongoDB
- Mobile: Flutter

## Project Structure

- client/: React web app
- server/: Express backend API
- mobile/: Flutter mobile app

## Getting Started

### Web app

```bash
npm install
npm run build
```

### Backend

```bash
cd server
npm install
node src/app.js
```

### Mobile app

```bash
cd mobile
flutter pub get
flutter analyze
flutter run
```

## Environment Variables

Create a `.env` file in the server folder with:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
NEWSDATA_API_KEY=your_news_api_key
```

## Deployment

The web app is ready for static deployment. Build output is generated in the `client/dist` folder.

## License

This project is for demonstration and educational purposes.
