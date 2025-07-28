import type { Dispatch, SetStateAction } from "react"
import type { View } from "./Layout"

interface IProps {
  setView: Dispatch<SetStateAction<View>>
}

export default function ViewsNav(props: IProps) {
  const { setView } = props
  return (
    <nav>
      <button
        onClick={() => {
          setView(() => ({component: "appointmentCalendar", props:{}}))
        }}
      >
        Calendar
      </button>
      <button
              onClick={() => {
          setView(() => ({component: "clients", props:{}}))
        }}>Clients</button>
      <button
              onClick={() => {
          setView(() => ({component: "clinic", props:{}}))
        }}>Clinic</button>
    </nav>
  )
}
