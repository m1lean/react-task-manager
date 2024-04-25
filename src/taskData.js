const STORAGE_KEY = 'tasks';

export const saveTasks = (tasks) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const loadTasks = () => {
    const tasksJSON = localStorage.getItem(STORAGE_KEY);
    return tasksJSON ? JSON.parse(tasksJSON) : [];
};

export const clearTasks = () => {
    localStorage.removeItem(STORAGE_KEY);
};
