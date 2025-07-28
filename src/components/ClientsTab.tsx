import type { View } from "./Layout"

interface IProps {
  view: View
}

export default function ClientsTab({view}: IProps) {
  const {subTab} = view.props
  return (
    <div>
      <h1>Clients</h1>
      {subTab === "Appointments" && <h2>{view.props.text as string}</h2>}
    </div>
  )
}
