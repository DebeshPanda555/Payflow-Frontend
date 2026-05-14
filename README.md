<div align="center">
  
# 💸 PayFlow - Frontend Application

**The stunning, interactive client interface for the PayFlow ecosystem.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-Styling-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animations-0055FF?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

</div>

---

## 🎨 Overview

The PayFlow Frontend is a premium, highly-polished web application built to deliver an exceptional user experience. It leverages the power of Next.js 14 App Router, dynamic styling with Tailwind CSS, and buttery-smooth micro-animations via Framer Motion. 

This repository contains the presentation layer that communicates securely with the PayFlow Backend API.

### ✨ Highlights

- **Dynamic Visuals:** Glassmorphism UI, interactive hover states, and smooth layout transitions.
- **Interactive 3D Elements:** Animated, interactive virtual credit/debit cards that reflect real-time backend data.
- **AI Chat Interface:** A sleek, conversational UI connected to Google Gemini for real-time financial advice.
- **Responsive Design:** Fully optimized for desktops, tablets, and mobile devices.
- **Secure Authentication:** Protected routing using Next.js middleware and secure token storage.

---

## 🛠️ Architecture & Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **HTTP Client:** Native Fetch API with caching disabled for real-time endpoints
- **Real-Time Communications:** Socket.io-client

---

## 🚀 Local Development

To run the frontend locally, follow these steps:

### Prerequisites
Make sure you have the [PayFlow Backend](https://github.com/yourusername/payflow-backend) running locally on port 5001.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/payflow-frontend.git
   cd payflow-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:5001"
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deployment

This application is optimized for deployment on Vercel.

1. Push your code to GitHub.
2. Import the project into Vercel.
3. Add the `NEXT_PUBLIC_API_URL` environment variable pointing to your live backend URL (e.g., `https://payflow-backend.onrender.com`).
4. Deploy!

<div align="center">
  <i>Part of the PayFlow Fintech Ecosystem</i>
</div>
