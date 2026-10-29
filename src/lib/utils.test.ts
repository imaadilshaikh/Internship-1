import { describe, expect, it } from 'vitest'
import { filterTasks } from './utils'
import type { Task } from '../types'

const sample: Task[] = [
  { id: '1', title: 'Polish onboarding', description: 'Motion pass', status: 'inprogress', priority: 'High', tags: ['Design'], assigneeId: 'maya', dueDate: '2026-11-02', projectId: 'atlas', progress: 50, subtasks: [], comments: 0, attachments: 0, updatedAt: 'now' },
  { id: '2', title: 'Write release notes', description: 'Launch copy', status: 'done', priority: 'Low', tags: ['Content'], assigneeId: 'jordan', dueDate: '2026-10-28', projectId: 'atlas', progress: 100, subtasks: [], comments: 0, attachments: 0, updatedAt: 'yesterday' },
]

describe('TaskFlow task filters', () => {
  it('matches task title, description, and tags through the global query', () => {
    expect(filterTasks(sample, { status: 'all', priority: 'all', assigneeId: 'all', sort: 'updated' }, 'motion')).toHaveLength(1)
    expect(filterTasks(sample, { status: 'all', priority: 'all', assigneeId: 'all', sort: 'updated' }, 'content')[0].id).toBe('2')
  })

  it('combines status, priority, and assignee filters', () => {
    expect(filterTasks(sample, { status: 'inprogress', priority: 'High', assigneeId: 'maya', sort: 'updated' }, '')).toEqual([sample[0]])
    expect(filterTasks(sample, { status: 'done', priority: 'High', assigneeId: 'all', sort: 'updated' }, '')).toHaveLength(0)
  })

  it('sorts by due date and priority when requested', () => {
    const tasks: Task[] = [
      { ...sample[0], id: 'due-later', dueDate: '2026-11-05', priority: 'Low', updatedAt: '2 hrs ago' },
      { ...sample[1], id: 'due-sooner', dueDate: '2026-10-25', priority: 'High', updatedAt: '12 min ago' },
      { ...sample[0], id: 'priority-mid', dueDate: '2026-10-30', priority: 'Medium', updatedAt: '1 hr ago' },
    ]

    expect(filterTasks(tasks, { status: 'all', priority: 'all', assigneeId: 'all', sort: 'due' }, '').map((task) => task.id)).toEqual(['due-sooner', 'priority-mid', 'due-later'])
    expect(filterTasks(tasks, { status: 'all', priority: 'all', assigneeId: 'all', sort: 'priority' }, '').map((task) => task.id)).toEqual(['due-sooner', 'priority-mid', 'due-later'])
  })
})
