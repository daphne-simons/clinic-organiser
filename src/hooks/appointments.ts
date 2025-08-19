import { useQuery } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'

import { getAppointments } from '../apis/appointments'

function useSongs(userId: string) {
  const { user, getAccessTokenSilently } = useAuth0()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['songs'],
    queryFn: async () => {
      const accessToken = await getAccessTokenSilently()
      if (user && user.sub) {
        const response = await getAppointments(accessToken)
        return response
      }
    },
  })

  return { data, isLoading, isError }
}

export default useSongs