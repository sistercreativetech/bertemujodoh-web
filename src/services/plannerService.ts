export interface PlannerTask {
  id: string;
  title: string;
  category: 'Spiritual' | 'Mental & Relasi' | 'Finansial & KUA' | 'Walimah & Acara';
  done: boolean;
  notes?: string;
}

export const INITIAL_PLANNER_TASKS: PlannerTask[] = [
  // Spiritual
  { id: 'p-1', title: 'Shalat Istikharah & memantapkan niat lillahi ta’ala', category: 'Spiritual', done: true },
  { id: 'p-2', title: 'Menyelesaikan bacaan Bab 1-5 Kurikulum Pranikah', category: 'Spiritual', done: true },
  { id: 'p-3', title: 'Memperbanyak istighfar & doa jodoh di sepertiga malam', category: 'Spiritual', done: false },

  // Mental & Relasi
  { id: 'p-4', title: 'Diskusi terbuka bersama orang tua dan wali nasab', category: 'Mental & Relasi', done: true },
  { id: 'p-5', title: 'Menyamakan kesepakatan tempat tinggal pasca akad', category: 'Mental & Relasi', done: false },
  { id: 'p-6', title: 'Konseling pranikah atau tes psikologi kesiapan emosi', category: 'Mental & Relasi', done: false },

  // Finansial & KUA
  { id: 'p-7', title: 'Menyiapkan berkas administrasi KUA (N1, N2, N4, KTP, KK)', category: 'Finansial & KUA', done: false },
  { id: 'p-8', title: 'Medical Check-up Pranikah & suntik imunisasi TT', category: 'Finansial & KUA', done: false },
  { id: 'p-9', title: 'Menetapkan rincian dan kesepakatan mahar yang berkah', category: 'Finansial & KUA', done: false },
  { id: 'p-10', title: 'Menyusun simulasi cashflow dan tabungan darurat keluarga', category: 'Finansial & KUA', done: false },

  // Walimah & Acara
  { id: 'p-11', title: 'Menentukan tanggal akad nikah & lokasi masjid/KUA', category: 'Walimah & Acara', done: false },
  { id: 'p-12', title: 'Membuat undangan pernikahan digital di Bertemu Jodoh', category: 'Walimah & Acara', done: false },
  { id: 'p-13', title: 'Menyusun daftar tamu undangan dan koordinasi keluarga', category: 'Walimah & Acara', done: false },
];

const PLANNER_STORAGE_KEY = 'bertemujodoh_planner_tasks';

export const getPlannerTasks = (userId: string): PlannerTask[] => {
  try {
    const raw = localStorage.getItem(`${PLANNER_STORAGE_KEY}_${userId}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_PLANNER_TASKS;
};

export const savePlannerTasks = (userId: string, tasks: PlannerTask[]) => {
  try {
    localStorage.setItem(`${PLANNER_STORAGE_KEY}_${userId}`, JSON.stringify(tasks));
  } catch (e) {
    console.error(e);
  }
};

export const toggleTaskDone = (userId: string, taskId: string): PlannerTask[] => {
  const tasks = getPlannerTasks(userId);
  const updated = tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t));
  savePlannerTasks(userId, updated);
  return updated;
};

export const addTask = (
  userId: string,
  title: string,
  category: PlannerTask['category']
): PlannerTask[] => {
  const tasks = getPlannerTasks(userId);
  const newTask: PlannerTask = {
    id: `custom-${Date.now()}`,
    title,
    category,
    done: false,
  };
  const updated = [newTask, ...tasks];
  savePlannerTasks(userId, updated);
  return updated;
};

export const deleteTask = (userId: string, taskId: string): PlannerTask[] => {
  const tasks = getPlannerTasks(userId);
  const updated = tasks.filter((t) => t.id !== taskId);
  savePlannerTasks(userId, updated);
  return updated;
};
