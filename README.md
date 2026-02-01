# Kaushalam 2026 🚀

**The Annual Technical & Cultural Festival of Government Engineering College, Bilaspur.**

![Kaushalam 2026 Screenshot](/public/screenshot.png)

## 🌟 Overview

**Kaushalam 2026** is a futuristic, interactive, and highly optimized web platform built for the upcoming annual fest of GEC Bilaspur. It serves as the central hub for events, registrations, schedules, and gallery showcases, providing a seamless user experience with modern web technologies.

## ✨ Key Features

-   **immersive UI/UX:** Featuring a custom pixel-blast interactive background, 3D prism elements, and smooth Framer Motion animations.
-   **Performance Optimized:** Code splitting with `next/dynamic`, optimized canvas rendering, and lazy loading for lightning-fast load times.
-   **SEO Ready:** Fully optimized with rich metadata, Open Graph tags, JSON-LD structured data, and automated sitemap generation.
-   **Real-time Updates:** Powered by Firebase Realtime Database for dynamic event management.
-   **Responsive Design:** Fully responsive layout built with Tailwind CSS v4, ensuring a great experience on all devices.
-   **Admin Portal:** Secure admin interface for managing events and updates.

## 🛠️ Tech Stack

-   **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
-   **Animations:** [Framer Motion](https://www.framer.com/motion/)
-   **3D & Graphics:** [Three.js](https://threejs.org/), [OGL](https://github.com/oframe/ogl), [Postprocessing](https://github.com/pmndrs/postprocessing)
-   **Backend / Database:** [Firebase](https://firebase.google.com/) (Realtime Database)
-   **Icons:** [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/kausalam2k26.git
    cd kausalam2k26
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root directory and add your Firebase configuration:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
    NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

```
kausalam2k26/
├── app/
│   ├── components/    # Reusable UI components (Hero, Navbar, etc.)
│   ├── views/         # Page views (HomePage, EventsPage, etc.)
│   ├── layout.tsx     # Root layout with SEO & fonts
│   └── page.tsx       # Main entry point with code splitting
├── lib/               # Utility functions & Firebase config
├── public/            # Static assets (images, icons)
├── styles/            # Global styles
└── ...
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  Made with ❤️ by the GEC Bilaspur Tech Team
</p>