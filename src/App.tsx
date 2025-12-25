import { useEffect } from 'react';
import './App.css'
import HabitTable from './components/HabitTable'
import AddHabit from './components/AddHabit'
import { useStore } from './store/useStore'

function App() {
  const { fetchData } = useStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="app-container">
      <h1>Habit Tracker</h1>
      <HabitTable />
      <AddHabit />
    </div>
  )
}

export default App
