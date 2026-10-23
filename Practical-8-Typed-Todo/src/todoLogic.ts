
import type { Task } from "./types";

let tasks: Task[] = [];

export function addTask(title: string): void {
    const newTask: Task = {
        id: Date.now(),
        title: title,
        completed: false
    };

    tasks.push(newTask);
}

export function toggleTask(id: number): void {
    tasks = tasks.map((task: Task) => {
        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });
}

export function deleteTask(id: number): void {
    tasks = tasks.filter(
        (task: Task) => task.id !== id
    );
}

export function getTasks(): Task[] {
    return [...tasks];
}
