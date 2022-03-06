import http from "./httpService";
// import { apiUrl } from "../config.json";

export function getMessages() {
  return http.get("http://localhost:3400/api/messages");
}

export function getMetaDatas() {
  return http.get("http://localhost:3400/api/metadats");
}

export function getFiles() {
  return http.get("http://localhost:3400/api/files");
}
