import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import {
  Activity as ActivityIcon,
  AlertTriangle,
  ArrowDownUp,
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  Clock3,
  Command,
  FileText,
  Filter,
  GripVertical,
  LayoutDashboard,
  ListChecks,
  Menu,
  MessageCircle,
  Moon,
  MoreHorizontal,
  PanelLeft,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Tag,
  Users,
  X,
  Zap,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { DndContext, DragEndEvent, DragOverlay, PointerSensor, useDroppable, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, horizontalListSortingStrategy, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useTaskStore } from './store/useTaskStore'
import { filterTasks, formatDate, priorityColors, statusColors, statusLabels } from './lib/utils'
import type { Priority, Task, TaskStatus, User } from './types'

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/board', label: 'Board', icon: ListChecks },
  { to: '/settings', label: 'Settings', icon: Settings },
]

const chartTooltipStyle = { background: '#493329', border: '1px solid rgba(255,247,237,.16)', borderRadius: 12, color: '#fff7ed', fontSize: 12 }

function App() {
  const theme = useTaskStore((state) => state.theme)
  const closeTask = useTaskStore((state) => state.closeTask)
  const openTask = useTaskStore((state) => state.openTask)
  const [mobileNav, setMobileNav] = useState(false)
  const resolvedTheme = theme === 'system' ? (window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark') : theme

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme
  }, [resolvedTheme])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        document.getElementById('global-search')?.focus()
      }
      if (!event.metaKey && !event.ctrlKey && event.key.toLowerCase() === 'n' && !['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement)?.tagName)) {
        event.preventDefault()
        openTask()
      }
      if (event.key === 'Escape') closeTask()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeTask, openTask])

  return (
    <div className="app-shell">
      <Sidebar mobileNav={mobileNav} closeMobile={() => setMobileNav(false)} />
      {mobileNav && <button className="drawer-backdrop" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
      <div className="app-main">
        <Header openMobile={() => setMobileNav(true)} />
        <main className="page-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/board" element={<BoardPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
      <TaskModal />
    </div>
  )
}

function Logo() {
  return <Link to="/dashboard" className="brand" aria-label="TaskFlow home"><span className="brand-mark"><i /><i /><i /><i /></span><span>task<span>flow</span></span></Link>
}

function Sidebar({ mobileNav, closeMobile }: { mobileNav: boolean; closeMobile: () => void }) {
  const openTask = useTaskStore((state) => state.openTask)
  const projects = useTaskStore((state) => state.projects)
  const tasks = useTaskStore((state) => state.tasks)
  return (
    <aside className={`sidebar ${mobileNav ? 'is-open' : ''}`}>
      <div className="sidebar-top"><Logo /><button className="mobile-close icon-button" onClick={closeMobile} aria-label="Close menu"><X size={18} /></button></div>
      <button className="new-task-button" onClick={() => openTask()}><span><Plus size={17} /> New task</span><kbd>N</kbd></button>
      <div className="nav-section"><p className="eyebrow">Workspace</p>{navItems.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} onClick={closeMobile} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><Icon size={17} strokeWidth={1.9} /><span>{label}</span>{label === 'Board' && <span className="nav-count">{tasks.filter((t) => t.status !== 'done').length}</span>}</NavLink>)}</div>
      <div className="nav-section projects-nav"><div className="section-heading"><p className="eyebrow">Projects</p><button className="tiny-action" aria-label="Add project"><Plus size={14} /></button></div>{projects.map((project) => <Link to="/board" className="project-nav-item" key={project.id} onClick={closeMobile}><span className="project-dot" style={{ background: project.color }} />{project.name}<span className="project-nav-progress">{project.progress}%</span></Link>)}</div>
      <div className="sidebar-bottom"><div className="focus-card"><div className="focus-icon"><Zap size={15} /></div><div><strong>Weekly focus</strong><span>3 tasks need you</span></div><ArrowUpRight size={14} /></div><div className="profile-row"><div className="avatar avatar-you">YO</div><div><strong>You</strong><span>Project lead</span></div><button className="icon-button" aria-label="Open profile menu"><MoreHorizontal size={16} /></button></div></div>
    </aside>
  )
}

