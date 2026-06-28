import axios from "axios";
import { env } from "../config/env";

const api = axios.create({
    baseURL: `${env.serverUrl}/api/v1`,
    headers: { "Content-Type": "application/json" },
});

export default api;
