const BASE = "http://localhost:5000/api";

async function request(path, options = {}) {
  const token = sessionStorage.getItem("token");

  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...options.headers,
    },
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

// Authentication
export const authAPI = {
  register: (user) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(user),
    }),

  login: (user) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(user),
    }),

  getMe: () => request("/auth/me"),
};

// Tasks
export const taskAPI = {
  getTasks: (query = "") =>
    request(`/tasks${query ? `?q=${encodeURIComponent(query)}` : ""}`),

  getTask: (id) =>
    request(`/tasks/${id}`),

  createTask: (task) =>
    request("/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    }),

  updateTask: (id, task) =>
    request(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(task),
    }),

  deleteTask: (id) =>
    request(`/tasks/${id}`, {
      method: "DELETE",
    }),
};