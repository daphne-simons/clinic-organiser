import type { Event } from "react-big-calendar";

export interface ICategory {
  _id: string;
  title: string;
  color?: string;
}

export interface IAppointmentInfo extends Event {
  _id: string;
  notes?: string;
  categoryId?: string;
}

// export interface AppointmentFormData {
//   notes?: string;
//   categoryId?: string;
// }

export interface DatePickerAppointmentFormData {
  client: string;
  categoryId?: string;
  allDay: boolean;
  start?: Date;
  end?: Date;
  notes?: string;
}