function Header({ openMobile }: { openMobile: () => void }) {
  const location = useLocation()
  const query = useTaskStore((state) => state.query)
  const setQuery = useTaskStore((state) => state.setQuery)
  const openTask = useTaskStore((state) => state.openTask)
  const titles: Record<string, { eyebrow: string; title: string; description: string }> = {
    '/dashboard': { eyebrow: 'Tuesday, October 28, 2026', title: 'Make the next move visible.', description: 'A calm view of everything in motion.' },
    '/board': { eyebrow: 'Atlas workspace', title: 'Keep the board honest.', description: 'Move work forward, one clear decision at a time.' },
    '/settings': { eyebrow: 'Workspace preferences', title: 'Make it feel like yours.', description: 'Tune the workspace to the way you work.' },
  }
  const content = titles[location.pathname] || titles['/dashboard']
  return <header className="topbar"><div className="mobile-top"><button className="icon-button" onClick={openMobile} aria-label="Open menu"><Menu size={20} /></button><Logo /></div><div className="header-copy"><span className="eyebrow">{content.eyebrow}</span><h1>{content.title}</h1><p>{content.description}</p></div><div className="topbar-actions"><div className="search-wrap"><Search size={16} /><input id="global-search" aria-label="Search tasks" placeholder="Search tasks…" value={query} onChange={(event) => setQuery(event.target.value)} /><kbd><Command size={11} /> K</kbd></div><button className="icon-button notification-button" aria-label="Notifications"><Bell size={18} /><span /></button><button className="header-cta" onClick={() => openTask()}><Plus size={16} /> <span>New task</span></button></div></header>
}

