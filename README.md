# Vero - Digital Receipts for the Modern World

A modern Next.js website for Vero, a digital receipt provider built on the Digital Receipt Protocol (DRP).

## About

Vero transforms paper receipts into secure, portable digital records. Built on open standards for seamless integration across merchants, payment processors, and consumers.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Geist Mono

## Design

- **Inspired by**: Stytch.com layout and structure
- **Color Palette**: Based on digitalreceiptprotocol.org
  - Navy Blue: #1e3a8a
  - Bright Blue: #3b82f6
  - Clean, modern aesthetic

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── page.tsx         # Main landing page
│   ├── layout.tsx       # Root layout
│   └── globals.css      # Global styles with Tailwind
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── button.tsx
│   │   ├── grid-background.tsx
│   │   └── spotlight.tsx
│   └── sections/        # Page sections
│       ├── navbar.tsx
│       ├── hero.tsx
│       ├── features.tsx
│       ├── receipt-demo.tsx
│       ├── use-cases.tsx
│       ├── cta.tsx
│       └── footer.tsx
└── lib/                 # Utilities
    └── utils.ts         # Helper functions
```

## Features

- Responsive design for all screen sizes
- Modern UI with gradient effects and animations
- Dark navy sections with receipt visualizations
- Feature grid showcasing DRP benefits
- Optimized for Vercel deployment

## Deploy on Vercel

The easiest way to deploy is using the [Vercel Platform](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

The site is pre-configured for Vercel deployment with `vercel.json`.
