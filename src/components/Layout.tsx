import Footer from "./Footer"
import Header from "./Header"
import { AppointmentCalendar } from "./Appointments/AppointmentCalendar"
import { useState } from "react"
import Welcome from "./Welcome"
import MainTabsNav from "./MainTabsNav"
import ClientsTab from "./Clients/ClientsTab"
import ClinicTab from "./Clinic/ClinicTab"
import AuthSection from "./Auth/AuthSection"
import { IfAuthenticated, IfNotAuthenticated } from "./Auth/Authenticated"

export type MainTab = "welcome" | "appointments" | "clinic" | "clients"
export type SubTab =
  | "clientDetails"
  | "medicalHx"
  | "tcm"
  | "treatments"
  | "communications"
  | "attachments"
  | null
export type Props = Record<
  string,
  string | number | boolean | Record<string, string | number | boolean>
>
export type View = { mainTab: MainTab; subTab: SubTab; props: Props }
export default function Layout() {
  const [view, setView] = useState({
    mainTab: "welcome" as MainTab,
    subTab: null as SubTab,
    props: {} as Props,
  } as View)

  return (
    <div className="container">
      <Header />
      <AuthSection />
      <IfAuthenticated>
        <MainTabsNav {...{ setView }} />
        {view.mainTab === "welcome" && <Welcome {...view.props} />}
        {view.mainTab === "appointments" && (
          <AppointmentCalendar {...{ view, setView }} />
        )}
        {view.mainTab === "clients" && <ClientsTab {...{ view, setView }} />}
        {view.mainTab === "clinic" && <ClinicTab {...{ view, setView }} />}
      </IfAuthenticated>
      <IfNotAuthenticated>
        <p className="text-light-purple">You are not logged in</p>
      </IfNotAuthenticated>
      <Footer />
    </div>
  )
}