function DashboardPage() {
  const tasks = useTaskStore((state) => state.tasks)
  const projects = useTaskStore((state) => state.projects)
  const members = useTaskStore((state) => state.members)
  const activities = useTaskStore((state) => state.activities)
  const openTask = useTaskStore((state) => state.openTask)
  const completed = tasks.filter((task) => task.status === 'done').length
  const inProgress = tasks.filter((task) => task.status === 'inprogress').length
  const overdue = tasks.filter((task) => new Date(task.dueDate) < new Date('2026-10-28') && task.status !== 'done').length
  const chartData = [
    { name: 'To do', value: tasks.filter((task) => task.status === 'todo').length, color: statusColors.todo },
    { name: 'In progress', value: inProgress, color: statusColors.inprogress },
    { name: 'Review', value: tasks.filter((task) => task.status === 'review').length, color: statusColors.review },
    { name: 'Done', value: completed, color: statusColors.done },
  ]
  const weekly = [{ day: 'Mon', tasks: 3 }, { day: 'Tue', tasks: 7 }, { day: 'Wed', tasks: 5 }, { day: 'Thu', tasks: 9 }, { day: 'Fri', tasks: 8 }, { day: 'Sat', tasks: 10 }, { day: 'Sun', tasks: 12 }]
  const completion = [{ name: 'Done', value: completed }, { name: 'Remaining', value: tasks.length - completed }]
  return <>
    <section className="page-intro mobile-only"><span className="eyebrow">Tuesday, October 28, 2026</span><h1>Make the next move visible.</h1><p>A calm view of everything in motion.</p></section>
    <div className="metrics-grid">
      <MetricCard label="Total tasks" value={tasks.length} detail="Across 3 projects" icon={ListChecks} tone="purple" />
      <MetricCard label="In progress" value={inProgress} detail="2 need a decision" icon={CircleDot} tone="blue" />
      <MetricCard label="Completed" value={completed} detail="+18% from last week" icon={CheckCircle2} tone="green" trend />
      <MetricCard label="Needs attention" value={overdue} detail="Past their due date" icon={AlertTriangle} tone="orange" />
    </div>
    <section className="content-grid dashboard-grid">
      <div className="card chart-card progress-card"><div className="card-heading"><div><span className="eyebrow">Project pulse</span><h2>Work in motion</h2></div><button className="select-button">This week <ChevronDown size={14} /></button></div><div className="progress-layout"><div className="donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={completion} dataKey="value" innerRadius={63} outerRadius={82} paddingAngle={4} stroke="none" startAngle={90} endAngle={-270}>{completion.map((entry, index) => <Cell key={entry.name} fill={index === 0 ? '#B4846C' : 'rgba(252,222,192,.12)'} />)}</Pie></PieChart></ResponsiveContainer><div className="donut-center"><strong>{Math.round((completed / tasks.length) * 100)}%</strong><span>complete</span></div></div><div className="legend-list">{chartData.map((item) => <div className="legend-row" key={item.name}><span className="legend-color" style={{ background: item.color }} /><span>{item.name}</span><strong>{item.value}</strong></div>)}</div></div><div className="chart-footer"><span><span className="trend-up">↗ 12%</span> vs last week</span><span className="muted">Updated just now</span></div></div>
      <div className="card chart-card weekly-card"><div className="card-heading"><div><span className="eyebrow">Momentum</span><h2>Weekly progress</h2></div><button className="icon-button" aria-label="More chart options"><MoreHorizontal size={18} /></button></div><div className="line-chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={weekly} margin={{ left: -24, right: 4, top: 10, bottom: 0 }}><CartesianGrid vertical={false} stroke="rgba(252,222,192,.12)" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#B4846C', fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#B4846C', fontSize: 11 }} allowDecimals={false} /><Tooltip contentStyle={chartTooltipStyle} cursor={{ stroke: '#B4846C', strokeDasharray: '4 4' }} /><Line type="monotone" dataKey="tasks" stroke="#B4846C" strokeWidth={3} dot={{ fill: '#B4846C', stroke: '#624740', strokeWidth: 3, r: 4 }} activeDot={{ r: 6 }} /></LineChart></ResponsiveContainer></div><div className="chart-footer"><span><span className="trend-up">↗ 24%</span> delivery pace</span><span className="muted">7 day view</span></div></div>
      <div className="card chart-card bar-card"><div className="card-heading"><div><span className="eyebrow">Delivery mix</span><h2>Task completion</h2></div><button className="select-button">All projects <ChevronDown size={14} /></button></div><div className="bar-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={projects.map((project) => ({ name: project.name.split(' ')[0], completed: tasks.filter((task) => task.projectId === project.id && task.status === 'done').length, remaining: tasks.filter((task) => task.projectId === project.id && task.status !== 'done').length }))} margin={{ left: -26, right: 0, top: 10, bottom: 0 }}><CartesianGrid vertical={false} stroke="rgba(252,222,192,.12)" /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#B4846C', fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#B4846C', fontSize: 11 }} allowDecimals={false} /><Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'rgba(252,222,192,.08)' }} /><Bar dataKey="completed" stackId="a" fill="#7D5A50" radius={[0, 0, 4, 4]} /><Bar dataKey="remaining" stackId="a" fill="rgba(252,222,192,.14)" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
    </section>
    <section className="content-grid lower-grid"><div className="card project-card"><div className="card-heading"><div><span className="eyebrow">Your spaces</span><h2>Projects</h2></div><Link className="text-link" to="/board">View board <ArrowUpRight size={14} /></Link></div><div className="project-list">{projects.map((project) => <ProjectRow key={project.id} project={project} tasks={tasks} members={members} />)}</div></div><div className="card activity-card"><div className="card-heading"><div><span className="eyebrow">Live feed</span><h2>Recent activity</h2></div><button className="icon-button" aria-label="Activity options"><MoreHorizontal size={18} /></button></div><div className="activity-list">{activities.map((item) => { const actor = members.find((member) => member.id === item.actorId)!; return <div className="activity-row" key={item.id}><Avatar user={actor} size="sm" /><div><p><strong>{actor.name.split(' ')[0]}</strong> {item.action} <b>{item.target}</b></p><span>{item.time}</span></div><ActivityIcon size={14} className={`activity-type ${item.type}`} /></div> })}</div><button className="activity-link">See all activity <ArrowUpRight size={14} /></button></div></section>
    <button className="floating-add" onClick={() => openTask()} aria-label="Create a new task"><Plus size={20} /></button>
  </>
}

