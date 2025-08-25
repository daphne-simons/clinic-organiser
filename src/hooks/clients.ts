import { useQuery} from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'

import { getAllClientNames } from '../apis/clients'

export function useGetAllClientNames() {
  const { user, getAccessTokenSilently } = useAuth0()
  const { data, isLoading, isError } = useQuery({
    queryKey: ["clientNamesForDropdown"],
    queryFn: async () => {
      const accessToken = await getAccessTokenSilently()
      if (user && user.sub) {
        const response = await getAllClientNames(accessToken)
        return response
      }
    },
  })

  return { data, isLoading, isError }
}