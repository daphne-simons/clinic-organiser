import { useAuth0 } from "@auth0/auth0-react"
import { Button } from "@mui/material"

export default function Logout() {
  const { logout } = useAuth0()
  const handleLogout = () => {
    logout()
  }

  return <Button onClick={handleLogout}>Logout</Button>
}
