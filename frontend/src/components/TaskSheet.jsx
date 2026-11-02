
import { useRef, useState } from "react";

const PRIORITIES = ["Low", "Medium", "High"];

const getDate = (value) => {
  if (!value) return "";

  const date = new Date(value);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getTime = (value) => {
  if (!value) return "";

  const date = new Date(value);

  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`;
};

const formatDate = (value) => {
  if (!value) return "Select Date";

  const date = new Date(`${value}T12:00:00`);

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};

export default function TaskSheet({
  task,
  onClose,
  onSave,
  onDelete,
}) {
  const editing = Boolean(task?._id);
  const dateInputRef = useRef(null);

  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    date: getDate(task?.dueAt),
    startTime: getTime(task?.startAt || task?.dueAt),
    endTime: getTime(task?.endAt),
    priority: task?.priority || "Medium",
    status: task?.status || "In Progress",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("Please enter task title.");
      return;
    }

    if (!form.date || !form.startTime || !form.endTime) {
      setError("Please select date, start time and end time.");
      return;
    }

    const start = new Date(`${form.date}T${form.startTime}`);
    const end = new Date(`${form.date}T${form.endTime}`);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime())
    ) {
      setError("Please select a valid date and time.");
      return;
    }

    if (end <= start) {
      setError("End time must be after start time.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await onSave({
        title: form.title.trim(),
        description: form.description.trim(),
        dueAt: start.toISOString(),
        startAt: start.toISOString(),
        endAt: end.toISOString(),
        priority: form.priority,
        status: form.status,
      });
    } catch (err) {
      setError(err.message || "Unable to save task.");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 sm:items-center sm:p-4">

      <form
        onSubmit={submit}
        className="flex max-h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden rounded-t-2xl bg-white px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-3 shadow-2xl sm:max-h-[min(650px,95dvh)] sm:rounded-2xl sm:px-5"
      >
        {/* Header */}
        <div className="mb-4 flex shrink-0 items-center justify-between">
          <h2 className="text-base font-semibold text-[#171923]">
            {editing ? "Edit Task" : "Add New Task"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-xl cursor-pointer leading-none text-gray-700"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="flex min-h-0 flex-col gap-3">

          {/* Task Title */}
          <label className="block">
            <span className="mb-1.5 block text-[11px] text-gray-500">
              Task title
            </span>

            <input
              autoFocus
              type="text"
              maxLength={120}
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Enter task title"
              className="h-9 w-full border border-gray-200 px-2.5 text-xs outline-none focus:border-[#4563ed]"
            />
          </label>

          {/* Start and End Time */}
          <div>
            <span className="mb-1.5 block text-[11px] text-gray-500">
              Set Time
            </span>

            <div className="grid grid-cols-2 gap-2.5">

              <label className="flex h-9 min-w-0 items-center gap-2 border border-gray-200 px-2">
                <ClockIcon />

                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) =>
                    updateField("startTime", e.target.value)
                  }
                  className="w-full min-w-0 bg-transparent text-[11px] outline-none"
                  aria-label="Start time"
                />
              </label>

              <label className="flex h-9 min-w-0 items-center cursor-pointer gap-2 border border-gray-200 px-2">
                <ClockIcon />

                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) =>
                    updateField("endTime", e.target.value)
                  }
                  className="w-full min-w-0  bg-transparent text-[11px] outline-none"
                  aria-label="End time"
                />
              </label>

            </div>
          </div>

          {/* Date */}
          <div>
            <span className="mb-1.5 block text-[11px] text-gray-500">
              Set Date
            </span>

            <div className="relative flex h-9 items-center border border-gray-200 px-2.5 focus-within:border-[#4563ed]">

              <span className="flex-1 truncate text-xs text-gray-800">
                {formatDate(form.date)}
              </span>

              <CalendarIcon />

              <input
                ref={dateInputRef}
                type="date"
                value={form.date}
                onChange={(e) => updateField("date", e.target.value)}
                aria-label="Select task date"
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </div>
          </div>

          {/* Description */}
          <label className="block">
            <span className="mb-1.5 block text-[11px] text-gray-500">
              Description
            </span>

            <textarea
              rows={3}
              maxLength={1000}
              value={form.description}
              onChange={(e) =>
                updateField("description", e.target.value)
              }
              placeholder="Add Description"
              className="h-[72px] w-full resize-none border border-gray-200 p-2.5 text-xs outline-none focus:border-[#4563ed]"
            />
          </label>

          {/* Priority */}
          <label className="flex items-center justify-between gap-3">
            <span className="text-[11px] text-gray-500">
              Priority
            </span>

            <select
              value={form.priority}
              onChange={(e) =>
                updateField("priority", e.target.value)
              }
              className="h-8 min-w-0 border cursor-pointer border-gray-200 bg-white px-2 text-xs outline-none focus:border-[#4563ed]"
            >
              {PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </label>

          {/* Status */}
          {editing && (
            <label className="flex items-center justify-between gap-3">
              <span className="text-[11px] text-gray-500">
                Status
              </span>

              <select
                value={form.status}
                onChange={(e) =>
                  updateField("status", e.target.value)
                }
                className="h-8 min-w-0 border border-gray-200 bg-white px-2 text-xs outline-none"
              >
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </label>
          )}

        </div>

        {/* Error */}
        {error && (
          <p className="mt-2 text-xs text-red-500" role="alert">
            {error}
          </p>
        )}

        {/* Buttons */}
        <div className="mt-3 flex shrink-0 gap-2">

          {editing && (
            <button
              type="button"
              onClick={() => onDelete(task)}
              className="border border-red-200 px-4 py-2.5 text-xs text-red-500"
            >
              Delete
            </button>
          )}

          <button
            type="submit"
            disabled={saving}
            className="h-11 flex-1 bg-[#4563ed] cursor-pointer text-xs font-semibold text-white transition hover:bg-[#344fd1] disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : editing
                ? "Update Task"
                : "Create Task"}
          </button>

        </div>
      </form>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 shrink-0 text-gray-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="pointer-events-none h-4 w-4 shrink-0 text-gray-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M7 3v4M17 3v4M3 10h18" />
      <path d="M8 14h2v2H8zM14 14h2v2h-2z" />
    </svg>
  );
}
