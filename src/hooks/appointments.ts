import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'

import { addAppointment, getAppointments, deleteAppointment } from '../apis/appointments'
import type { IAppointmentInfo } from '../models'

export function useGetAppointments() {
  const { user, getAccessTokenSilently } = useAuth0()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['appointments'],
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

export function useAddAppointment() {
    const { getAccessTokenSilently } = useAuth0()

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (form: IAppointmentInfo) => {
      const accessToken = await getAccessTokenSilently()
      return addAppointment(form, accessToken)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
    },
  })
}

export function useDeleteAppointment() {
    const { getAccessTokenSilently } = useAuth0()

  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const accessToken = await getAccessTokenSilently()
      return deleteAppointment(id, accessToken)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
    },
  })
}