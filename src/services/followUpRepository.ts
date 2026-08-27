import type { CareEvent } from '@/types/companion'
import type { FollowUpData, FollowUpPlan, FollowUpQuestion, FollowUpTask, FollowUpVisit } from '@/types/followUp'

export const FOLLOW_UP_KEY = 'lentera.follow-up.v1'
const EVENTS_KEY = 'lentera.companion.events'
const CHANGE_EVENT = 'lentera-follow-up-change'
const records = (value: unknown) => Array.isArray(value) ? value.filter(item => item && typeof item === 'object') : []
const read = (): FollowUpData => {
  try {
    const value = JSON.parse(localStorage.getItem(FOLLOW_UP_KEY) || '{}') as Partial<FollowUpData>
    return { plans: records(value.plans) as FollowUpPlan[], tasks: records(value.tasks) as FollowUpTask[], visits: records(value.visits) as FollowUpVisit[], questions: records(value.questions) as FollowUpQuestion[] }
  } catch { return { plans: [], tasks: [], visits: [], questions: [] } }
}
const write = (data: FollowUpData) => { localStorage.setItem(FOLLOW_UP_KEY, JSON.stringify(data)); window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: data })) }
const readEvents = (): CareEvent[] => { try { const value: unknown = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]'); return Array.isArray(value) ? value as CareEvent[] : [] } catch { return [] } }
const writeEvents = (events: CareEvent[]) => { localStorage.setItem(EVENTS_KEY, JSON.stringify(events)); window.dispatchEvent(new CustomEvent('lentera-local-storage-change', { detail: { key: EVENTS_KEY, value: events } })) }
const eventId = (taskId: string) => `follow-up-${taskId}`
const removeTaskEvents = (taskIds: string[]) => { const ids = new Set(taskIds.map(eventId)), current = readEvents(), next = current.filter(event => !ids.has(event.id)); if (next.length !== current.length) writeEvents(next) }
const syncTaskEvent = (task: FollowUpTask, plan?: FollowUpPlan): FollowUpTask => {
  const current = readEvents(), ids = new Set([eventId(task.id), task.linkedAppointmentId].filter(Boolean)), events = current.filter(event => !ids.has(event.id))
  if (!task.plannedDate) { if (events.length !== current.length) writeEvents(events); return { ...task, linkedAppointmentId: undefined } }
  const linked: CareEvent = { id: eventId(task.id), type: 'Follow-up', title: task.title, date: task.plannedDate, location: plan?.facility, note: task.note, completed: task.status === 'completed', status: task.status === 'completed' ? 'completed' : task.status === 'cancelled' ? 'cancelled' : 'upcoming', checklist: [] }
  writeEvents([...events, linked]); return { ...task, linkedAppointmentId: linked.id }
}

export const followUpRepository = {
  read,
  subscribe(listener: (data: FollowUpData) => void) {
    const onChange = (event: Event) => listener((event as CustomEvent<FollowUpData>).detail ?? read())
    const onStorage = (event: StorageEvent) => { if (event.key === FOLLOW_UP_KEY || event.key === null) listener(read()) }
    window.addEventListener(CHANGE_EVENT, onChange); window.addEventListener('storage', onStorage)
    return () => { window.removeEventListener(CHANGE_EVENT, onChange); window.removeEventListener('storage', onStorage) }
  },
  savePlan(plan: FollowUpPlan) { const data = read(); data.plans = data.plans.some(item => item.id === plan.id) ? data.plans.map(item => item.id === plan.id ? plan : item) : [plan, ...data.plans]; write(data) },
  deletePlan(id: string) { const data = read(), taskIds = data.tasks.filter(item => item.planId === id).map(item => item.id); data.plans = data.plans.filter(item => item.id !== id); data.tasks = data.tasks.filter(item => item.planId !== id); data.visits = data.visits.filter(item => item.planId !== id); data.questions = data.questions.filter(item => item.planId !== id); removeTaskEvents(taskIds); write(data) },
  saveTask(task: FollowUpTask) { const data = read(), synced = syncTaskEvent(task, data.plans.find(plan => plan.id === task.planId)); data.tasks = data.tasks.some(item => item.id === task.id) ? data.tasks.map(item => item.id === task.id ? synced : item) : [synced, ...data.tasks]; write(data) },
  deleteTask(id: string) { const data = read(); data.tasks = data.tasks.filter(item => item.id !== id); removeTaskEvents([id]); write(data) },
  saveVisit(visit: FollowUpVisit) { const data = read(); data.visits = data.visits.some(item => item.id === visit.id) ? data.visits.map(item => item.id === visit.id ? visit : item) : [visit, ...data.visits]; if (visit.planId && visit.nextFollowUpDate) data.plans = data.plans.map(plan => plan.id === visit.planId ? { ...plan, nextFollowUpDate: visit.nextFollowUpDate, updatedAt: new Date().toISOString() } : plan); write(data) },
  saveQuestion(question: FollowUpQuestion) { const data = read(); data.questions = data.questions.some(item => item.id === question.id) ? data.questions.map(item => item.id === question.id ? question : item) : [question, ...data.questions]; write(data) },
  deleteQuestion(id: string) { const data = read(); data.questions = data.questions.filter(item => item.id !== id); write(data) },
}
