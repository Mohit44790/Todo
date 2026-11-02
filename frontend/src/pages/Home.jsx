
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasks,
  addTask,
  editTask,
  deleteTask,
} from "../redux/slices/taskSlice";

import { groupByWeek } from "../utils/week";
import TaskSheet from "../components/TaskSheet";
import SearchPanel from "../components/SearchPanel";
import TaskRow from "../components/TaskRow";
import WeekCard from "../components/WeekCard";

const getDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getWeekDates = () => {
  const today = new Date();
  const monday = new Date(today);
  const day = monday.getDay();

  monday.setDate(monday.getDate() - (day === 0 ? 6 : day - 1));
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return date;
  });
};

export default function Home() {
  const dispatch = useDispatch();

  const { tasks = [], loading, error } = useSelector(
    (state) => state.tasks
  );

  const [selectedDate, setSelectedDate] = useState(getDateKey(new Date()));
  const [showSheet, setShowSheet] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showAllWeeks, setShowAllWeeks] = useState(false);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const weekDates = useMemo(() => getWeekDates(), []);

  const selectedTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        if (!task.dueAt) return false;
        return getDateKey(new Date(task.dueAt)) === selectedDate;
      })
      .sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt));
  }, [tasks, selectedDate]);

  const weekTasks = useMemo(() => {
    const start = weekDates[0];
    const end = new Date(weekDates[6]);
    end.setHours(23, 59, 59, 999);

    return tasks.filter((task) => {
      const date = new Date(task.dueAt);
      return date >= start && date <= end;
    });
  }, [tasks, weekDates]);

  const completed = weekTasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const pending = weekTasks.length - completed;

  const progress = weekTasks.length
    ? Math.round((completed / weekTasks.length) * 100)
    : 0;

  const weeklyGroups = useMemo(() => groupByWeek(tasks), [tasks]);

  const openTask = (task = null) => {
    setSelectedTask(task);
    setShowSheet(true);
  };

  const closeSheet = () => {
    setShowSheet(false);
    setSelectedTask(null);
  };

  const handleSave = async (form) => {
    if (selectedTask?._id) {
      await dispatch(
        editTask({
          id: selectedTask._id,
          task: form,
        })
      ).unwrap();
    } else {
      await dispatch(addTask(form)).unwrap();
    }

    setVersion((value) => value + 1);
    closeSheet();
  };

  const handleToggle = async (task) => {
    const status =
      task.status === "Completed" ? "In Progress" : "Completed";

    try {
      await dispatch(
        editTask({
          id: task._id,
          task: { status },
        })
      ).unwrap();

      setVersion((value) => value + 1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (task) => {
    const confirmed = window.confirm(
      `Delete "${task.title}"?`
    );

    if (!confirmed) return;

    try {
      await dispatch(deleteTask(task._id)).unwrap();
      setVersion((value) => value + 1);
      closeSheet();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f6fa] sm:flex sm:justify-center">
      <div className="relative min-h-screen w-full max-w-[430px] bg-white px-5 pb-28 pt-7 shadow-xl">

       
        {/* Search bar */}
        <button
          onClick={() => setShowSearch(true)}
          className="mb-6 flex h-12 w-full items-center justify-between rounded-lg border border-gray-200 px-4 text-left text-sm text-gray-400"
        >
          <span>Search for a task</span>
          <SearchIcon />
        </button>

        {/* Week dates */}
        <div className="mb-6 grid grid-cols-7 gap-1">
          {weekDates.map((date) => {
            const key = getDateKey(date);
            const active = selectedDate === key;

            return (
              <button
                key={key}
                onClick={() => setSelectedDate(key)}
                className={`flex flex-col items-center gap-1 rounded-lg py-2 ${
                  active
                    ? "bg-[#405de6] text-white shadow-md"
                    : "text-gray-400 hover:bg-gray-50"
                }`}
              >
                <span className="text-[10px]">
                  {date.toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </span>

                <span className="text-sm font-semibold">
                  {date.getDate()}
                </span>

                {active && (
                  <span className="h-1 w-1 rounded-full bg-white" />
                )}
              </button>
            );
          })}
        </div>

        {/* Summary cards */}
        <div className="mb-7 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-[#eef0ff] p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
              <span className="grid h-6 w-6 place-items-center rounded bg-[#d8ddff] text-[#405de6]">
                <CheckIcon />
              </span>
              Task Complete
            </div>

            <div className="mt-2 flex items-end gap-2">
              <span className="text-2xl font-bold text-[#171923]">
                {completed}
              </span>
              <span className="pb-1 text-[10px] text-gray-400">
                This Week
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-[#ffe9e9] p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
              <span className="grid h-6 w-6 place-items-center rounded bg-[#ffd4d4] text-red-500">
                <CloseIcon />
              </span>
              Task Pending
            </div>

            <div className="mt-2 flex items-end gap-2">
              <span className="text-2xl font-bold text-[#171923]">
                {pending}
              </span>
              <span className="pb-1 text-[10px] text-gray-400">
                This Week
              </span>
            </div>
          </div>
        </div>

        {/* Weekly progress */}
        <section className="mb-7">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-[#171923]">
              Weekly Progress
            </h2>
            <span className="text-xs font-semibold text-[#405de6]">
              {progress}%
            </span>
          </div>

          <div className="h-4 overflow-hidden rounded-sm bg-[#dedfff]">
            <div
              className="h-full bg-[#293f9f] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>

        {/* Tasks */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-[#171923]">
              Tasks Today
            </h2>

            <button
              onClick={() => setShowAllWeeks((value) => !value)}
              className="text-xs cursor-pointer font-medium text-[#405de6]"
            >
              {showAllWeeks ? "Hide Weeks" : "View All"}
            </button>
          </div>

          {loading && tasks.length === 0 && (
            <p className="py-8 text-center text-sm text-gray-400">
              Loading tasks...
            </p>
          )}

          {error && (
            <p className="py-3 text-sm text-red-500">{error}</p>
          )}

          {!loading && selectedTasks.length === 0 && (
            <div className="rounded-xl bg-gray-50 px-4 py-8 text-center">
              <p className="font-medium text-gray-600">
                No tasks for this day
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Tap + to create a new task
              </p>
            </div>
          )}

          <ul className="divide-y divide-gray-100">
            {selectedTasks.map((task) => (
              <TaskRow
                key={task._id}
                task={task}
                onToggle={handleToggle}
                onOpen={openTask}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        </section>

        {/* Weekly task groups */}
        {showAllWeeks && (
          <section className="mt-8 space-y-3">
            <h2 className="font-bold text-[#171923]">
              All Weekly Tasks
            </h2>

            {weeklyGroups.map((group) => (
              <WeekCard
                key={group.key}
                group={group}
                expanded={true}
                onExpand={() => {}}
                onToggle={handleToggle}
                onOpen={openTask}
                onDelete={handleDelete}
              />
            ))}
          </section>
        )}

        {/* Floating Add Button */}
        <button
          onClick={() => openTask()}
          className="fixed bottom-7 left-1/2 z-10 grid h-14 w-14 -translate-x-1/2 place-items-center rounded-full bg-[#405de6] text-white shadow-lg shadow-blue-200 transition hover:scale-105"
          aria-label="Add new task"
        >
          <PlusIcon />
        </button>
      </div>

      {showSearch && (
        <SearchPanel
          version={version}
          onClose={() => setShowSearch(false)}
          onToggle={handleToggle}
          onOpen={openTask}
          onDelete={handleDelete}
        />
      )}

      {showSheet && (
        <TaskSheet
          task={selectedTask}
          onClose={closeSheet}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </main>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m7 7 10 10M17 7 7 17" />
    </svg>
  );
}