function MetricCard({ label, value, detail, icon: Icon, tone, trend }: { label: string; value: number; detail: string; icon: typeof ListChecks; tone: string; trend?: boolean }) {
  return <div className="metric-card"><div className={`metric-icon ${tone}`}><Icon size={17} /></div><div className="metric-content"><span>{label}</span><strong>{value}</strong><small className={trend ? 'trend-up' : ''}>{detail}</small></div><ArrowUpRight className="metric-arrow" size={15} /></div>
}

function ProjectRow({ project, tasks, members }: { project: { id: string; name: string; description: string; color: string; progress: number; dueLabel: string }; tasks: Task[]; members: User[] }) {
  const projectTasks = tasks.filter((task) => task.projectId === project.id)
  const assignees = [...new Set(projectTasks.map((task) => task.assigneeId))].map((id) => members.find((member) => member.id === id)).filter(Boolean) as User[]
  return <Link to="/board" className="project-row"><span className="project-avatar" style={{ background: `${project.color}22`, color: project.color }}><FileText size={17} /></span><div className="project-info"><strong>{project.name}</strong><span>{project.description}</span></div><div className="project-progress"><div className="progress-label"><span>{project.progress}%</span><small>{project.dueLabel}</small></div><div className="progress-track"><i style={{ width: `${project.progress}%`, background: project.color }} /></div></div><div className="avatar-stack">{assignees.slice(0, 3).map((user) => <Avatar key={user.id} user={user} size="xs" />)}</div><ArrowUpRight size={16} className="row-arrow" /></Link>
}

function BoardPage() {
  const tasks = useTaskStore((state) => state.tasks)
  const filters = useTaskStore((state) => state.filters)
  const query = useTaskStore((state) => state.query)
  const setFilters = useTaskStore((state) => state.setFilters)
  const clearFilters = useTaskStore((state) => state.clearFilters)
  const openTask = useTaskStore((state) => state.openTask)
  const [activeId, setActiveId] = useState<string | null>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))
  const visibleTasks = useMemo(() => filterTasks(tasks, filters, query), [tasks, filters, query])
  const columns: TaskStatus[] = ['todo', 'inprogress', 'review', 'done']
  const hasFilters = filters.status !== 'all' || filters.priority !== 'all' || filters.assigneeId !== 'all' || query
  const moveTask = useTaskStore((state) => state.moveTask)
  const activeTask = activeId ? tasks.find((task) => task.id === activeId) : null
  const handleDragStart = (event: { active: { id: string | number } }) => setActiveId(String(event.active.id))
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    if (!event.over) return
    const dragged = tasks.find((task) => task.id === String(event.active.id))
    if (!dragged) return
    const overId = String(event.over.id)
    const overTask = tasks.find((task) => task.id === overId)
    const targetStatus = overTask?.status || (columns.includes(overId as TaskStatus) ? overId as TaskStatus : dragged.status)
    moveTask(dragged.id, targetStatus, overTask?.id)
  }
  return <>
    <div className="board-toolbar"><div className="filter-group"><button className={`filter-button ${filters.status !== 'all' ? 'has-value' : ''}`}><Filter size={15} /> Status <ChevronDown size={14} /><select aria-label="Filter by status" value={filters.status} onChange={(event) => setFilters({ status: event.target.value as TaskStatus | 'all' })}><option value="all">All statuses</option><option value="todo">To do</option><option value="inprogress">In progress</option><option value="review">Review</option><option value="done">Done</option></select></button><button className={`filter-button ${filters.priority !== 'all' ? 'has-value' : ''}`}><SlidersHorizontal size={15} /> Priority <ChevronDown size={14} /><select aria-label="Filter by priority" value={filters.priority} onChange={(event) => setFilters({ priority: event.target.value as Priority | 'all' })}><option value="all">All priorities</option><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option></select></button><button className="filter-button"><ArrowDownUp size={15} /> Sort <ChevronDown size={14} /><select aria-label="Sort tasks" value={filters.sort} onChange={(event) => setFilters({ sort: event.target.value as 'updated' | 'due' | 'priority' })}><option value="updated">Recently updated</option><option value="due">Due date</option><option value="priority">Priority</option></select></button>{hasFilters && <button className="clear-filter" onClick={clearFilters}>Clear all <X size={13} /></button>}</div><div className="board-summary"><span className="live-dot" /> {visibleTasks.length} tasks in view <button className="icon-button" aria-label="Board options"><MoreHorizontal size={17} /></button></div></div>
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="kanban-board"><SortableContext items={columns} strategy={horizontalListSortingStrategy}>{columns.map((status) => <KanbanColumn key={status} status={status} tasks={visibleTasks.filter((task) => task.status === status)} />)}</SortableContext></div>
      <DragOverlay>{activeTask ? <div className="drag-card"><TaskCardContent task={activeTask} isOverlay /></div> : null}</DragOverlay>
    </DndContext>
    <button className="floating-add" onClick={() => openTask()} aria-label="Create a new task"><Plus size={20} /></button>
  </>
}

