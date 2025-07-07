/*
ENTNT Dashboard Types - types.ts
*/

export type User = {
  id: string;
  role: "Admin" | "Patient";
  email: string;
  password: string;
  patientId?: string; // Only present for Patients
};

export type Patient = {
  id: string;
  name: string;
  dob: string; // ISO date string
  contact: string;
  healthInfo: string;
  incidents?: Incident[]; 
  email?: string; // Optional, for Patients
};

export type UploadedFile = {
  name: string;
  url: string; // base64 or blob URL
};

export type Incident = {
  id: string;
  patientId: string;
  title: string;
  description: string;
  comments: string;
  appointmentDate: string; // ISO date string
  cost: number;
  status: "Pending" | "Completed" | "Cancelled" | "Rescheduled";
  treatment?: string;
  nextAppointmentDate?: string;
  files: UploadedFile[];
};

export type AuthContextType = {
  user: User | null | undefined;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateUser: (updated: User) => void;
};
