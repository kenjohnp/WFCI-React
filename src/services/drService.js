import http from "./httpService";
import { apiUrl } from "../config.json";

const soEndPoint = apiUrl + "/salesorders";

function getSOUrl(id) {
  return `${soEndPoint}/${id}`;
}

export function getSO(filter, cancelToken) {
  return http.get(`${soEndPoint}?filter=${filter}`, {
    cancelToken,
  });
}

export function getSOItems(id, filter, cancelToken) {
  return http.get(`${getSOUrl(id)}?filter=${filter}`, { cancelToken });
}

export function getCancelToken() {
  return http.getCancelToken;
}

export function isCancel() {
  return http.isCancel;
}
