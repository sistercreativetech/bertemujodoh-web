import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  getPlannerTasks,
  toggleTaskDone,
  addTask,
  deleteTask,
  type PlannerTask,
} from '@/services/plannerService';
import {
  Calendar,
  CheckCircle2,
  Plus,
  Trash2,
  Sparkles,
  Filter,
  Check,
  ShieldCheck,
  Award,
} from 'lucide-react';

export const PlannerPage: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<PlannerTask[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<PlannerTask['category']>('Spiritual');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (user) {
      setTasks(getPlannerTasks(user.id));
    }
  }, [user]);

  const handleToggle = (taskId: string) => {
    if (!user) return;
    const updated = toggleTaskDone(user.id, taskId);
    setTasks(updated);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTitle.trim()) return;

    const updated = addTask(user.id, newTitle.trim(), newCategory);
    setTasks(updated);
    setNewTitle('');
    setShowAddForm(false);
  };

  const handleDelete = (taskId: string) => {
    if (!user) return;
    const updated = deleteTask(user.id, taskId);
    setTasks(updated);
  };

  const categories: Array<'all' | PlannerTask['category']> = [
    'all',
    'Spiritual',
    'Mental & Relasi',
    'Finansial & KUA',
    'Walimah & Acara',
  ];

  const filteredTasks = activeCategory === 'all'
    ? tasks
    : tasks.filter((t) => t.category === activeCategory);

  const completedCount = tasks.filter((t) => t.done).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Main Progress Bar */}
      <div className="bg-white rounded-3xl border border-[#F0E7E9] p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7E6EA] text-[#A95570] text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              <span>Jodoh & Wedding Planner</span>
            </div>
            <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#29252A]">
              Checklist Persiapan Menuju Pernikahan
            </h1>
            <p className="text-xs text-[#777078]">
              Pantau progres persiapan spiritual, kesepakatan keluarga, administrasi KUA, dan walimah secara teratur.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 rounded-xl bg-[#A95570] text-white text-xs font-semibold hover:bg-[#92435b] transition flex items-center gap-1.5 shadow-xs shrink-0 self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Tugas</span>
          </button>
        </div>

        {/* Progress Gauge */}
        <div className="p-5 rounded-2xl bg-[#FFF5F7] border border-[#F7E6EA] space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-[#A95570] flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              Tingkat Kesiapan Pernikahan: {completedCount} dari {tasks.length} Langkah Selesai
            </span>
            <span className="text-lg text-[#29252A] font-serif-editorial">{progressPercent}%</span>
          </div>

          <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-[#F0E7E9]">
            <div
              className="h-full bg-gradient-to-r from-[#C77B91] to-[#A95570] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-[11px] text-[#777078]">
            {progressPercent === 100
              ? '🎉 Ma syaa Allah! Seluruh persiapan telah rampung. Semoga Allah memberkahi akad dan walimah Anda.'
              : progressPercent >= 50
              ? '✨ Bagus sekali! Separuh lebih persiapan telah Anda tuntaskan. Tetap istiqomah dalam ikhtiar.'
              : '🌱 Awali dari langkah-langkah spiritual dan diskusi keluarga terbuka.'}
          </p>
        </div>

        {/* New Task Add Form (Collapsible) */}
        {showAddForm && (
          <form onSubmit={handleAddTask} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3 text-xs">
            <h4 className="font-bold text-[#29252A]">Tambah Langkah Persiapan Baru:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Misal: Fitting busana pengantin syar'i..."
                  className="w-full p-2.5 rounded-xl border border-[#F0E7E9] text-xs focus:outline-none focus:border-[#A95570]"
                />
              </div>
              <div>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-[#F0E7E9] text-xs focus:outline-none focus:border-[#A95570]"
                >
                  <option value="Spiritual">Spiritual</option>
                  <option value="Mental & Relasi">Mental & Relasi</option>
                  <option value="Finansial & KUA">Finansial & KUA</option>
                  <option value="Walimah & Acara">Walimah & Acara</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-xl border border-neutral-300 text-xs font-semibold text-[#777078]"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-[#A95570] text-white text-xs font-semibold hover:bg-[#92435b]"
              >
                Simpan ke Checklist
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                isSelected
                  ? 'bg-[#A95570] text-white shadow-xs'
                  : 'bg-white border border-[#F0E7E9] text-[#777078] hover:bg-[#FFF5F7]'
              }`}
            >
              {cat === 'all' ? 'Semua Checklist' : cat}
            </button>
          );
        })}
      </div>

      {/* Task Checklist Items */}
      <div className="bg-white rounded-3xl border border-[#F0E7E9] p-6 space-y-2.5 shadow-xs">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`p-4 rounded-2xl border transition flex items-center justify-between group ${
              task.done
                ? 'bg-[#FFF5F7]/40 border-[#F7E6EA] text-[#29252A]'
                : 'bg-white border-[#F0E7E9] hover:border-[#F7E6EA]'
            }`}
          >
            <div
              onClick={() => handleToggle(task.id)}
              className="flex items-center gap-3.5 flex-1 cursor-pointer"
            >
              <div
                className={`w-5 h-5 rounded-lg border flex items-center justify-center transition shrink-0 ${
                  task.done
                    ? 'bg-[#A95570] border-[#A95570] text-white'
                    : 'border-gray-300 bg-white group-hover:border-[#A95570]'
                }`}
              >
                {task.done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>

              <div className="space-y-0.5">
                <span
                  className={`text-xs font-medium block transition ${
                    task.done ? 'line-through text-gray-400' : 'text-[#29252A]'
                  }`}
                >
                  {task.title}
                </span>
                <span className="text-[10px] font-semibold text-[#A95570] bg-[#FFF5F7] px-2 py-0.5 rounded-full inline-block">
                  {task.category}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleDelete(task.id)}
              className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-rose-600 rounded-lg transition"
              title="Hapus Tugas"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
