import { useQuery } from "@tanstack/react-query"
import type { View } from "./Layout"
import { getClientById } from "../apis/clients"

interface IProps {
  view: View
}

export default function ClientsTab({ view }: IProps) {
  const { subTab } = view.props

  // TODO: think about where these client queries should live: 
  // const { data, isLoading, isError } = useQuery({ queryKey: ["clients", "uniqueId"], queryFn: () => getClientById(1) })
  // if (isLoading) return <div>Loading...</div>
  // if (isError) return <div>Error</div>
  // console.log(data);

  return (
    <div>
      <h1>Clients</h1>
      {subTab === "Appointments" && <h2>{view.props.text as string}</h2>}
    </div>
  )
}
