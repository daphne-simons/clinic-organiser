import { IfAuthenticated, IfNotAuthenticated } from "./Authenticated"
import Login from "./Login"
import Logout from "./Logout"

export default function AuthSection() {
  return (
    <div>
      <IfAuthenticated>
        <Logout />
      </IfAuthenticated>
      <IfNotAuthenticated>
        <Login />
      </IfNotAuthenticated>
    </div>
  )
}