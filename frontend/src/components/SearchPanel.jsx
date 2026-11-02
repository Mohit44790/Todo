
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  searchTasks,
  clearSearch,
} from "../redux/slices/taskSlice";

import TaskRow from "./TaskRow";

export default function SearchPanel({
  onClose,
  version,
  onToggle,
  onOpen,
  onDelete,
}) {
  const dispatch = useDispatch();

  const { searchResults = [], searchLoading } = useSelector(
    (state) => state.tasks
  );

  const [query, setQuery] = useState("");

  useEffect(() => {
    const term = query.trim();

    if (!term) {
      dispatch(clearSearch());
      return;
    }

    const timer = setTimeout(() => {
      dispatch(searchTasks(term));
    }, 300);

    return () => clearTimeout(timer);
  }, [query, version, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearSearch());
    };
  }, [dispatch]);

  return (
    <div className="fixed inset-0 z-30 flex justify-center bg-white">
      <div className="flex h-full w-full max-w-[430px] flex-col px-5 pt-7">

        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Search Tasks
          </h1>

          <button
            onClick={onClose}
            className="text-sm font-semibold text-[#405de6]"
          >
            Done
          </button>
        </header>

        <div className="flex h-12 items-center gap-3 border border-gray-200 px-3">
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or description"
            className="min-w-0 flex-1 text-sm outline-none"
          />

          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
          >
            <circle cx="10.8" cy="10.8" r="6.8" />
            <path d="m16 16 4 4" />
          </svg>
        </div>

        <div className="mt-5 flex-1 overflow-y-auto pb-8">
          {!query.trim() && (
            <p className="mt-10 text-center text-sm text-gray-400">
              Search your tasks by title or description.
            </p>
          )}

          {searchLoading && (
            <p className="mt-6 text-center text-sm text-gray-400">
              Searching...
            </p>
          )}

          {query.trim() &&
            !searchLoading &&
            searchResults.length === 0 && (
              <p className="mt-10 text-center text-sm text-gray-400">
                No tasks found.
              </p>
            )}

          <ul className="divide-y divide-gray-100">
            {searchResults.map((task) => (
              <TaskRow
                key={task._id}
                task={task}
                onToggle={onToggle}
                onOpen={onOpen}
                onDelete={onDelete}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
