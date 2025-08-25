import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'

import { addCategory, deleteCategory, getCategories } from '../apis/categories'
import type { ICategory, ICategoryDraft } from '../models'

export function useGetCategories() {
  const { user, getAccessTokenSilently } = useAuth0()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const accessToken = await getAccessTokenSilently()
      if (user && user.sub) {
        const response = await getCategories(accessToken)
        return response as ICategory[]
      }
    },
  })

  return { data, isLoading, isError }
}

export function useAddCategory() {
    const { getAccessTokenSilently } = useAuth0()

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (category: ICategoryDraft) => {
      const accessToken = await getAccessTokenSilently()
      return addCategory(category, accessToken)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
  })
}

export function useDeleteCategory() {
    const { getAccessTokenSilently } = useAuth0()

  const queryClient = useQueryClient()
  return useMutation({
      mutationFn: async (id: number) => {
        const accessToken = await getAccessTokenSilently()
        return deleteCategory(id, accessToken)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["categories"] })
      },
    })
}