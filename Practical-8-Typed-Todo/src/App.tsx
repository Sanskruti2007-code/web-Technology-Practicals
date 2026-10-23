
import { useState } from "react";
import TaskInput from "./components/TaskInput";
import TaskItem from "./components/TaskItem";
import type { Task } from "./types";
import "./App.css";

function App() {
    const [tasks, setTasks] = useState<Task[]>([]);

    function addTask(title: string): void {
        const newTask: Task = {
            id: Date.now(),
            title: title,
            completed: false
        };

        setTasks((previousTasks) => [...previousTasks, newTask]);
    }

    function toggleTask(id: number): void {
        setTasks((previousTasks) =>
            previousTasks.map((task) =>
                task.id === id
                    ? { ...task, completed: !task.completed }
                    : task
            )
        );
    }

    function deleteTask(id: number): void {
        setTasks((previousTasks) =>
            previousTasks.filter((task) => task.id !== id)
        );
    }

    return (
        <div className="todo-app">
            <h1>Typed To-Do List</h1>

            <TaskInput onAdd={addTask} />

            {tasks.length === 0 ? (
                <p>No tasks yet. Add your first task!</p>
            ) : (
                <ul>
                    {tasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onToggle={toggleTask}
                            onDelete={deleteTask}
                        />
                    ))}
                </ul>
            )}

            <p>Total tasks: {tasks.length}</p>
        </div>
    );
}

export default App;
