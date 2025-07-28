import Footer from "./Footer"
import Header from "./Header"
import { AppointmentCalendar } from "./AppointmentCalendar"
import { useState } from "react";
import Welcome from "./Welcome";
import MainTabsNav from "./MainTabsNav";
import ClientsTab from "./ClientsTab";
import ClinicTab from "./ClinicTab";

export type MainTab = 'welcome' | 'appointments' | 'clinic' | 'clients'
export type SubTab = 'clientDetails' | 'medicalHx' | 'tcm' | 'treatments' | 'communications' | 'attachments' | null
export type Props = Record<string, string|number|boolean|Record<string, string|number|boolean>>
export type View = {mainTab: MainTab, subTab: SubTab, props:Props}
export default function Layout() {

  const [view, setView] = useState({
    mainTab:"welcome" as MainTab,
    subTab: null as SubTab,
    props:{} as Props
  } as View)

  return (
    <div className="container">
      <Header />
      <MainTabsNav {...{setView}}/>
      { view.mainTab === 'welcome' && <Welcome {...view.props} /> }
      { view.mainTab === 'appointments' && <AppointmentCalendar {...{view, setView}} /> }
      { view.mainTab === 'clients' && <ClientsTab {...{view, setView}} /> }
      { view.mainTab === 'clinic' && <ClinicTab {...{view, setView}} /> }
      <Footer />
    </div>
  )
}
