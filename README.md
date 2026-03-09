<!-- PROJECT SHIELDS -->
<p align="center">
  <img src="https://img.shields.io/badge/platform-React_Native-blue" alt="React Native">
  <img src="https://img.shields.io/badge/framework-Expo-blue" alt="Expo">
  <img src="https://img.shields.io/badge/language-TypeScript-blue" alt="TypeScript">
  <img src="https://img.shields.io/badge/backend-Firebase-orange" alt="Firebase">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
</p>

<h1 align="center">MathPlay</h1>
<p align="center">Mobile math‑training game featuring learning exercises, challenge runs, tutorials, and persistent progress tracking.</p>

--------------------------------------------------

## Overview

MathPlay is a mobile math‑training application built with **React Native** and **Expo**. The goal of the project is to provide an interactive environment where kids can practice mathematics through structured exercises and time‑based challenges.

The application demonstrates mobile application architecture, state management, and backend integration using **Firebase Authentication** and **Firestore** for persistent user data and statistics tracking.

--------------------------------------------------

## Demo

### Demo credentials

**Email:** demo@example.com
**Password:** demo123

### Sign-in & Sign-up

[![Sign-in & Sign-up demo](https://img.youtube.com/vi/cteiOe3lY0w/hqdefault.jpg)](https://www.youtube.com/shorts/cteiOe3lY0w)

### Learn mode

[![Learn mode demo](https://img.youtube.com/vi/HrRRofPNzx8/hqdefault.jpg)](https://www.youtube.com/shorts/HrRRofPNzx8)

### Challenge mode

[![Challenge mode demo](https://img.youtube.com/vi/spa7AZPXCRI/hqdefault.jpg)](https://www.youtube.com/shorts/spa7AZPXCRI)

### Statistics

[![Statistics demo](https://img.youtube.com/vi/9r4221xXS9E/hqdefault.jpg)](https://www.youtube.com/shorts/9r4221xXS9E)

--------------------------------------------------

## Features

- **Learn mode** to learn arithmetic problems at a controlled pace.
- **Challenge mode** with timed problem solving to practice and test speed/accuracy.
- **Tutorial system** explaining gameplay and mechanics.
- **Persistent progress tracking** using Firebase authentication and Firestore, to keep track of your progress.
- **Configurable question engine** supporting varied expressions and difficulty levels.

--------------------------------------------------

## Tech Stack

- **Framework:** React Native
- **Tooling:** Expo Dev Client
- **Language:** TypeScript
- **Backend:** Firebase Authentication
- **Database:** Firestore
- **Navigation:** React Navigation
- **Graphics/UI:** SVG-based interface components

--------------------------------------------------

## Getting Started

### Install the Android APK

The fastest way to try **MathPlay** is to install the Android build from the repository’s **GitHub Releases** page.

#### 1. Open the latest release

Download the APK from the latest release:

``` txt
  https://github.com/LeoPernier/MathPlay/releases/latest
```

#### 2. Install the APK on your Android device

Transfer the APK to your phone if needed, then install it manually.

#### 3. Sign in

You can either create your own account or use the demo account below.

**Demo credentials**

- **Email:** `demo@example.com`
- **Password:** `demo123`

This lets you explore the app without using personal information.

--------------------------------------------------

## Project Structure

``` txt
  src/
   ├── components/                  # UI components
   ├── config/                      # Game presets, difficulty settings and mode configuration
   ├── firebase/
   │   └── FirebaseConfig.ts        # Firebase initialization and service wiring
   ├── logic/
   │   ├── GameEngine.ts            # Core gameplay flow and session logic
   │   └── QuestionFactory.ts       # Arithmetic question generation
   ├── navigation/
   │   ├── AuthNavigator.tsx        # Authentication flow navigation
   │   └── MainNavigator.tsx        # Main in-app navigation
   ├── screens/                     # App screens
   └── icons/                       # Typed icon exports used by the UI

  assets/                           # App icons, splash assets and other bundled images
  android/                          # Android native project
  types/                            # Project-wide TypeScript declarations

  App.tsx                           # Root application component
  index.ts                          # React Native entry point
  app.json                          # Expo application configuration
  eas.json                          # EAS build profiles and distribution settings
  package.json                      # Scripts and dependencies
  tsconfig.json                     # TypeScript configuration
  README.md
  LICENSE
```

--------------------------------------------------

## Design Notes

### 1) Question Engine

The math engine generates arithmetic problems using seeded randomness, allowing varied question sets while keeping the system deterministic for testing and reproducibility.

### 2) Persistence

User authentication and progress data are stored using **Firebase Authentication** and **Firestore**, enabling persistent user sessions and cross‑device progress tracking.

### 3) Modular Architecture

Gameplay logic, UI components and backend integration are separated into distinct modules to keep the project maintainable and easier to extend with new game modes or question types.

--------------------------------------------------

## License

Distributed under the MIT License. See `LICENSE` for more information.
