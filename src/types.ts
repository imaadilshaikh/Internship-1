export type TaskStatus = 'todo' | 'inprogress' | 'review' | 'done'
export type Priority = 'Low' | 'Medium' | 'High'

export interface User {
  id: string
  name: string
  initials: string
  role: string
  color: string
}

export interface Subtask {
  id: string
  label: string
  done: boolean
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: Priority
  tags: string[]
  assigneeId: string
  dueDate: string
  projectId: string
  progress: number
  subtasks: Subtask[]
  comments: number
  attachments: number
  updatedAt: string
}

export interface Project {
  id: string
  name: string
  description: string
  color: string
  taskIds: string[]
  progress: number
  dueLabel: string
}

export interface Activity {
  id: string
  actorId: string
  action: string
  target: string
  time: string
  type: 'update' | 'comment' | 'complete' | 'invite'
}

export interface TaskFilters {
  status: TaskStatus | 'all'
  priority: Priority | 'all'
  assigneeId: string | 'all'
  sort: 'updated' | 'due' | 'priority'
}
