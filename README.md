<h2 align="center">Online Discussion Forum<h2>
<p align="center">Engage in meaningful discussions, share knowledge, and collaborate with the community.</p>

<br/>

<h2 align="center">💻 Demo</h2>

<p align="center">
 👨‍💻 Visit <a href="https://discuza.in" target="_blank"><strong>discuza.in</strong></a><br>
</p>

## Mobile App (Capacitor Android)

The existing React SPA in `frontend/` can also be run as a native Android app using Capacitor. The backend remains a normal Node/Express API in `backend/`.

### Prerequisites

- **Node.js** and **npm**
- **Android Studio**
- **Java SDK** (JDK 11 or newer)
- **Android SDK** (installed via Android Studio)

### Backend setup

From `Discussion-Forum/backend`:

- Install dependencies:

```bash
npm install
```

- Run the backend locally (port `5000`):

```bash
npm start
```

### Frontend (web) setup

From `Discussion-Forum/frontend`:

- Install dependencies:

```bash
npm install
```

- Run the SPA in the browser (Create React App, dev mode on `http://localhost:3000`):

```bash
npm start
```

- Build the frontend for production (output to the `build/` folder, which Capacitor uses as `webDir`):

```bash
npm run build
```

### API base URL configuration

The frontend HTTP API client is centralized in `frontend/src/utils/apiClient.js` and reads `REACT_APP_API_URL` from your `.env` file.

Set `REACT_APP_API_URL` depending on how you are running the app:

- **Browser dev (local)**:
  - `REACT_APP_API_URL=http://localhost:5000`
- **Android emulator** (backend running on your machine):
  - `REACT_APP_API_URL=http://10.0.2.2:5000`
- **Real device on same Wi‑Fi** (replace `<your-local-ip>` with your machine’s LAN IP):
  - `REACT_APP_API_URL=http://<your-local-ip>:5000`
- **Production**:
  - `REACT_APP_API_URL=https://discuza.in`

> Note: Existing `.env` files are respected. Do not commit secrets to version control.

### Capacitor commands

Capacitor is configured in `frontend/capacitor.config.json` with:

- `appId: "com.discuza.app"`
- `appName: "Discuza"`
- `webDir: "build"`

From `Discussion-Forum/frontend` you can use:

- Sync web assets and native platforms (equivalent of `npx cap copy`):

```bash
npm run build
npm run cap:copy
```

- Sync including dependencies and plugins (equivalent of `npx cap sync`):

```bash
npm run build
npm run cap:sync
```

- Open the Android project in Android Studio (equivalent of `npx cap open android`):

```bash
npm run cap:open:android
```

The Android project is located under `frontend/android`. The first time, Android Studio may need to download Gradle and SDK components.

### Running the Android app

1. **Start the backend** (`npm start` in `backend/`).
2. **Set `REACT_APP_API_URL`** in `frontend/.env` based on your scenario:
   - Emulator: `http://10.0.2.2:5000`
   - Real device: `http://<your-local-ip>:5000`
3. **Build and sync** the frontend:

```bash
cd frontend
npm run build
npm run cap:sync
```

4. **Open Android Studio**:

```bash
npm run cap:open:android
```

5. **Run on emulator**:
   - Select an Android Virtual Device (AVD) and click **Run**. The app will call the backend via `http://10.0.2.2:5000`.

6. **Run on a physical device**:
   - Connect the device via USB (or enable wireless debugging), select it in Android Studio, and **Run**.
   - Ensure the device and your development machine are on the same Wi‑Fi network.
   - Set `REACT_APP_API_URL` to `http://<your-local-ip>:5000` so the device can reach the backend.
