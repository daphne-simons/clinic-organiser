import Footer from "./Footer"
import Header from "./Header"
import { AppointmentCalendar } from "./AppointmentCalendar"
import { useState } from "react";

const components = {
  appointmentCalendar: AppointmentCalendar
}

type View = keyof typeof components
export default function Layout() {

  const [view, setView] = useState("appointmentCalendar" as View);

  return (
    <div className="container">
      <Header />
      {components[view]()}
      <Footer />
    </div>
  )
}