function KanbanColumn({ status, tasks }: { status: TaskStatus; tasks: Task[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  return <section ref={setNodeRef} className={`kanban-column ${isOver ? 'drop-active' : ''}`}><div className="column-heading"><span className="status-marker" style={{ background: statusColors[status] }} /><h2>{statusLabels[status]}</h2><span className="column-count">{tasks.length}</span><button className="icon-button" aria-label={`More ${statusLabels[status]} options`}><MoreHorizontal size={17} /></button></div><SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}><div className="task-list">{tasks.map((task) => <SortableTaskCard task={task} key={task.id} />)}<button className="add-to-column"><Plus size={15} /> Add task</button></div></SortableContext></section>
}

function SortableTaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })
  const style = { transform: CSS.Transform.toString(transform), transition }
  return <div ref={setNodeRef} style={style} className={isDragging ? 'is-dragging' : ''}><TaskCard task={task} dragAttributes={attributes} dragListeners={listeners} /></div>
}

function TaskCard({ task, dragAttributes, dragListeners }: { task: Task; dragAttributes?: any; dragListeners?: any }) {
  const openTask = useTaskStore((state) => state.openTask)
  return <article className="task-card" onClick={() => openTask(task.id)}><div className="task-card-top"><span className="priority-pill" style={{ color: priorityColors[task.priority], background: `${priorityColors[task.priority]}18` }}><span className="priority-dot" style={{ background: priorityColors[task.priority] }} />{task.priority}</span><button className="drag-handle icon-button" aria-label="Drag task" {...dragAttributes} {...dragListeners} onClick={(event) => event.stopPropagation()}><GripVertical size={16} /></button></div><h3>{task.title}</h3><p>{task.description}</p><div className="tag-row">{task.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>{task.subtasks.length > 0 && <div className="task-progress"><div><span><Check size={12} /> {task.subtasks.filter((subtask) => subtask.done).length}/{task.subtasks.length}</span><span>{task.progress}%</span></div><div className="progress-track"><i style={{ width: `${task.progress}%` }} /></div></div>}<div className="task-card-footer"><Avatar user={useTaskStore.getState().members.find((member) => member.id === task.assigneeId)!} size="xs" /><span className="due-date"><CalendarDays size={13} />{formatDate(task.dueDate)}</span><span className="card-meta"><MessageCircle size={13} />{task.comments}</span>{task.attachments > 0 && <span className="card-meta"><Tag size={13} />{task.attachments}</span>}</div></article>
}

function TaskCardContent({ task, isOverlay }: { task: Task; isOverlay?: boolean }) {
  return <div className={`task-card ${isOverlay ? 'overlay-card' : ''}`}><div className="task-card-top"><span className="priority-pill" style={{ color: priorityColors[task.priority], background: `${priorityColors[task.priority]}18` }}><span className="priority-dot" style={{ background: priorityColors[task.priority] }} />{task.priority}</span><GripVertical size={16} /></div><h3>{task.title}</h3><p>{task.description}</p><div className="tag-row">{task.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div></div>
}

function SettingsPage() {
  const theme = useTaskStore((state) => state.theme)
  const setTheme = useTaskStore((state) => state.setTheme)
  return <div className="settings-layout"><section className="card settings-card"><div className="settings-heading"><div className="settings-icon"><Sparkles size={18} /></div><div><span className="eyebrow">Appearance</span><h2>Set the atmosphere</h2><p>Choose how TaskFlow feels when you open it.</p></div></div><div className="theme-options">{([['dark', 'Dark mode', 'The focused cocoa workspace', Moon], ['light', 'Light mode', 'A little more daylight, same clarity', Sun], ['system', 'Use system setting', 'Follow your device preference', PanelLeft]] as const).map(([value, label, description, Icon]) => <button key={value} className={`theme-option ${theme === value ? 'selected' : ''}`} onClick={() => setTheme(value)}><span className={`theme-preview ${value}`}><Icon size={18} /></span><span><strong>{label}</strong><small>{description}</small></span>{theme === value && <CheckCircle2 className="theme-check" size={18} />}</button>)}</div></section><section className="card settings-card"><div className="settings-heading"><div className="settings-icon green"><Command size={18} /></div><div><span className="eyebrow">Shortcuts</span><h2>Move with intention</h2><p>Little shortcuts for when your hands are already moving.</p></div></div><div className="shortcut-list"><Shortcut label="Open command search" keys={['⌘', 'K']} /><Shortcut label="Create a new task" keys={['N']} /><Shortcut label="Close modal or drawer" keys={['Esc']} /></div></section><section className="card settings-card workspace-settings"><div className="settings-heading"><div className="settings-icon orange"><Users size={18} /></div><div><span className="eyebrow">Workspace</span><h2>Studio North</h2><p>3 projects · 5 collaborators · Last synced just now</p></div></div><div className="settings-row"><div><strong>Workspace notifications</strong><span>Receive a gentle nudge when work needs you.</span></div><button className="toggle is-on" aria-label="Workspace notifications enabled"><span /></button></div><div className="settings-row"><div><strong>Compact task cards</strong><span>Fit more context on your board when you need it.</span></div><button className="toggle" aria-label="Compact task cards disabled"><span /></button></div></section></div>
}

function Shortcut({ label, keys }: { label: string; keys: string[] }) { return <div className="shortcut-row"><span>{label}</span><div>{keys.map((key) => <kbd key={key}>{key}</kbd>)}</div></div> }

function TaskModal() {
  const isOpen = useTaskStore((state) => state.isTaskModalOpen)
  const selectedTaskId = useTaskStore((state) => state.selectedTaskId)
  const tasks = useTaskStore((state) => state.tasks)
  const members = useTaskStore((state) => state.members)
  const closeTask = useTaskStore((state) => state.closeTask)
  const updateTask = useTaskStore((state) => state.updateTask)
  const createTask = useTaskStore((state) => state.createTask)
  const toggleSubtask = useTaskStore((state) => state.toggleSubtask)
  const existing = tasks.find((task) => task.id === selectedTaskId)
  const [draft, setDraft] = useState<Task | null>(existing || null)
  useEffect(() => { setDraft(existing || null) }, [existing, isOpen])
  if (!isOpen) return null
  const isNew = !existing
  const working = draft || { id: '', title: '', description: '', status: 'todo' as TaskStatus, priority: 'Medium' as Priority, tags: [], assigneeId: members[0].id, dueDate: '2026-11-05', projectId: 'atlas', progress: 0, subtasks: [], comments: 0, attachments: 0, updatedAt: 'Just now' }
  const set = <K extends keyof Task>(key: K, value: Task[K]) => setDraft({ ...working, [key]: value })
  const save = () => { if (!working.title.trim()) return; if (isNew) { createTask({ ...working, id: `task-${Date.now()}`, title: working.title.trim() }); closeTask(); return } updateTask(working); closeTask() }
  return <div className="modal-layer" role="dialog" aria-modal="true" aria-label={isNew ? 'Create task' : 'Edit task'}><button className="modal-backdrop" onClick={closeTask} aria-label="Close task dialog" /><div className="task-modal"><div className="modal-header"><div><span className="eyebrow">{isNew ? 'New task' : 'Task detail'}</span><h2>{isNew ? 'Give it a clear next step.' : 'Make the work legible.'}</h2></div><button className="icon-button" onClick={closeTask} aria-label="Close"><X size={19} /></button></div><div className="modal-body"><label className="field-label">Task title<input autoFocus className="text-input title-input" value={working.title} onChange={(event) => set('title', event.target.value)} placeholder="What needs to move forward?" /></label><label className="field-label">Description<textarea className="text-input textarea" value={working.description} onChange={(event) => set('description', event.target.value)} placeholder="Add a little context for the team…" rows={4} /></label><div className="field-grid"><label className="field-label">Status<select className="text-input" value={working.status} onChange={(event) => set('status', event.target.value as TaskStatus)}><option value="todo">To do</option><option value="inprogress">In progress</option><option value="review">Review</option><option value="done">Done</option></select></label><label className="field-label">Priority<select className="text-input" value={working.priority} onChange={(event) => set('priority', event.target.value as Priority)}><option>Low</option><option>Medium</option><option>High</option></select></label></div><div className="field-grid"><label className="field-label">Assignee<select className="text-input" value={working.assigneeId} onChange={(event) => set('assigneeId', event.target.value)}>{members.map((member) => <option value={member.id} key={member.id}>{member.name}</option>)}</select></label><label className="field-label">Due date<input type="date" className="text-input" value={working.dueDate} onChange={(event) => set('dueDate', event.target.value)} /></label></div><label className="field-label">Tags<input className="text-input" value={working.tags.join(', ')} onChange={(event) => set('tags', event.target.value.split(',').map((tag) => tag.trim()).filter(Boolean))} placeholder="Design, Mobile" /></label>{!isNew && <div className="subtasks-editor"><div className="subtasks-heading"><span className="field-label">Subtasks</span><span>{working.subtasks.filter((subtask) => subtask.done).length}/{working.subtasks.length} complete</span></div>{working.subtasks.map((subtask) => <button className={`subtask-row ${subtask.done ? 'done' : ''}`} key={subtask.id} onClick={() => toggleSubtask(working.id, subtask.id)}><span className="check-box">{subtask.done && <Check size={12} />}</span><span>{subtask.label}</span></button>)}</div>}</div><div className="modal-footer"><button className="ghost-button" onClick={closeTask}>Cancel</button><button className="primary-button" onClick={save}><Check size={15} /> {isNew ? 'Create task' : 'Save changes'}</button></div></div></div>
}

function Avatar({ user, size = 'md' }: { user: User; size?: 'xs' | 'sm' | 'md' }) { return <span className={`avatar avatar-${size}`} style={{ background: `${user.color}22`, color: user.color }} title={user.name}>{user.initials}</span> }

export default App
