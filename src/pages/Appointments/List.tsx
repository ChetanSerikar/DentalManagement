import { Button } from "@/components/ui/button";
import { Card , CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import type { Incident, Patient } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type AppointmentStatus = "Pending" | "Completed" | "Cancelled" | "Rescheduled";
export default function IncidentList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedSearch(search, 300); // ✅ use hook

  useEffect(() => {
    if (!user) return;

    const loadData = () => {
      const storedIncidents = JSON.parse(localStorage.getItem("incidents") || "[]");
      const storedPatients = JSON.parse(localStorage.getItem("patients") || "[]");
      setIncidents(storedIncidents);
      setPatients(storedPatients);
    };

    loadData();
  }, [user]);

  const getPatientName = (id: string) => patients.find(p => p.id === id)?.name || "Unknown";

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      const updatedIncidents = incidents.filter(incident => incident.id !== id);
      setIncidents(updatedIncidents);
      localStorage.setItem("incidents", JSON.stringify(updatedIncidents));
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/appointments/edit/${id}`);
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    if (!status) return <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800">Unknown</span>;
    const statusClasses = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'Rescheduled': 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };
  
  const filteredIncidents = incidents.filter((incident) => {
    const patient = patients.find((p) => p.id === incident.patientId);
    const patientName = patient?.name?.toLowerCase() || "";
    return (
      incident.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      incident.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      incident.status.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      patientName.includes(debouncedSearch.toLowerCase())
    );
  });

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col sm:flex-row  justify-start md:justify-end gap-4">
       
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto ">
          <Input
            placeholder="Search appointments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />
          <Button onClick={() => navigate("/appointments/add")}>
            +  Appointment
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredIncidents.map(incident => (
          <Card key={incident.id} className="bg-background rounded-xl border shadow-sm hover:shadow-md transition-all p-5">
            <div className="flex flex-col h-full space-y-4">
              <CardHeader className="flex justify-between items-start p-0">
                <div>
                  <CardTitle className="text-lg font-semibold tracking-tight">{incident.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{getPatientName(incident.patientId)}</p>
                </div>
                {getStatusBadge(incident?.status)}
              </CardHeader>

              <CardContent className="grid grid-cols-1 md:grid-cols-2  gap-4 p-0">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Date & Time</p>
                  <p className="text-sm">
                    {new Date(incident.appointmentDate).toLocaleString()}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Description</p>
                  <p className="text-sm">{incident.description}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Cost</p>
                  <p className="text-sm font-medium">
                    {incident.cost ? `$${incident.cost.toFixed(2)}` : 'Not set'}
                  </p>
                </div>
              </CardContent>

            </div>
              <CardFooter className="p-0 pt-2 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-primary hover:text-primary flex-1 border-primary/30 hover:bg-primary/5"
                  onClick={() => handleEdit(incident.id)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive flex-1 border-destructive/30 hover:bg-destructive/5"
                  onClick={() => handleDelete(incident.id)}
                >
                  Delete
                </Button>
              </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
