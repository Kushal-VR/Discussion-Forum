import axios from "axios";

// Central API client for the backend HTTP API.
// Set REACT_APP_API_URL in your .env files, for example:
// - http://localhost:5000               (browser dev)
// - http://10.0.2.2:5000               (Android emulator)
// - http://<your-local-ip>:5000        (real device on same Wi‑Fi)
// - https://discuza.in                 (production)

// Prefer explicit env var, otherwise fall back to localhost in development
// Accept either `REACT_APP_API_URL` or legacy `REACT_APP_BACKEND_URL`.
const envBase = process.env.REACT_APP_API_URL || process.env.REACT_APP_BACKEND_URL;
const devFallback = "http://localhost:5000";
const baseURL = envBase || (process.env.NODE_ENV === "development" ? devFallback : undefined);

if (!baseURL) {
  // eslint-disable-next-line no-console
  console.warn(
    "REACT_APP_API_URL is not set. Using relative requests (frontend origin)."
  );
} else if (process.env.NODE_ENV === "development") {
  // eslint-disable-next-line no-console
  console.info(`Using API base URL: ${baseURL}`);
}

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

export default apiClient;


