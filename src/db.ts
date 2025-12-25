
const DB_NAME = 'HabitTrackerDB';
const DB_VERSION = 1;

export type Habit = {
    id?: number;
    name: string;
    createdAt: string;
}

export type Completion = {
    id?: number;
    habitId: number;
    date: string;
}

class Database {
    private db: IDBDatabase | null = null;

    async open(): Promise<IDBDatabase> {
        if (this.db) return this.db;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                if (!db.objectStoreNames.contains('habits')) {
                    db.createObjectStore('habits', { keyPath: 'id', autoIncrement: true });
                }

                if (!db.objectStoreNames.contains('completions')) {
                    const completionStore = db.createObjectStore('completions', { keyPath: 'id', autoIncrement: true });
                    completionStore.createIndex('habitId', 'habitId', { unique: false });
                    completionStore.createIndex('date', 'date', { unique: false });
                    completionStore.createIndex('habitId_date', ['habitId', 'date'], { unique: true });
                }
            };

            request.onsuccess = (event) => {
                this.db = (event.target as IDBOpenDBRequest).result;
                resolve(this.db);
            };

            request.onerror = (event) => {
                reject((event.target as IDBOpenDBRequest).error);
            };
        });
    }

    async getAllHabits(): Promise<Habit[]> {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('habits', 'readonly');
            const store = transaction.objectStore('habits');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async addHabit(name: string): Promise<number> {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('habits', 'readwrite');
            const store = transaction.objectStore('habits');
            const habit: Habit = { name, createdAt: new Date().toISOString() };
            const request = store.add(habit);

            request.onsuccess = () => resolve(request.result as number);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteHabit(id: number): Promise<void> {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['habits', 'completions'], 'readwrite');
            const habitStore = transaction.objectStore('habits');
            const completionStore = transaction.objectStore('completions');

            habitStore.delete(id);

            const index = completionStore.index('habitId');
            const request = index.openKeyCursor(IDBKeyRange.only(id));

            request.onsuccess = () => {
                const cursor = request.result;
                if (cursor) {
                    completionStore.delete(cursor.primaryKey);
                    cursor.continue();
                }
            };

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    }

    async getAllCompletions(): Promise<Completion[]> {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('completions', 'readonly');
            const store = transaction.objectStore('completions');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async toggleCompletion(habitId: number, date: string): Promise<void> {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('completions', 'readwrite');
            const store = transaction.objectStore('completions');
            const index = store.index('habitId_date');
            const request = index.get([habitId, date]);

            request.onsuccess = () => {
                if (request.result) {
                    store.delete(request.result.id);
                } else {
                    store.add({ habitId, date });
                }
            };

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    }
}

export const db = new Database();
