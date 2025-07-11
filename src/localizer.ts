import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { enNZ } from "date-fns/locale/en-NZ";
import { dateFnsLocalizer } from "react-big-calendar";

const locales = {
  "en-NZ": enNZ,
};

export const localizer = dateFnsLocalizer({
  format,
  parse,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startOfWeek: (date: any) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
});