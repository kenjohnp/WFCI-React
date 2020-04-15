import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndPoint = apiUrl + "/salesorders";

function getUrl(id) {
  return `${apiEndPoint}/${id}`;
}

export function getSalesOrders() {
  return http.get(apiEndPoint);
}

export function getSalesOrder(id) {
  return http.get(getUrl(id));
}

export function saveSalesOrder(salesOrder) {
  if (salesOrder._id) {
    const body = { ...salesOrder };
    delete body._id;
    return http.put(getUrl(body._id), body);
  }

  http.post(apiEndPoint, salesOrder);
}

export function deleteSalesOrder(id) {
  return http.delete(getUrl(id));
}
