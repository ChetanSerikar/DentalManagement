import { useAuth } from "@/context/auth-context";
import type { Incident, Patient } from "@/types";
import { mockIncidents, mockPatients } from "@/utils/mockData";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  User,
  Banknote,
  UserCheck,
  Stethoscope,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ChartAppointmentsStatus } from "@/components/ChartAppointmentsStatus";
import { ChartRevenueByTreatment } from "@/components/ChartRevenueByTreatment";
import { ChartTreatmentsPerMonth } from "@/components/ChartTreatmentsPerMonth";
import { ChartDailyVisits } from "@/components/ChartDailyVisits";

export default function Dashboard() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const storedPatients =
      JSON.parse(localStorage.getItem("patients") || "[]") || mockPatients;
    const storedIncidents =
      JSON.parse(localStorage.getItem("incidents") || "[]") || mockIncidents;

    setPatients(storedPatients);
    setIncidents(storedIncidents);
    setLoading(false);
  }, [user]);

  const now = new Date();

  const upcomingAppointments = incidents
    .filter((i) => new Date(i.appointmentDate) > now)
    .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
    .slice(0, 10);

  const pendingTreatments = incidents.filter((i) => i.status === "Pending");
  const completedTreatments = incidents.filter((i) => i.status === "Completed");
  const revenue = completedTreatments.reduce((sum, i) => sum + (i.cost || 0), 0);

  const patientAppointmentsMap: Record<string, number> = {};
  for (const incident of incidents) {
    if (incident.patientId) {
      patientAppointmentsMap[incident.patientId] =
        (patientAppointmentsMap[incident.patientId] || 0) + 1;
    }
  }

  const topPatients = patients
    .map((p) => ({
      ...p,
      appointmentCount: patientAppointmentsMap[p.id] || 0,
    }))
    .sort((a, b) => b.appointmentCount - a.appointmentCount)
    .slice(0, 3);

  if (loading) return <div className="p-4">Loading dashboard...</div>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold tracking-tight">Welcome, {user?.email}</h1>

      {/* KPI Cards */}



      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Appointments */}
        <Card className="rounded-lg shadow-md border border-gray-200 p-0">
          <CardContent className="p-6">
            <div className="text-4xl font-semibold text-foreground">
              {upcomingAppointments.length}
            </div>
            <div className="flex items-center  gap-2 mt-3">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground  font-medium">
                Upcoming Appointments
              </p>
            </div>
          </CardContent>
        </Card>

        {/* totalPatients Patients */}
        <Card className="rounded-lg shadow-md border border-gray-200 p-0">
          <CardContent className="p-6">
            <div className="text-4xl font-semibold text-foreground">
              {patients.length}
            </div>
            <div className="flex items-center  gap-2 mt-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground  font-medium">
                Total Patients
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pending Treatments */}
        <Card className="rounded-lg shadow-md border border-gray-200 p-0">
          <CardContent className="p-6">
            <div className="text-4xl font-semibold ">
              {pendingTreatments.length}
            </div>
            <div className="flex items-center  gap-2 mt-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground  font-medium">
                Pending Treatments
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Revenue */}
        <Card className="rounded-lg shadow-md border border-gray-200 p-0">
          <CardContent className="p-6">
            <div className="text-3xl font-semibold">
              ${revenue.toFixed(2)}
            </div>
            <div className="flex items-center  gap-2 mt-3">
              <Banknote className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground  font-medium">
                Revenue (Completed)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Side by Side Section */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Top Patients */}
  <Card className="h-full max-h-[400px] flex flex-col">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-base font-semibold">
        <UserCheck className="w-4 h-4" />
        Top Patients (by Appointments)
      </CardTitle>
    </CardHeader>
    <CardContent className="overflow-y-auto space-y-3 px-4 pb-4">
      {topPatients.length === 0 ? (
        <p className="text-sm text-muted-foreground">No patients found.</p>
      ) : (
        topPatients.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between border rounded px-3 py-2 text-sm"
          >
            <span className="font-medium">{p.name}</span>
            <span className="text-muted-foreground">{p.appointmentCount} appointments</span>
          </div>
        ))
      )}
    </CardContent>
  </Card>

  {/* Upcoming Appointments */}
  <Card className="h-full max-h-[400px] flex flex-col">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-base font-semibold">
        <Stethoscope className="w-4 h-4" />
        Next 10 Appointments
      </CardTitle>
    </CardHeader>
    <CardContent className="overflow-y-auto space-y-3 px-4 pb-4">
      {upcomingAppointments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No upcoming appointments.</p>
      ) : (
        upcomingAppointments.map((app) => {
          const patient = patients.find((p) => p.id === app.patientId);
          return (
            <div
              key={app.id}
              className="border rounded px-3 py-2 text-sm flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{app.title}</p>
                <p className="text-muted-foreground">
                  {patient?.name} — {format(new Date(app.appointmentDate), "PPpp")}
                </p>
              </div>
              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                {app.status}
              </span>
            </div>
          );
        })
      )}
    </CardContent>
  </Card>
</div>

<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
  {/* 3/5 width Pie Chart */}
  <div className="lg:col-span-2">
    <ChartAppointmentsStatus />
  </div>

  {/* Full width on next row - Treatments per Month */}
  <div className="lg:col-span-3">
    <ChartTreatmentsPerMonth />
  </div>
  
  {/* Full width on next row - Daily Visits */}
  <div className="lg:col-span-3">
    <ChartDailyVisits />
  </div>

  {/* 2/5 width Bar Chart */}
  <div className="lg:col-span-2">
    <ChartRevenueByTreatment />
  </div>


</div>


    </div>
  );
}
