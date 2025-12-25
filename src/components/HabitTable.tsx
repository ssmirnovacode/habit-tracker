
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { useStore } from '../store/useStore';
import HabitRow from './HabitRow';

const HabitTable = () => {
    const { habits, currentWeekStart, setCurrentWeek, isLoading } = useStore();

    const days = Array.from({ length: 7 }, (_, i) =>
        currentWeekStart.add({ days: i })
    );

    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    if (isLoading) {
        return <div className="empty-state">Loading your habits...</div>;
    }

    return (
        <div className="habit-table-container">
            <div className="week-navigation">
                <button
                    className="nav-btn"
                    onClick={() => setCurrentWeek(currentWeekStart.subtract({ days: 7 }))}
                >
                    <MdChevronLeft />
                </button>
                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                    Week of {currentWeekStart.month}/{currentWeekStart.day}
                </div>
                <button
                    className="nav-btn"
                    onClick={() => setCurrentWeek(currentWeekStart.add({ days: 7 }))}
                >
                    <MdChevronRight />
                </button>
            </div>

            {habits.length === 0 ? (
                <div className="empty-state">
                    No habits yet. Start by adding one below!
                </div>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Habit</th>
                            {dayNames.map((name, i) => (
                                <th key={name}>
                                    <div>{name}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                        {days[i].day}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {habits.map((habit) => (
                            <HabitRow
                                key={habit.id}
                                habitId={habit.id!}
                                habitName={habit.name}
                            />
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default HabitTable;
