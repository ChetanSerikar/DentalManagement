import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { useNavigate } from "react-router-dom"
import { useTheme } from "@/components/theme-provider"
import type { Incident } from "@/types"

export default function CalendarView() {
  const navigate = useNavigate()
  const { theme } = useTheme()

  const incidents = JSON.parse(localStorage.getItem("incidents") || "[]")

  const events = incidents.map((incident: Incident) => {
    const start = new Date(incident.appointmentDate)
    const end = new Date(start.getTime() + 30 * 60 * 1000)

    return {
      id: incident.id,
      title: incident.title,
      start,
      end,
      extendedProps: incident,
    }
  })

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Appointment Calendar</h1>
      <div
        className={`rounded-md overflow-hidden border ${
          theme === "dark" ? "fc-theme-dark" : "fc-theme-light"
        }`}
      >
        <FullCalendar
          themeSystem="bootstrap5"
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          eventClick={(info) => {
            const { extendedProps } = info.event
            navigate(`/appointments/edit/${extendedProps.id}`)
          }}
          height="auto"
        />
      </div>
    </div>
  )
}
