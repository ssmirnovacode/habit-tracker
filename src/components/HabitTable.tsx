
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { useStore } from '../store/useStore';
import HabitRow from './HabitRow';
import { WEEKDAYS } from '../utils/constants';

const HabitTable = () => {
    const { habits, currentWeekStart, setCurrentWeek, isLoading } = useStore();

    const days = Array.from({ length: 7 }, (_, i) =>
        currentWeekStart.add({ days: i })
    );



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
                <div className="week-label">
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
                <div className="grid-container">
                    <div className="grid-header">
                        <div className="header-cell">Habit</div>
                        {WEEKDAYS.map((name, i) => (
                            <div key={name} className="header-cell day-header">
                                <div className="day-name">{name}</div>
                                <div className="day-number">{days[i].day}</div>
                            </div>
                        ))}
                    </div>
                    <div className="grid-body">
                        {habits.map((habit) => (
                            <HabitRow
                                key={habit.id}
                                habitId={habit.id!}
                                habitName={habit.name}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HabitTable;
