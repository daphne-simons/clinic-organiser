import { momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'moment-timezone'

// Set the IANA time zone you want to use
moment.tz.setDefault('Pacific/Auckland')

export const localizer = momentLocalizer(moment)
