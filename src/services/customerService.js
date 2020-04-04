/** @format */

import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/customers";

function getUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getCustomers() {
  return http.get(apiEndpoint);
}

export function saveCustomer(customer) {
  if (customer._id) {
    const body = { ...customer };
    delete body._id;
    delete body.dateCreated;
    return http.put(getUrl(customer._id), body);
  }

  return http.post(apiEndpoint, customer);
}

export function deleteCustomer(customerId) {
  return http.delete(getUrl(customerId));
}
