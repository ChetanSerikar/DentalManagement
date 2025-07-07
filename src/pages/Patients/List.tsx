import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";
import type { Patient } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";

export default function PatientList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedSearch(search, 300);

  useEffect(() => {
    if (!user) return;

    const stored = JSON.parse(localStorage.getItem("patients") || "[]");
    setPatients(stored);
  }, [user]);

  const handleEdit = (id: string) => {
    navigate(`/patients/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      const updatedPatients = patients.filter((patient) => patient.id !== id);
      setPatients(updatedPatients);
      localStorage.setItem("patients", JSON.stringify(updatedPatients));
    }
  };

  const filteredPatients = patients.filter((p) =>
    [p.name, p.email, p.contact, p.healthInfo].some((field) =>
      field?.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
  );

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center">
        <h1 className="text-2xl font-bold tracking-tight">Patients</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search patients..."
            className="sm:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={() => navigate("/patients/add")}>+ Add Patient</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map((patient) => (
          <Card
            key={patient.id}
            className="bg-background rounded-xl border shadow-sm hover:shadow-md transition-all p-5"
          >
            <div className="flex flex-col h-full space-y-4">
              <CardHeader className="p-0">
                <CardTitle className="text-lg font-semibold tracking-tight">
                  {patient.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground">
                      Date of Birth
                    </div>
                    <p className="text-sm font-medium">{patient.dob}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground">
                      Contact
                    </div>
                    <p className="text-sm font-medium">{patient.contact}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-medium text-muted-foreground">
                    Health Information
                  </div>
                  <p className="text-sm text-foreground/90">{patient.healthInfo}</p>
                </div>
              </CardContent>

              <CardFooter className="p-0 pt-2 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-primary/30 text-primary hover:bg-primary/5 hover:text-primary"
                  onClick={() => handleEdit(patient.id)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
                  onClick={() => handleDelete(patient.id)}
                >
                  Delete
                </Button>
              </CardFooter>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
