# Quick Start Guide

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Setup Instructions

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Create Environment File

1. Create a `.env` file in the project root (same folder as `package.json`)
2. Add your Gemini API key:

```env
GEMINI_API_KEY=your-gemini-api-key
```

Get your Gemini API key from: https://ai.google.dev

### Step 3: Start Development Server

```bash
npm run dev
```

Your app will run at `http://localhost:5173`

## Features

- **Mock Database**: Uses localStorage for data persistence (no backend required)
- **Multi-language Support**: English, Hindi, Malayalam, Telugu
- **Voice Assistant**: AI-powered crop analysis
- **Role-based Access**: Support for Farmers, Buyers, and Sellers

## Test Accounts

Pre-configured demo accounts:

- **Farmer**: `narasimharajuaraaaveeti@gmail.com` / `123456`
- **Buyer**: `buyer1@example.com` / `123456`
- **Seller**: `seller1@example.com` / `123456`
- **Demo**: `demo@demo.com` / `demo`

Or create your own account!

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

## Troubleshooting

### Port 5173 already in use?
```bash
npm run dev -- --port 3000
```

### Changes not reflecting?
- Clear browser cache (Ctrl+Shift+Delete)
- Restart dev server (Ctrl+C, then `npm run dev`)

## Project Structure

```
src/
├── components/     # React components
├── contexts/       # React contexts (Auth, Language)
├── hooks/          # Custom React hooks
├── services/       # API and external services
├── locales/        # Translation files
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Next Steps

- Explore the components in `src/components/`
- Check out the mock API in `src/services/api.ts`
- Add your own features!

