import axios from "axios";
import getBackendURL from "./getBackendURL";

// Central API client for the backend HTTP API.
// Automatically detects platform and uses the correct backend URL:
// - Web browser: http://localhost:5132
// - Android emulator: http://10.0.2.2:5132
// - iOS simulator: http://localhost:5132

const baseURL = getBackendURL();

if (process.env.NODE_ENV === "development") {
  // eslint-disable-next-line no-console
  console.info(`Using API base URL: ${baseURL}`);
}

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

export default apiClient;

