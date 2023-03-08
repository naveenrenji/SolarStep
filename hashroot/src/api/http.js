import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:3001/api/",
  timeout: 1000,
});

export default http;
