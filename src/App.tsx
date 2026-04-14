import { useState, useEffect } from 'react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('zen-tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    localStorage.setItem('zen-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) return;
    const task: Task = {
      id: crypto.randomUUID(),
      text: newTask.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    setTasks([task, ...tasks]);
    setNewTask('');
    setIsAdding(false);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addTask();
    if (e.key === 'Escape') {
      setNewTask('');
      setIsAdding(false);
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-[#F5F1EB] relative overflow-hidden flex flex-col">
      {/* Paper texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle grid lines like ruled paper */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#2C2C2C 1px, transparent 1px)',
          backgroundSize: '100% 32px',
        }}
      />

      <main className="flex-1 relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-16">
        {/* Header */}
        <header className="mb-8 md:mb-16">
          <div className="flex items-end gap-3 md:gap-4 mb-2">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#2C2C2C] tracking-tight leading-none">
              Tasks
            </h1>
            {/* Hanko seal */}
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-sm bg-[#C65D3B] flex items-center justify-center transform rotate-3 shadow-sm mb-1">
              <span className="text-white font-display text-xs md:text-sm">DO</span>
            </div>
          </div>
          <p className="font-body text-[#8B8680] text-sm md:text-base tracking-wide">
            {tasks.length === 0
              ? 'Begin with clarity'
              : `${completedCount} of ${tasks.length} completed`}
          </p>
        </header>

        {/* Add task section */}
        <section className="mb-8 md:mb-12">
          {isAdding ? (
            <div className="bg-white/60 backdrop-blur-sm border border-[#E5E0D8] rounded-lg p-4 md:p-6 shadow-sm animate-fadeIn">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What needs to be done?"
                autoFocus
                className="w-full bg-transparent font-handwriting text-lg md:text-xl text-[#2C2C2C] placeholder-[#C5C0B8] outline-none"
              />
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
                <button
                  onClick={addTask}
                  disabled={!newTask.trim()}
                  className="px-5 py-3 sm:py-2.5 bg-[#2C2C2C] text-white font-body text-sm tracking-wide rounded-md hover:bg-[#1A1A1A] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Add task
                </button>
                <button
                  onClick={() => { setNewTask(''); setIsAdding(false); }}
                  className="px-5 py-3 sm:py-2.5 text-[#8B8680] font-body text-sm tracking-wide hover:text-[#2C2C2C] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="group flex items-center gap-3 text-[#8B8680] hover:text-[#2C2C2C] transition-colors py-3"
            >
              <span className="w-10 h-10 md:w-8 md:h-8 rounded-full border-2 border-dashed border-current flex items-center justify-center group-hover:border-solid transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </span>
              <span className="font-body text-sm md:text-base tracking-wide">Add a new task</span>
            </button>
          )}
        </section>

        {/* Task list */}
        <section className="space-y-2">
          {tasks.map((task, index) => (
            <article
              key={task.id}
              className="group relative bg-white/40 hover:bg-white/70 backdrop-blur-sm border border-[#E5E0D8] rounded-lg p-4 md:p-5 transition-all duration-300 animate-slideIn"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-3 md:gap-4">
                {/* Checkbox */}
                <button
                  onClick={() => toggleTask(task.id)}
                  className="flex-shrink-0 mt-0.5"
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    task.completed
                      ? 'bg-[#C65D3B] border-[#C65D3B]'
                      : 'border-[#C5C0B8] hover:border-[#8B8680]'
                  }`}>
                    {task.completed && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </button>

                {/* Task text */}
                <div className="flex-1 min-w-0">
                  <p className={`font-handwriting text-lg md:text-xl leading-relaxed break-words transition-all duration-300 ${
                    task.completed
                      ? 'text-[#B5B0A8] line-through decoration-[#C65D3B]/60 decoration-2'
                      : 'text-[#2C2C2C]'
                  }`}>
                    {task.text}
                  </p>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="flex-shrink-0 w-10 h-10 md:w-8 md:h-8 flex items-center justify-center text-[#C5C0B8] opacity-100 md:opacity-0 group-hover:opacity-100 hover:text-[#C65D3B] transition-all duration-200"
                  aria-label="Delete task"
                >
                  <svg className="w-5 h-5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </section>

        {/* Empty state */}
        {tasks.length === 0 && (
          <div className="text-center py-12 md:py-20 animate-fadeIn">
            <div className="inline-block mb-6">
              {/* Enso circle - Zen symbol */}
              <svg className="w-20 h-20 md:w-24 md:h-24 text-[#E5E0D8]" viewBox="0 0 100 100">
                <path
                  d="M50 10 C75 10, 90 30, 90 50 C90 75, 70 90, 45 90 C20 90, 10 70, 10 50 C10 35, 20 20, 35 15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="font-body text-[#8B8680] text-base md:text-lg tracking-wide mb-2">
              A clear mind awaits
            </p>
            <p className="font-body text-[#B5B0A8] text-sm">
              Add your first task to begin
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 md:py-8 text-center">
        <p className="font-body text-[#B5B0A8] text-xs tracking-wide">
          Requested by @PauliusX · Built by @clonkbot
        </p>
      </footer>
    </div>
  );
}

export default App;
