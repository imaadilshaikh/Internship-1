import type { Activity, Project, Task, User } from '../types'

export const members: User[] = [
  { id: 'maya', name: 'Maya Patel', initials: 'MP', role: 'Product designer', color: '#8b7cf6' },
  { id: 'alex', name: 'Alex Morgan', initials: 'AM', role: 'Frontend engineer', color: '#7D5A50' },
  { id: 'jordan', name: 'Jordan Lee', initials: 'JL', role: 'Product manager', color: '#E5B299' },
  { id: 'sam', name: 'Sam Rivera', initials: 'SR', role: 'Researcher', color: '#B4846C' },
  { id: 'you', name: 'You', initials: 'YO', role: 'Project lead', color: '#E5B299' },
]

export const projects: Project[] = [
  { id: 'atlas', name: 'Atlas mobile', description: 'The next chapter of the mobile experience.', color: '#B4846C', taskIds: ['t1', 't2', 't3', 't4'], progress: 72, dueLabel: 'Due in 12 days' },
  { id: 'website', name: 'Website refresh', description: 'A clearer front door for the studio.', color: '#7D5A50', taskIds: ['t5', 't6', 't7'], progress: 48, dueLabel: 'Due in 3 weeks' },
  { id: 'ops', name: 'Internal ops', description: 'Less busywork, more momentum.', color: '#E5B299', taskIds: ['t8'], progress: 31, dueLabel: 'Due in 1 month' },
]

export const tasks: Task[] = [
  { id: 't1', title: 'Polish onboarding motion', description: 'Tighten the transition between the welcome and permissions steps so it feels lighter on first use.', status: 'inprogress', priority: 'High', tags: ['Design', 'Mobile'], assigneeId: 'maya', dueDate: '2026-11-02', projectId: 'atlas', progress: 66, subtasks: [{ id: 's1', label: 'Review current timing', done: true }, { id: 's2', label: 'Test reduced motion', done: false }, { id: 's3', label: 'Share final prototype', done: false }], comments: 8, attachments: 2, updatedAt: '12 min ago' },
  { id: 't2', title: 'Connect analytics events', description: 'Wire the new activation events and add a lightweight QA checklist for release.', status: 'review', priority: 'Medium', tags: ['Engineering'], assigneeId: 'alex', dueDate: '2026-10-30', projectId: 'atlas', progress: 90, subtasks: [{ id: 's4', label: 'Map event names', done: true }, { id: 's5', label: 'QA on staging', done: true }], comments: 4, attachments: 1, updatedAt: '34 min ago' },
  { id: 't3', title: 'Write empty-state copy', description: 'Give the first-time experience a little more warmth and clear next steps.', status: 'todo', priority: 'Low', tags: ['Content'], assigneeId: 'jordan', dueDate: '2026-11-05', projectId: 'atlas', progress: 0, subtasks: [{ id: 's6', label: 'Draft options', done: false }], comments: 2, attachments: 0, updatedAt: '2 hrs ago' },
  { id: 't4', title: 'Ship v2.4 release notes', description: 'Summarize the activation work and highlight the new team invites flow.', status: 'done', priority: 'Medium', tags: ['Launch'], assigneeId: 'you', dueDate: '2026-10-28', projectId: 'atlas', progress: 100, subtasks: [{ id: 's7', label: 'Collect highlights', done: true }, { id: 's8', label: 'Publish notes', done: true }], comments: 6, attachments: 3, updatedAt: 'Yesterday' },
  { id: 't5', title: 'Approve homepage direction', description: 'Make the final call between the editorial and product-led compositions.', status: 'inprogress', priority: 'High', tags: ['Design', 'Web'], assigneeId: 'you', dueDate: '2026-11-01', projectId: 'website', progress: 45, subtasks: [{ id: 's9', label: 'Review team feedback', done: true }, { id: 's10', label: 'Choose a direction', done: false }], comments: 11, attachments: 4, updatedAt: '1 hr ago' },
  { id: 't6', title: 'Build testimonial module', description: 'Create the responsive testimonial block with CMS-friendly content slots.', status: 'todo', priority: 'Medium', tags: ['Engineering', 'Web'], assigneeId: 'alex', dueDate: '2026-11-10', projectId: 'website', progress: 0, subtasks: [{ id: 's11', label: 'Set up component', done: false }, { id: 's12', label: 'Add mobile variant', done: false }], comments: 1, attachments: 0, updatedAt: '3 hrs ago' },
  { id: 't7', title: 'Audit accessibility basics', description: 'Run through focus order, heading structure, color contrast, and screen reader labels.', status: 'done', priority: 'High', tags: ['Quality'], assigneeId: 'sam', dueDate: '2026-10-27', projectId: 'website', progress: 100, subtasks: [{ id: 's13', label: 'Keyboard pass', done: true }, { id: 's14', label: 'Contrast pass', done: true }], comments: 5, attachments: 1, updatedAt: '2 days ago' },
  { id: 't8', title: 'Plan Q4 ritual reset', description: 'Turn the team retro notes into a simpler weekly planning rhythm.', status: 'review', priority: 'Low', tags: ['Team'], assigneeId: 'jordan', dueDate: '2026-11-14', projectId: 'ops', progress: 72, subtasks: [{ id: 's15', label: 'Synthesize notes', done: true }, { id: 's16', label: 'Share proposal', done: false }], comments: 3, attachments: 0, updatedAt: 'Yesterday' },
]

export const activity: Activity[] = [
  { id: 'a1', actorId: 'maya', action: 'moved', target: 'Polish onboarding motion to In progress', time: '12 min ago', type: 'update' },
  { id: 'a2', actorId: 'alex', action: 'commented on', target: 'Connect analytics events', time: '34 min ago', type: 'comment' },
  { id: 'a3', actorId: 'jordan', action: 'completed', target: 'Q4 planning notes', time: '1 hr ago', type: 'complete' },
  { id: 'a4', actorId: 'sam', action: 'joined', target: 'Website refresh', time: '3 hrs ago', type: 'invite' },
]
