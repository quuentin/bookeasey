export function generateTimeSlots(
  startTime: string,
  endTime: string,
  durationMinutes: number,
  bufferMinutes: number,
): string[] {
  const slots: string[] = []
  const [startH, startM] = startTime.split(':').map(Number)
  const [endH, endM] = endTime.split(':').map(Number)

  let currentMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM

  while (currentMinutes + durationMinutes <= endMinutes) {
    const h = Math.floor(currentMinutes / 60)
    const m = currentMinutes % 60
    slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`)
    currentMinutes += durationMinutes + bufferMinutes
  }

  return slots
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function hasOverlap(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date,
): boolean {
  return start1 < end2 && start2 < end1
}
