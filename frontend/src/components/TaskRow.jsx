
import { useRef, useState } from "react";

const PRIORITY = {
  High: "text-red-500",
  Medium: "text-amber-600",
  Low: "text-blue-600",
};

export default function TaskRow({
  task,
  onToggle,
  onOpen,
  onDelete,
}) {
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);

  const drag = useRef(null);
  const moved = useRef(false);

  const done = task.status === "Completed";

  const down = (e) => {
    drag.current = {
      x: e.clientX,
      base: dx,
      captured: false,
    };
    moved.current = false;
  };

  const move = (e) => {
    if (!drag.current) return;

    const delta = e.clientX - drag.current.x;

    if (Math.abs(delta) > 6) {
      moved.current = true;

      if (!drag.current.captured) {
        e.currentTarget.setPointerCapture(e.pointerId);
        drag.current.captured = true;
        setDragging(true);
      }
    }

    if (drag.current.captured) {
      setDx(Math.max(-88, Math.min(0, drag.current.base + delta)));
    }
  };

  const up = () => {
    if (!drag.current) return;

    drag.current = null;
    setDragging(false);
    setDx((value) => (value < -44 ? -88 : 0));
  };
  

  return (
    <li className="relative overflow-hidden border-b border-gray-100 bg-red-500">
      <button
        onClick={() => onDelete(task)}
        className="absolute inset-y-0 right-0 w-[88px] text-sm font-semibold text-white"
      >
        Delete
      </button>

      <div
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        style={{
          transform: `translateX(${dx}px)`,
          touchAction: "pan-y",
        }}
        className={`relative flex min-h-[68px] items-center gap-3 bg-white py-3 ${
          dragging ? "" : "transition-transform duration-200"
        }`}
      >
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task)}
          aria-label="Toggle task status"
          className={`grid h-[18px] w-[18px] shrink-0 place-items-center border ${
            done
              ? "border-[#405de6] bg-[#405de6] text-white"
              : "border-[#8ca0ff] bg-white"
          }`}
        >
          {done && (
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m3 10 4 4 10-10" />
            </svg>
          )}
        </button>

        {/* Task details */}
        <div
          className="min-w-0 flex-1 cursor-pointer"
          onClick={() => {
            if (moved.current || dx !== 0) {
              setDx(0);
              return;
            }
            onOpen(task);
          }}
        >
          <p
  className={`truncate text-sm font-normal ${
    done
      ? "text-gray-700 line-through"
      : "text-[#171923] no-underline"
  }`}
>
  {task.title}
</p>

          {/* {task.description && (
            <p className="mt-1 truncate text-xs text-gray-400">
              {task.description}
            </p>
          )} */}

          <div className="mt-1 flex gap-2 text-[11px] text-gray-400">
            <span>
              {new Date(task.dueAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className={PRIORITY[task.priority] || ""}>
              {task.priority}
            </span>
          </div>
        </div>

        {/* Edit and Delete */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => onDelete(task)}
            className="p-1.5 text-gray-400 cursor-pointer hover:text-red-500"
            aria-label="Delete task"
          >
            <TrashIcon />
          </button>

          <button
            onClick={() => onOpen(task)}
            className="p-1.5 text-gray-400 cursor-pointer hover:text-[#405de6]"
            aria-label="Edit task"
          >
            <EditIcon />
          </button>
        </div>
      </div>
    </li>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
  );
}
