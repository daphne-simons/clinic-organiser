import { useQuery } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'

import { getCategories } from '../apis/categories'

function useGetCategories() {
  const { user, getAccessTokenSilently } = useAuth0()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const accessToken = await getAccessTokenSilently()
      if (user && user.sub) {
        const response = await getCategories(accessToken)
        return response
      }
    },
  })

  return { data, isLoading, isError }
}

export default useGetCategories