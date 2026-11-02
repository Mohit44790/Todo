const DAY = 86400000;

export function startOfWeek(input) {
  const date = new Date(input);

  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));

  return date;
}

const md = (date) =>
  date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

export function weekRange(start) {
  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  return `${md(start)} – ${md(end)}`;
}

export function weekName(start) {
  const diff = Math.round(
    (start - startOfWeek(new Date())) / (7 * DAY)
  );

  if (diff === 0) return "This week";
  if (diff === 1) return "Next week";
  if (diff === -1) return "Last week";

  return diff > 0 ? `In ${diff} weeks` : `${-diff} weeks ago`;
}

export function groupByWeek(tasks) {
  const map = new Map();

  tasks.forEach((task) => {
    const start = startOfWeek(task.dueAt);
    const key = start.getTime();

    if (!map.has(key)) {
      map.set(key, {
        key,
        start,
        tasks: [],
        open: 0,
        done: 0,
      });
    }

    const group = map.get(key);

    group.tasks.push(task);

    if (task.status === "Completed") {
      group.done++;
    } else {
      group.open++;
    }
  });

  const currentWeek = startOfWeek(new Date()).getTime();
  const groups = [...map.values()];

  groups.forEach((group) => {
    group.tasks.sort(
      (a, b) => new Date(a.dueAt) - new Date(b.dueAt)
    );
  });

  const upcoming = groups
    .filter((group) => group.key >= currentWeek)
    .sort((a, b) => a.key - b.key);

  const past = groups
    .filter((group) => group.key < currentWeek)
    .sort((a, b) => b.key - a.key);

  return [...upcoming, ...past];
}

export const formatWhen = (iso) =>
  new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export function toLocalInput(iso) {
  const date = iso ? new Date(iso) : new Date();

  const pad = (n) => String(n).padStart(2, "0");

  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1
  )}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}