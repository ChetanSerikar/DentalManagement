import type { User, Patient, Incident } from "@/types";

export const mockUsers: User[] = [
  {
    id: "1",
    role: "Admin",
    email: "admin@entnt.in",
    password: "admin123",
  },
  {
    id: "2",
    role: "Patient",
    email: "john@entnt.in",
    password: "patient123",
    patientId: "p1",
  },
];

export const mockPatients: Patient[] = Array.from({ length: 15 }, (_, i) => {
  const index = i + 1;
  return {
    id: `p${index}`,
    name: `Patient ${index}`,
    dob: `1990-01-${(index % 28 + 1).toString().padStart(2, "0")}`,
    contact: `99999999${index.toString().padStart(2, "0")}`,
    email: `patient${index}@entnt.in`,
    healthInfo: index % 2 === 0 ? "No known issues" : "Allergic to penicillin",
  };
});

export const mockIncidents: Incident[] = Array.from({ length: 10 }, (_, i) => {
  const index = i + 1;

  // Calculate tomorrow's base date
  const base = new Date();
  base.setDate(base.getDate() + 1); // Tomorrow
  base.setHours(9 + i, 0, 0, 0);     // 9:00 AM + i hours

  const appointmentDate = new Date(base);
  const nextAppointmentDate = new Date(appointmentDate);
  nextAppointmentDate.setDate(appointmentDate.getDate() + 7); // 7 days later

  return {
    id: `i${index}`,
    patientId: `p${index}`,
    title: `Dental Appointment ${index}`,
    description: `Routine follow-up for issue ${index}`,
    comments: `Observation ${index}`,
    appointmentDate: appointmentDate.toISOString().slice(0, 19),
    nextAppointmentDate: nextAppointmentDate.toISOString().slice(0, 19),
    cost: 100 + index * 10,
    status:
      index % 4 === 0
        ? "Cancelled"
        : index % 3 === 0
        ? "Rescheduled"
        : index % 2 === 0
        ? "Pending"
        : "Completed",
    treatment: `Procedure ${index}`,
    files: [],
  };
});

