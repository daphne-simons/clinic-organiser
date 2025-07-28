import Footer from "./Footer"
import Header from "./Header"
import { AppointmentCalendar } from "./AppointmentCalendar"
import { useState } from "react";
import Welcome from "./Welcome";
import ViewsNav from "./ViewsNav";
import ClientsView from "./ClientsView";
import ClinicView from "./ClinicView";

export type Component = 'welcome' | 'appointmentCalendar' | 'clinic' | 'clients'
export type Props = Record<string, string|number|boolean|Record<string, string|number|boolean>>
export type View = {component:Component, props:Props}
export default function Layout() {

  const [view, setView] = useState({
    component:"welcome" as Component,
    props:{} as Props
  })

  return (
    <div className="container">
      <Header />
      <ViewsNav {...{setView}}/>
      { view.component === 'welcome' && <Welcome {...view.props} /> }
      { view.component === 'appointmentCalendar' && <AppointmentCalendar {...{view, setView}} /> }
      { view.component === 'clients' && <ClientsView {...{view, setView}} /> }
      { view.component === 'clinic' && <ClinicView {...{view, setView}} /> }
      <Footer />
    </div>
  )
}
