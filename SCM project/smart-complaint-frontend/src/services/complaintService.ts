import API from "./api";

// GET ONE
export const getComplaint = (id: number) =>
  API.get(`/api/complaints/${id}`);

// GET LOGS (optional)
export const getLogs = (id: number) =>
  API.get(`/api/complaints/${id}/logs`);

// EMERGENCY
export const raiseEmergency = (id: number) =>
  API.post(`/api/complaints/${id}/emergency`);

// REATTEMPT
export const reattemptComplaint = (id: number) =>
  API.post(`/api/complaints/${id}/reattempt`);

// DELETE
export const deleteComplaint = (id: number) =>
  API.delete(`/api/complaints/${id}`);