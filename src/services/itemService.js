/** @format */

import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/items";

function getUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getItems() {
  return http.get(apiEndpoint);
}

export function saveItem(item) {
  if (item._id) {
    const body = { ...item };
    delete body._id;
    return http.put(getUrl(item._id), body);
  }

  return http.post(apiEndpoint, item);
}

export function deleteItem(itemId) {
  return http.delete(getUrl(itemId));
}
