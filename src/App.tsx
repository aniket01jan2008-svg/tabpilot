import { type FormEvent, useEffect, useMemo, useState } from 'react'
import './App.css'

type Resource = {
  id: string
  title: string
  url: string
  category: 'Focus' | 'Research' | 'Later'
}

type FocusTask = {
  id: string
  title: string
  done: boolean
}

type StudySession = {
  id: string
  title: string
  goal: string
  resources: Resource[]
  tasks: FocusTask[]
}

const STORAGE_KEY = 'tabpilot.sessions.v1'

const starterSessions: StudySession[] = [
  {
    id: 'session-codestorm',
    title: 'CodeStorm Build',
    goal: 'Prepare a demo-ready TabPilot submission',
    resources: [
      {
        id: 'resource-react',
        title: 'React docs',
        url: 'https://react.dev/learn',
        category: 'Research',
      },
      {
        id: 'resource-demo',
        title: 'Demo video checklist',
        url: 'https://files.catbox.moe/oj2c4r.mp4',
        category: 'Focus',
      },
    ],
    tasks: [
      { id: 'task-session', title: 'Create interactive sessions', done: true },
      { id: 'task-links', title: 'Add resource link capture', done: false },
      { id: 'task-submit', title: 'Update Devfolio project page', done: false },
    ],
  },
]

const features = [
  ['Session Builder', 'Create a study or project workspace with a clear goal.'],
  ['Resource Capture', 'Save important links and sort them into Focus, Research, or Later.'],
  ['Task Tracking', 'Keep the current session limited to three high-priority actions.'],
  ['Local Save', 'All MVP data persists in browser local storage without backend setup.'],
]

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}

function loadSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return starterSessions
    const parsed = JSON.parse(raw) as StudySession[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : starterSessions
  } catch {
    return starterSessions
  }
}

