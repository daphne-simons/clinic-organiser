import type { Event } from "react-big-calendar"

// Custom Object interface
export type CustomObject = Record<string, string | number | boolean>
export type CustomFields = Record<string, string | number | boolean | CustomObject>
//////// Client stuff
export interface IClient {
  id: number
  created_at?: string
  updated_at?: string
  first_name: string
  last_name: string
  dob?: string
  mobile?: string
  email?: string
  custom_fields?: CustomFields
}

export interface IClientName {
  id: string
  first_name: string
  last_name: string
}

export interface IClientForDropdown {
  id: number
  label: string
}

//////// Medical History stuff
export interface IMedicalHistory {
  id: number
  client_id: number
  created_at?: string
  updated_at?: string
  custom_fields?: CustomFields
}

//////// TCM stuff
export interface ITcm {
  id: number
  client_id: number
  created_at?: string
  updated_at?: string
  custom_fields?: CustomFields
}

//////// Treatments stuff
export interface ITreatment {
  id: number
  client_id: number
  created_at?: string
  updated_at?: string
  date: string
  duration_minutes: number
  notes: string
  custom_fields?: CustomFields
}


//////// Edit Form stuff
export interface IForm {
  id: string
  custom_fields?: CustomFields
}

/////// Calendar stuff
export interface ICategory {
  _id: number
  title: string
  color?: string
}
export interface ICategoryDraft {
  title: string
  color?: string
}


//////// Appointments stuff


export interface AppointmentFormData {
  clientId?: number
  firstName?: string
  lastName?: string
  categoryId?: number
  startTime?: Date
  endTime?: Date
  notes?: string
}
export interface IAppointmentInfo extends Event {
  id?: number
  clientId?: number
  firstName?: string
  lastName?: string
  startTime?: Date
  endTime?: Date
  notes?: string
  appointmentType?: string
  customFields?: CustomFields
}

export interface IAppointmentAPI {
  id: number
  clientId: number
  startTime: string
  endTime: string
  appointmentType: string
  notes: string
  customFields?: CustomFields
}

export interface IAppointmentDraft {
  clientId: number
  startTime: Date
  endTime: Date
  appointmentType?: string
  notes?: string
}
