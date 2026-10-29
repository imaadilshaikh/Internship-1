import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { activity as seedActivity, members, projects, tasks as seedTasks } from '../data/mockData'
import type { Activity, Priority, Task, TaskFilters, TaskStatus } from '../types'

type Theme = 'dark' | 'light' | 'system'

interface TaskStore {
  tasks: Task[]
  projects: typeof projects
  members: typeof members
  activities: Activity[]
  theme: Theme
  filters: TaskFilters
  query: string
  selectedTaskId: string | null
  isTaskModalOpen: boolean
  setTheme: (theme: Theme) => void
  setQuery: (query: string) => void
  setFilters: (filters: Partial<TaskFilters>) => void
  openTask: (taskId?: string | null) => void
  closeTask: () => void
  moveTask: (taskId: string, status: TaskStatus, overTaskId?: string) => void
  updateTask: (task: Task) => void
  createTask: (task: Task) => void
  toggleSubtask: (taskId: string, subtaskId: string) => void
  clearFilters: () => void
}

const defaultFilters: TaskFilters = { status: 'all', priority: 'all', assigneeId: 'all', sort: 'updated' }

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: seedTasks,
      projects,
      members,
      activities: seedActivity,
      theme: 'dark',
      filters: defaultFilters,
      query: '',
      selectedTaskId: null,
      isTaskModalOpen: false,
      setTheme: (theme) => set({ theme }),
      setQuery: (query) => set({ query }),
      setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
      openTask: (selectedTaskId = null) => set({ selectedTaskId, isTaskModalOpen: true }),
      closeTask: () => set({ isTaskModalOpen: false, selectedTaskId: null }),
      moveTask: (taskId, status, overTaskId) => set((state) => {
        const moving = state.tasks.find((task) => task.id === taskId)
        if (!moving) return state
        const next = state.tasks.map((task) => task.id === taskId ? { ...task, status, updatedAt: 'Just now' } : task)
        const without = next.filter((task) => task.id !== taskId)
        if (!overTaskId) return { tasks: [...without, { ...moving, status, updatedAt: 'Just now' }] }
        const overIndex = without.findIndex((task) => task.id === overTaskId)
        if (overIndex < 0) return { tasks: next }
        without.splice(overIndex, 0, { ...moving, status, updatedAt: 'Just now' })
        return { tasks: without }
      }),
      updateTask: (task) => set((state) => ({ tasks: state.tasks.map((item) => item.id === task.id ? { ...task, updatedAt: 'Just now' } : item) })),
      createTask: (task) => set((state) => ({ tasks: [...state.tasks, task], selectedTaskId: task.id, isTaskModalOpen: true })),
      toggleSubtask: (taskId, subtaskId) => set((state) => ({ tasks: state.tasks.map((task) => task.id === taskId ? { ...task, subtasks: task.subtasks.map((subtask) => subtask.id === subtaskId ? { ...subtask, done: !subtask.done } : subtask) } : task) })),
      clearFilters: () => set({ filters: defaultFilters, query: '' }),
    }),
    { name: 'taskflow-store', partialize: (state) => ({ tasks: state.tasks, theme: state.theme, filters: state.filters }) },
  ),
)

export const priorityRank: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 }
