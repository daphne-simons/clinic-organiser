import { useAuth0 } from "@auth0/auth0-react"
import { Button } from "@mui/material"

export default function Login() {

  const { loginWithRedirect } = useAuth0()
  function handleLogin() {
    loginWithRedirect()
  }

  return <Button onClick={handleLogin}>Login</Button>

}