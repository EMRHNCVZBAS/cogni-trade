# CogniTrade

CogniTrade is an AI-powered cryptocurrency analysis platform that combines real-time news sentiment analysis with technical indicators to help traders make smarter decisions.

## Features

- AI-driven news sentiment analysis using FinBERT
- Real-time Binance API integration
- Advanced technical indicators
- Personalized dashboard with portfolio tracking
- Custom alerts and notifications

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Chart.js
- Framer Motion

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
NEXT_PUBLIC_BINANCE_API_KEY=your_binance_api_key
NEXT_PUBLIC_BINANCE_API_SECRET=your_binance_api_secret
```

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

## License

MIT
