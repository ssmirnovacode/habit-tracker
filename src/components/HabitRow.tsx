
import { MdCheckCircle, MdRadioButtonUnchecked } from 'react-icons/md';
import { useStore } from '../store/useStore';

interface HabitRowProps {
    habitId: number;
    habitName: string;
}

const HabitRow = ({ habitId, habitName }: HabitRowProps) => {
    const { currentWeekStart, completions, toggleCompletion, deleteHabit } = useStore();

    const days = Array.from({ length: 7 }, (_, i) =>
        currentWeekStart.add({ days: i })
    );

    return (
        <tr>
            <td onDoubleClick={() => confirm(`Delete habit "${habitName}"?`) && deleteHabit(habitId)}>
                {habitName}
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
