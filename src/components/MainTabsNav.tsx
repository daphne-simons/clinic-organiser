import type { Dispatch, SetStateAction } from "react"
import type { View } from "./Layout"

interface IProps {
  setView: Dispatch<SetStateAction<View>>
}

export default function MainTabsNav(props: IProps) {
  const { setView } = props
  return (
    <nav>
      <button
        onClick={() => {
          setView(() => ({mainTab: "appointments", subTab: null, props:{}}))
        }}
      >
        Calendar
      </button>
      <button
              onClick={() => {
          setView(() => ({mainTab: "clients", subTab: null, props:{}}))
        }}>Clients</button>
      <button
              onClick={() => {
          setView(() => ({mainTab: "clinic", subTab: null, props:{}}))
        }}>Clinic</button>
    </nav>
  )
}
