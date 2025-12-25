
import { useState } from 'react';
import { useStore } from '../store/useStore';
import { MdAdd } from 'react-icons/md';

const AddHabit = () => {
    const [name, setName] = useState('');
    const { addHabit } = useStore();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            addHabit(name.trim());
            setName('');
        }
    };

    return (
        <form className="add-habit-container" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="New habit (e.g. Read 10 pages)"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MdAdd /> Add Habit
            </button>
        </form>
    );
};

export default AddHabit;
