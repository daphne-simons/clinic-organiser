import type { View } from "./Layout"

interface IProps {
  view: View
}

export default function ClientsView({view}: IProps) {
  const {innerComponent} = view.props
  return (
    <div>
      <h1>Clients</h1>
      {innerComponent === "Appointments" && <h2>{view.props.text as string}</h2>}
    </div>
  )
}
