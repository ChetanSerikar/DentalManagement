// utils/initMockData.ts
import { mockUsers, mockPatients, mockIncidents } from "./mockData";

export function initMockData() {
  if (!localStorage.getItem("authUser")) {
    localStorage.setItem("users", JSON.stringify(mockUsers));
    localStorage.setItem("patients", JSON.stringify(mockPatients));
    localStorage.setItem("incidents", JSON.stringify(mockIncidents));
  }
}
