# Wholepal Frontend

This project is a Next.js application built using Next.js 15, Tailwind CSS, and TypeScript. It serves as the frontend for the Wholepal application and connects to a backend API (currently running on `http://localhost:3000`). In production, the API and this frontend will be deployed on separate Azure servers.

## Table of Contents

- [Wholepal Frontend](#wholepal-frontend)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technology Stack](#technology-stack)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development](#development)
  - [Build and Deployment](#build-and-deployment)

## Features

- **User Registration & Login:** Connects to the Wholepal API for managing user accounts with JWT authentication.
- **Responsive UI:** Styled with Tailwind CSS and Radix UI components for a modern and accessible design.
- **Next.js App Router:** Utilizes the file-based routing system with the latest Next.js 15 features.
- **TypeScript:** Provides type safety throughout the application.
- **API Integration:** Uses Axios to communicate with the backend API.
- **Data Visualization:** Includes Recharts for creating interactive charts and graphs.
- **Theme Support:** Dark/light mode support via next-themes.

## Technology Stack

- [Next.js](https://nextjs.org/) (v15.1.7)
- [React](https://reactjs.org/) (v19.0.0)
- [TypeScript](https://www.typescriptlang.org/) (v5)
- [Tailwind CSS](https://tailwindcss.com/) (v3.4.1)
- [Radix UI](https://www.radix-ui.com/) (various components)
- [Axios](https://axios-http.com/) (v1.8.4)
- [Framer Motion](https://www.framer.com/motion/) (v12.4.10)
- [Recharts](https://recharts.org/) (v2.15.1)
- [Azure](https://azure.microsoft.com/) (for production deployment)

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/wholepal-web.git
   cd wholepal-web
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup:**

   Create a `.env.local` file in the root directory with the following variables:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

## Development

To start the development server:

```bash
npm run dev
# or
yarn dev
```

This will start the development server at [http://localhost:3000](http://localhost:3000).

For linting:

```bash
npm run lint
# or
yarn lint
```

## Build and Deployment

To build the application for production:

```bash
npm run build
# or
yarn build
```

To start the production server:

```bash
npm run start
# or
yarn start
```
