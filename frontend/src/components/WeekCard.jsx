import React from "react";
import { weekName, weekRange } from "../utils/week";
import TaskRow from "./TaskRow";

const WeekCard = ({
  group,
  expanded,
  onExpand,
  ...rowProps
}) => {
  const total = group.open + group.done;

  const percentage = total
    ? Math.round((group.done / total) * 100)
    : 0;

  return (
    <div className="rounded-3xl border border-line bg-white p-4 shadow-sm">

      {/* Week Header */}
      <button
        onClick={onExpand}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={expanded}
      >
        <div>
          <h2 className="text-lg font-bold">
            {weekName(group.start)}
          </h2>

          <p className="text-sm text-mute">
            {weekRange(group.start)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-sm">
            <p className="font-semibold text-brand">
              {group.open} open
            </p>

            <p className="font-semibold text-done">
              {group.done} done
            </p>
          </div>

          <svg
            viewBox="0 0 20 20"
            className={`h-5 w-5 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 8l5 5 5-5" />
          </svg>
        </div>
      </button>

      {/* Progress Bar */}
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-brand-soft">
        <div
          className="h-full rounded-full bg-done transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Task List */}
      {expanded && (
        <ul className="mt-4 space-y-2.5">
          {group.tasks.map((task) => (
            <TaskRow
              key={task._id}
              task={task}
              {...rowProps}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default WeekCard;