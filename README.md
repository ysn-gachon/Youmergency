# WakeMate

WakeMate is a remote alarm and wake-up verification app built with React Native and Expo.

## Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run the App:**
    ```bash
    npx expo start
    ```

## Project Structure

*   `src/components`: Reusable UI components
*   `src/screens`: App screens (Home, Login, Controller, Receiver, Map)
*   `src/navigation`: Navigation configuration
*   `src/store`: State management (Zustand)
*   `src/constants`: Theme and constants
*   `src/services`: API services (Supabase)
*   `src/hooks`: Custom hooks
*   `src/utils`: Utility functions

## Configuration

*   **Supabase:** Update `src/services/supabase.js` with your Supabase URL and Anon Key.
*   **Google Maps:** Ensure you have configured Google Maps API keys in `app.json` (not included in this scaffold) for map functionality to work on production builds.

## Features Implemented (Scaffold)

*   **Theme:** Neon Night theme applied.
*   **Navigation:** Basic stack navigation set up.
*   **State Management:** Zustand store initialized.
*   **Screens:** Placeholders for all major screens defined in the spec.
