import './App.css'

const focusTasks = [
  'Submit DBMS assignment',
  'Revise arrays and strings',
  'Deploy mini project',
]

const lanes = [
  {
    title: 'Focus',
    items: ['Finish report', 'Practice DSA', 'Record demo'],
  },
  {
    title: 'Research',
    items: ['React patterns', 'API notes', 'UI references'],
  },
  {
    title: 'Later',
    items: ['Portfolio idea', 'Club poster', 'Hackathon links'],
  },
]

const features = [
  ['Quick Capture', 'Paste a link, note, deadline, or task in one input.'],
  ['Smart Categories', 'Sort work into Focus, Research, Assignment, Coding, Deadline, and Later.'],
  ['Focus Mode', 'Show only the top three actions for the current study session.'],
  ['Local Save', 'Keep the MVP fast and reliable with browser storage first.'],
]

export function App() {
  return (
    <main className="app">
      <nav className="nav" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="TabPilot home">
          <span className="brand-mark">TP</span>
          <span>TabPilot</span>
        </a>
        <a className="nav-link" href="#features">Features</a>
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
            <a href="#demo" className="button">View demo flow</a>
            <a href="#features" className="button button-secondary">See features</a>
          </div>
        </div>

        <section className="dashboard" id="demo" aria-label="TabPilot dashboard preview">
          <header>
            <div>
              <span className="tiny-label">Today’s Focus</span>
              <h2>Study cockpit</h2>
            </div>
            <span className="score">72%</span>
          </header>

          <form className="capture-form" aria-label="Quick capture form">
            <input
              aria-label="Capture a study item"
              defaultValue="https://react.dev/learn"
            />
            <button type="button">Capture</button>
          </form>

          <div className="focus-list">
            {focusTasks.map((task, index) => (
              <label key={task}>
                <input type="checkbox" defaultChecked={index === 0} />
                <span>{task}</span>
              </label>
            ))}
          </div>

          <div className="lanes">
            {lanes.map((lane) => (
              <article key={lane.title}>
                <h3>{lane.title}</h3>
                {lane.items.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </article>
            ))}
          </div>
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
