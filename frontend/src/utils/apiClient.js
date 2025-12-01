import axios from "axios";

// Central API client for the backend HTTP API.
// Set REACT_APP_API_URL in your .env files, for example:
// - http://localhost:5000               (browser dev)
// - http://10.0.2.2:5000               (Android emulator)
// - http://<your-local-ip>:5000        (real device on same Wi‑Fi)
// - https://discuza.in                 (production)

const baseURL = process.env.REACT_APP_API_URL;

// You can optionally add a runtime warning in development if baseURL is missing.
if (!baseURL && process.env.NODE_ENV === "development") {
  // eslint-disable-next-line no-console
  console.warn(
    "REACT_APP_API_URL is not set. Backend API requests will fail until it is configured."
  );
}

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

export default apiClient;


