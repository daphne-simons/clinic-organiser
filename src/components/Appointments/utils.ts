export function getDefaultStartDate() {
  const now = new Date()
  now.setHours(9, 0, 0, 0) // Default to 9:00 AM
  return now
}

export function getDefaultEndDate() {
  const now = new Date()
  now.setHours(10, 0, 0, 0) // Default to 10:00 AM (1 hour later)
  return now
}
