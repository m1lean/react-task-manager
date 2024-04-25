import React, { useState } from 'react';
import './App.css';

function Task({ task, onDelete, onToggle, onRename, onReschedule, onDescriptionChange }) {
    const [isEditing, setIsEditing] = useState(false);
    const [newText, setNewText] = useState(task.text);

    const handleRename = () => {
        onRename(task.id, newText);
        setIsEditing(false);
    };

    const handleReschedule = () => {
        const newTime = prompt('Введите новое время (ЧЧ:ММ)', task.dueTime);
        if (newTime !== null) {
            onReschedule(task.id, newTime);
        }
    };

    const handleDescriptionChangeLocal = (e) => {
        onDescriptionChange(task.id, e.target.value);
    };

    const dueDateTime = new Date(task.dueDate + 'T' + task.dueTime);
    const timeDiff = dueDateTime - new Date();

    const formatTimeLeft = () => {
        const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        if (daysLeft > 0) {
            return `${daysLeft} ${daysLeft === 1 ? 'день' : 'дней'}`;
        } else {
            const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
            const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            return `${hoursLeft} ч ${minutesLeft} мин`;
        }
    };

    return (
        <div className={`task ${task.completed ? 'completed' : ''}`} onDoubleClick={() => onToggle(task.id)}>
            {isEditing ? (
                <input type="text" value={newText} onChange={(e) => setNewText(e.target.value)} onBlur={handleRename} autoFocus />
            ) : (
                <div className="task-header">
                    <h3>{task.text} - {task.dueTime.slice(0, -3)} ({formatTimeLeft()} осталось)</h3>
                    <div className="task-buttons">
                        <button onClick={() => setIsEditing(true)}>Переименовать</button>
                        <button onClick={handleReschedule}>Перенести</button>
                        <button onClick={() => onDelete(task.id)}>Удалить</button>
                    </div>
                </div>
            )}
            <textarea
                value={task.description}
                onChange={handleDescriptionChangeLocal}
                className="task-description"
                rows={1}
                spellCheck="false"
            />
        </div>
    );
}

function TaskForm({ onAdd }) {
    const [text, setText] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim() || !dueDate || !dueTime) return;
        onAdd(text, description, dueDate, dueTime);
        setText('');
        setDescription('');
        setDueDate('');
        setDueTime('');
    };

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <input type="text" placeholder="Название задачи" value={text} onChange={(e) => setText(e.target.value)} />
            <textarea placeholder="Описание задачи" value={description} onChange={(e) => setDescription(e.target.value)} />
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            <input type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)} />
            <button type="submit">Добавить</button>
        </form>
    );
}

function App() {
    const [tasks, setTasks] = useState([]);

    const addTask = (text, description, dueDate, dueTime) => {
        const newTask = { id: tasks.length + 1, text, description, dueDate, dueTime, completed: false };
        setTasks([...tasks, newTask]);
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const toggleTask = (id) => {
        setTasks(tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        }));
    };

    const renameTask = (id, newText) => {
        setTasks(tasks.map(task => {
            if (task.id === id) {
                return { ...task, text: newText };
            }
            return task;
        }));
    };

    const rescheduleTask = (id, newTime) => {
        setTasks(tasks.map(task => {
            if (task.id === id) {
                return { ...task, dueTime: newTime };
            }
            return task;
        }));
    };

    const onDescriptionChange = (id, newDescription) => {
        setTasks(tasks.map(task => {
            if (task.id === id) {
                return { ...task, description: newDescription };
            }
            return task;
        }));
    };

    return (
        <div className="App">
            <h1>Менеджер задач</h1>
            <TaskForm onAdd={addTask} />
            {tasks.map(task => (
                <Task
                    key={task.id}
                    task={task}
                    onDelete={deleteTask}
                    onToggle={toggleTask}
                    onRename={renameTask}
                    onReschedule={rescheduleTask}
                    onDescriptionChange={onDescriptionChange}
                />
            ))}
        </div>
    );
}

export default App;
