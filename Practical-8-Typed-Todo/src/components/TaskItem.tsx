import type { Task } from "../types";

interface TaskItemProps {
    task: Task;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
}

function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
    return (
        <li>
            <span
                style={{
                    textDecoration: task.completed
                        ? "line-through"
                        : "none"
                }}
            >
                {task.title}
            </span>

            <button onClick={() => onToggle(task.id)}>
                Complete
            </button>

            <button onClick={() => onDelete(task.id)}>
                Delete
            </button>
        </li>
    );
}

export default TaskItem;