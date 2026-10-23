import { useState } from "react";

interface TaskInputProps {
    onAdd: (title: string) => void;
}

function TaskInput({ onAdd }: TaskInputProps) {
    const [title, setTitle] = useState<string>("");

    function handleAdd(): void {
        if (title.trim() === "") {
            return;
        }

        onAdd(title.trim());
        setTitle("");
    }

    return (
        <div>
            <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter task"
            />

            <button onClick={handleAdd}>
                Add Task
            </button>
        </div>
    );
}

export default TaskInput;