import type { Priority, Task, TaskFilters } from '../types'

export const statusLabels = { todo: 'To do', inprogress: 'In progress', review: 'Review', done: 'Done' } as const
export const statusColors = { todo: '#7e8aab', inprogress: '#B4846C', review: '#E5B299', done: '#7D5A50' } as const
export const priorityColors: Record<Priority, string> = { High: '#E5B299', Medium: '#D8A882', Low: '#7D5A50' }

const priorityOrder: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 }

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(`${value}T12:00:00`))
}

function getUpdatedMinutes(value: string) {
  const normalized = value.toLowerCase().trim()

  if (!normalized || normalized === 'just now') return 0
  if (normalized === 'yesterday') return 24 * 60

  const match = normalized.match(/(\d+)\s*(minute|min|minutes|mins|hour|hours|hr|hrs|day|days)/)
  if (!match) return Number.MAX_SAFE_INTEGER

  const amount = Number(match[1])
  const unit = match[2]

  switch (unit) {
    case 'minute':
    case 'min':
    case 'minutes':
    case 'mins':
      return amount
    case 'hour':
    case 'hr':
    case 'hours':
    case 'hrs':
      return amount * 60
    case 'day':
    case 'days':
      return amount * 24 * 60
    default:
      return Number.MAX_SAFE_INTEGER
  }
}

export function filterTasks(tasks: Task[], filters: TaskFilters, query: string) {
  const normalized = query.trim().toLowerCase()
  const filtered = tasks
    .filter((task) => filters.status === 'all' || task.status === filters.status)
    .filter((task) => filters.priority === 'all' || task.priority === filters.priority)
    .filter((task) => filters.assigneeId === 'all' || task.assigneeId === filters.assigneeId)
    .filter((task) => !normalized || [task.title, task.description, ...task.tags].join(' ').toLowerCase().includes(normalized))

  switch (filters.sort) {
    case 'due':
      return [...filtered].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    case 'priority':
      return [...filtered].sort((a, b) => {
        const priorityDelta = priorityOrder[a.priority] - priorityOrder[b.priority]
        return priorityDelta !== 0 ? priorityDelta : new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      })
    case 'updated':
    default:
      return [...filtered].sort((a, b) => getUpdatedMinutes(a.updatedAt) - getUpdatedMinutes(b.updatedAt))
  }
}

export function initials(name: string) {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
}
