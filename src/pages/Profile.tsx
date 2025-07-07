import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import type { Incident, Patient } from "@/types";
import { useEffect, useState } from "react";

export default function Profile() {
  const { user , logout } = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    if (!user) return;

    const patients: Patient[] = JSON.parse(localStorage.getItem("patients") || "[]");
    const matched = patients.find((p) => p.id === user.patientId);
    setPatient(matched || null);

    const allIncidents: Incident[] = JSON.parse(localStorage.getItem("incidents") || "[]");
    setIncidents(allIncidents.filter((i) => i.patientId === user.patientId));
  }, [user]);

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground text-sm">
          View your personal details and dental history.
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={() => logout()}>
        Logout
      </Button>
    </div>

      {patient && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-800">
              {patient.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">DOB:</span> {patient.dob}
            </p>
            <p>
              <span className="font-medium text-foreground">Contact:</span> {patient.contact}
            </p>
            <p className="md:col-span-2">
              <span className="font-medium text-foreground">Health Info:</span>{" "}
              {patient.healthInfo}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">Appointments</h2>
        <p className="text-sm text-muted-foreground">
          Review your appointment history, status, and costs.
        </p>
      </div>

      <div className="space-y-4">
        {incidents.length === 0 && (
          <p className="text-sm text-gray-500 italic">No appointments found.</p>
        )}

        {incidents.map((incident) => (
          <Card key={incident.id} className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground">
                {incident.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
              <p>{incident.description}</p>
              <p>
                <span className="font-medium text-foreground">Status:</span> {incident.status}
              </p>
              <p>
                <span className="font-medium text-foreground">Cost:</span> ${incident.cost}
              </p>
              {incident.nextAppointmentDate && (
                <p>
                  <span className="font-medium text-foreground">Next:</span>{" "}
                  {new Date(incident.nextAppointmentDate).toLocaleString()}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