export function App() {
  const [sessions, setSessions] = useState<StudySession[]>(loadSessions)
  const [activeSessionId, setActiveSessionId] = useState(starterSessions[0].id)
  const [sessionTitle, setSessionTitle] = useState('')
  const [sessionGoal, setSessionGoal] = useState('')
  const [resourceTitle, setResourceTitle] = useState('')
  const [resourceUrl, setResourceUrl] = useState('')
  const [resourceCategory, setResourceCategory] = useState<Resource['category']>('Focus')
  const [taskTitle, setTaskTitle] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
    if (!sessions.some((session) => session.id === activeSessionId)) {
      setActiveSessionId(sessions[0]?.id ?? starterSessions[0].id)
    }
  }, [activeSessionId, sessions])

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId) ?? sessions[0],
    [activeSessionId, sessions],
  )

  const completion = activeSession.tasks.length
    ? Math.round(
        (activeSession.tasks.filter((task) => task.done).length / activeSession.tasks.length) * 100,
      )
    : 0

  const lanes = useMemo(
    () =>
      (['Focus', 'Research', 'Later'] as const).map((category) => ({
        title: category,
        items: activeSession.resources.filter((resource) => resource.category === category),
      })),
    [activeSession.resources],
  )

  function updateActiveSession(updater: (session: StudySession) => StudySession) {
    setSessions((currentSessions) =>
      currentSessions.map((session) => (session.id === activeSession.id ? updater(session) : session)),
    )
  }

  function handleCreateSession(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = sessionTitle.trim()
    const goal = sessionGoal.trim()
    if (!title || !goal) return

    const session: StudySession = {
      id: createId('session'),
      title,
      goal,
      resources: [],
      tasks: [],
    }

    setSessions((currentSessions) => [session, ...currentSessions])
    setActiveSessionId(session.id)
    setSessionTitle('')
    setSessionGoal('')
  }

  function handleAddResource(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = resourceTitle.trim()
    const url = resourceUrl.trim()
    if (!title || !url) return

    updateActiveSession((session) => ({
      ...session,
      resources: [
        {
          id: createId('resource'),
          title,
          url,
          category: resourceCategory,
        },
        ...session.resources,
      ],
    }))
    setResourceTitle('')
    setResourceUrl('')
    setResourceCategory('Focus')
  }

  function handleAddTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = taskTitle.trim()
    if (!title) return

    updateActiveSession((session) => ({
      ...session,
      tasks: [{ id: createId('task'), title, done: false }, ...session.tasks].slice(0, 3),
    }))
    setTaskTitle('')
  }

  function toggleTask(taskId: string) {
    updateActiveSession((session) => ({
      ...session,
      tasks: session.tasks.map((task) =>
        task.id === taskId ? { ...task, done: !task.done } : task,
      ),
    }))
  }

  function resetDemo() {
    setSessions(starterSessions)
    setActiveSessionId(starterSessions[0].id)
  }

  return (
    <main className="app">
      <nav className="nav" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="TabPilot home">
          <span className="brand-mark">TP</span>
          <span>TabPilot</span>
        </a>
        <div className="nav-actions">
          <a className="nav-link" href="#demo">MVP</a>
          <a className="nav-link" href="#features">Features</a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">CodeStorm 2026 #2 Submission</p>
          <h1>Turn scattered study tabs into one clear action board.</h1>
          <p>
            TabPilot helps students capture links, notes, deadlines, and tasks,
            organize them by purpose, and focus on the three actions that matter
            today.
          </p>
          <div className="hero-actions">
            <a href="#demo" className="button">Try the MVP</a>
            <a href="#features" className="button button-secondary">See features</a>
          </div>
        </div>

        <section className="dashboard" id="demo" aria-label="Interactive TabPilot MVP">
          <header>
            <div>
              <span className="tiny-label">Interactive MVP</span>
              <h2>{activeSession.title}</h2>
              <p>{activeSession.goal}</p>
            </div>
            <span className="score">{completion}%</span>
          </header>

          <div className="session-switcher" aria-label="Choose a study session">
            {sessions.map((session) => (
              <button
                className={session.id === activeSession.id ? 'active' : ''}
                key={session.id}
                type="button"
                onClick={() => setActiveSessionId(session.id)}
              >
                {session.title}
              </button>
            ))}
          </div>

          <form className="session-form" onSubmit={handleCreateSession}>
            <input
              aria-label="New session title"
              placeholder="New session title"
              value={sessionTitle}
              onChange={(event) => setSessionTitle(event.target.value)}
            />
            <input
              aria-label="New session goal"
              placeholder="Goal for this session"
              value={sessionGoal}
              onChange={(event) => setSessionGoal(event.target.value)}
            />
            <button type="submit">Create session</button>
          </form>

          <form className="capture-form" onSubmit={handleAddResource}>
            <input
              aria-label="Resource title"
              placeholder="Resource title"
              value={resourceTitle}
              onChange={(event) => setResourceTitle(event.target.value)}
            />
            <input
              aria-label="Resource URL"
              placeholder="https://example.com"
              value={resourceUrl}
              onChange={(event) => setResourceUrl(event.target.value)}
            />
            <select
              aria-label="Resource category"
              value={resourceCategory}
              onChange={(event) => setResourceCategory(event.target.value as Resource['category'])}
            >
              <option>Focus</option>
              <option>Research</option>
              <option>Later</option>
            </select>
            <button type="submit">Add resource</button>
          </form>

          <form className="task-form" onSubmit={handleAddTask}>
            <input
              aria-label="Focus task"
              placeholder="Add one of your top 3 tasks"
              value={taskTitle}
              onChange={(event) => setTaskTitle(event.target.value)}
            />
            <button type="submit">Add task</button>
          </form>

          <div className="focus-list" aria-label="Top focus tasks">
            {activeSession.tasks.map((task) => (
              <label className={task.done ? 'done' : ''} key={task.id}>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                />
                <span>{task.title}</span>
              </label>
            ))}
            {activeSession.tasks.length === 0 && (
              <p className="empty-state">Add up to three focus tasks for this session.</p>
            )}
          </div>

          <div className="lanes">
            {lanes.map((lane) => (
              <article key={lane.title}>
                <h3>{lane.title}</h3>
                {lane.items.map((item) => (
                  <a href={item.url} key={item.id} rel="noreferrer" target="_blank">
                    {item.title}
                  </a>
                ))}
                {lane.items.length === 0 && <p>No resources yet.</p>}
              </article>
            ))}
          </div>

          <button className="reset-button" type="button" onClick={resetDemo}>
            Reset demo data
          </button>
        </section>
      </section>

      <section className="problem">
        <p className="eyebrow">Problem</p>
        <h2>Students lose time managing study clutter before they even start working.</h2>
        <p>
          Browser tabs, PDFs, videos, notes, coding tasks, and assignment
          deadlines live in different places. TabPilot turns that messy moment
          into a structured workflow: capture, organize, focus, complete.
        </p>
      </section>

      <section className="features" id="features" aria-labelledby="features-title">
        <div>
          <p className="eyebrow">MVP Features</p>
          <h2 id="features-title">Built for a fast, useful web demo.</h2>
        </div>
        <div className="feature-grid">
          {features.map(([title, body]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
