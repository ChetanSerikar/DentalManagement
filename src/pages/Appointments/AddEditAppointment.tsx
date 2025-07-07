import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Trash2, UploadCloud, Download, Loader2 } from "lucide-react";
// import { useAuth } from "@/context/auth-context";
import type { Incident, Patient } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type UploadedFile = {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
};

const appointmentSchema = z.object({
  patientId: z.string().nonempty("Patient is required"),
  title: z.string().nonempty("Title is required"),
  description: z.string().optional(),
  comments: z.string().optional(),
  appointmentDate: z.string().nonempty("Appointment date is required"),
  nextAppointmentDate: z.string().optional(),
  treatment: z.string().optional(),
  cost: z.coerce
    .number({ invalid_type_error: "Cost must be a number" })
    .min(0, "Cost cannot be negative"),
  status: z.enum(["Pending", "Completed", "Cancelled", "Rescheduled"]),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

export default function AddEditAppointment() {
  const { id } = useParams();
  const navigate = useNavigate();
  // const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [initialFiles, setInitialFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // New loading state

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientId: "",
      title: "",
      description: "",
      comments: "",
      appointmentDate: "",
      nextAppointmentDate: "",
      treatment: "",
      cost: 0,
      status: "Pending",
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Load patients
        const storedPatients = JSON.parse(
          localStorage.getItem("patients") || "[]"
        );
        setPatients(storedPatients);

        // If editing, load incident data
        if (id) {
          const incidents: (Incident & { files?: UploadedFile[] })[] =
            JSON.parse(localStorage.getItem("incidents") || "[]");
          const existing = incidents.find((i) => i.id === id);

          if (existing) {
            // Set each field individually
            form.setValue("patientId", existing.patientId);
            form.setValue("title", existing.title);
            form.setValue("description", existing.description || "");
            form.setValue("comments", existing.comments || "");
            form.setValue("appointmentDate", existing.appointmentDate);
            form.setValue(
              "nextAppointmentDate",
              existing.nextAppointmentDate || ""
            );
            form.setValue("treatment", existing.treatment || "");
            form.setValue("cost", existing.cost || 0);
            form.setValue("status", existing.status);

            setInitialFiles(existing.files || []);
          }
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, form.setValue]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setIsUploading(true);

    const fileReaders = Array.from(e.target.files).map(
      (file) =>
        new Promise<UploadedFile>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) =>
            resolve({
              id: uuidv4(),
              name: file.name,
              type: file.type,
              size: file.size,
              url: event.target?.result as string,
              uploadedAt: new Date().toISOString(),
            });
          reader.readAsDataURL(file);
        })
    );

    Promise.all(fileReaders).then((newFiles) => {
      setInitialFiles((prev) => [...prev, ...newFiles]);
      setIsUploading(false);
    });
  };

  const removeFile = (fileId: string) =>
    setInitialFiles((prev) => prev.filter((file) => file.id !== fileId));

  const downloadFile = (file: UploadedFile) => {
    const a = document.createElement("a");
    a.href = file.url;
    a.download = file.name;
    a.click();
  };


  const onSubmit = (data: AppointmentFormData) => {
  const incidents: Incident[] = JSON.parse(
    localStorage.getItem("incidents") || "[]"
  );

  // Calculate time slots
  const newStart = new Date(data.appointmentDate).getTime();
  const newEnd = newStart + 30 * 60 * 1000;

  // Check for clashes
  const hasClash = incidents.some((incident) => {
    if (id && incident.id === id) return false; 

    const existingStart = new Date(incident.appointmentDate).getTime();
    const existingEnd = existingStart + 30 * 60 * 1000; 

    return newStart < existingEnd && existingStart < newEnd;
  });

  if (hasClash) {

    toast("Appointment Conflict", {
      description: "A patient already has an appointment at this time. Please choose a different time.",
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    })
    return;
  }

  const updatedIncident = {
    id: id || uuidv4(),
    ...data,
    files: initialFiles,
  };

  if (id) {
    const updated = incidents.map((i) => 
      i.id === id ? updatedIncident : i
    );
    localStorage.setItem("incidents", JSON.stringify(updated));
  } else {
    localStorage.setItem("incidents", JSON.stringify([...incidents, updatedIncident]));
  }

  toast("Appointment has been created", {
          description: `Appointment ${id ? "updated" : "created"} successfully`,
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
    })

  navigate("/appointments");
};

  if (isLoading) {
    return (
      <div className="p-4 max-w-3xl mx-auto flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2">Loading appointment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">
        {id ? "Edit" : "Add"} Appointment
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Patient */}
          <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => {
              console.log("Current patientId value:", field.value); // Debugging
              return (
                <FormItem>
                  <FormLabel>Patient</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {patients.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name} ({p.id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Visit reason" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Short description" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Appointment Date */}
          <FormField
            control={form.control}
            name="appointmentDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Appointment Date</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nextAppointmentDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Appointment Date</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="Rescheduled">Rescheduled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cost */}
          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost ($)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Attachments</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <UploadCloud className="mr-2 h-4 w-4" />
                {isUploading ? "Uploading..." : "Upload Files"}
              </Button>
            </div>

            {initialFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {initialFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => downloadFile(file)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(file.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button className="w-full" type="submit">
            {id ? "Update" : "Add"} Appointment
          </Button>
        </form>
      </Form>
    </div>
  );
}
