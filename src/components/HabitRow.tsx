import { useState, useRef, useEffect } from 'react';
import { MdCheckCircle, MdRadioButtonUnchecked, MdDelete, MdEdit } from 'react-icons/md';
import { useStore } from '../store/useStore';

interface HabitRowProps {
    habitId: number;
    habitName: string;
}

const HabitRow = ({ habitId, habitName }: HabitRowProps) => {
    const { currentWeekStart, completions, toggleCompletion, deleteHabit, updateHabit } = useStore();
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(habitName);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleSave = async () => {
        if (editName.trim() && editName.trim() !== habitName) {
            await updateHabit(habitId, editName.trim());
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') {
            setEditName(habitName);
            setIsEditing(false);
        }
    };

    const days = Array.from({ length: 7 }, (_, i) =>
        currentWeekStart.add({ days: i })
    );

    return (
        <tr>
            <td className="habit-name-cell">
                {isEditing ? (
                    <div className="edit-container">
                        <input
                            ref={inputRef}
                            className="edit-input"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={handleSave}
                        />
                    </div>
                ) : (
                    <div className="habit-name-display">
                        <span className="habit-text" onClick={() => setIsEditing(true)}>
                            {habitName}
                        </span>
                        <div className="habit-actions">
                            <button className="action-btn edit" onClick={() => setIsEditing(true)}>
                                <MdEdit />
                            </button>
                            <button
                                className="action-btn delete"
                                onClick={() => confirm(`Delete habit "${habitName}"?`) && deleteHabit(habitId)}
                            >
                                <MdDelete />
                            </button>
                        </div>
                    </div>
                )}
            </td>
            {days.map((day) => {
                const dateStr = day.toString();
                const isCompleted = completions.some(
                    (c) => c.habitId === habitId && c.date === dateStr
                );

                return (
                    <td
                        key={dateStr}
                        className="day-cell"
                        onClick={() => toggleCompletion(habitId, dateStr)}
                    >
                        {isCompleted ? (
                            <div className="check-icon">
                                <MdCheckCircle />
                            </div>
                        ) : (
                            <div className="uncheck-icon" style={{ opacity: 0.2, display: 'flex', justifyContent: 'center' }}>
                                <MdRadioButtonUnchecked />
                            </div>
                        )}
                    </td>
                );
            })}
        </tr>
    );
};

export default HabitRow;
