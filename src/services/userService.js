/** @format */

import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/users";

function getUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getUsers() {
  return http.get(apiEndpoint);
}

export function getUser(userId) {
  return http.get(getUrl(userId));
}

export function updateUserStatus(user) {
  const body = { ...user };
  return http.put(getUrl(`updateStatus/${body._id}`), body);
}

export function saveUser(user) {
  if (user._id) {
    const body = { ...user };
    delete body._id;
    return http.put(getUrl(user._id), body);
  }
  return http.post(apiEndpoint, user);
}

export function deleteUser(userId) {
  return http.delete(getUrl(userId));
}
