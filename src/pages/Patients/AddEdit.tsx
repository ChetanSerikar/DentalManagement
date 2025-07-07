import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner"; // Changed from use-toast to sonner
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import type { Patient } from "@/types";

// Define form schema
const patientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  contact: z.string().min(1, "Contact is required"),
  email: z.string().email("Invalid email address"),
  healthInfo: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

export default function AddEditPatient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      id: "",
      name: "",
      dob: "",
      contact: "",
      email: "",
      healthInfo: "",
    },
  });

  useEffect(() => {
    if (user?.role !== "Admin") {
      navigate("/unauthorized");
      return;
    }

    const loadData = async () => {
      try {
        if (id) {
          const patients: Patient[] = JSON.parse(
            localStorage.getItem("patients") || "[]"
          );
          const existing = patients.find((p) => p.id === id);
          if (existing) {
            form.reset(existing);
          }
        }
      } catch (error) {
        console.error("Failed to load patient data:", error);
        toast.error("Failed to load patient data"); // Sonner syntax
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, form.reset, user?.role, navigate]);

  const onSubmit = (data: PatientFormData) => {
    try {
      const patients: Patient[] = JSON.parse(
        localStorage.getItem("patients") || "[]"
      );

      // Check for duplicate email
      const duplicatePatient = patients.find(
        (p) => p.email === data.email && p.id !== data.id
      );
      if (duplicatePatient) {
        toast.error("A patient with this email already exists"); // Sonner syntax
        return;
      }

      if (id) {
        const updated = patients.map((p) => (p.id === id ? data : p));
        localStorage.setItem("patients", JSON.stringify(updated));
        toast.success(`${data.name}'s record has been updated`); // Sonner syntax
      } else {
        const newPatient = { ...data, id: uuidv4() };
        localStorage.setItem(
          "patients",
          JSON.stringify([...patients, newPatient])
        );
        
        // Sonner toast with undo action
        toast.success(`${data.name} has been added to the system`, {
          action: {
            label: "Undo",
            onClick: () => {
              const updatedPatients = patients.filter(
                (p) => p.id !== newPatient.id
              );
              localStorage.setItem("patients", JSON.stringify(updatedPatients));
              toast.success("Patient creation undone");
            },
          },
        });
      }

      navigate("/patients");
    } catch (error) {
      console.error("Failed to save patient:", error);
      toast.error("Failed to save patient data"); // Sonner syntax
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 max-w-xl mx-auto flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2">Loading patient data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">
        {id ? "Edit" : "Add"} Patient
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Full Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date of Birth Field */}
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contact Field */}
          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact</FormLabel>
                <FormControl>
                  <Input placeholder="Phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Health Info Field */}
          <FormField
            control={form.control}
            name="healthInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Health Information</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Allergic to penicillin"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full" type="submit">
            {id ? "Update" : "Add"} Patient
          </Button>
        </form>
      </Form>
    </div>
  );
}