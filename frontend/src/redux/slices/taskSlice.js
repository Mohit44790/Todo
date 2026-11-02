import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { taskAPI } from "../config/api";

// Handle different API response formats
const getTasksArray = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.tasks)) return response.tasks;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.tasks)) return response.data.tasks;

  return [];
};

const getTaskObject = (response) => {
  return response?.task || response?.data?.task || response?.data || response;
};

// Fetch all tasks
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await taskAPI.getTasks();
      return getTasksArray(response);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Search tasks
export const searchTasks = createAsyncThunk(
  "tasks/searchTasks",
  async (query, { rejectWithValue }) => {
    try {
      const response = await taskAPI.getTasks(query);
      return getTasksArray(response);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add task
export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (task, { rejectWithValue }) => {
    try {
      const response = await taskAPI.createTask(task);
      return getTaskObject(response);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update task
export const editTask = createAsyncThunk(
  "tasks/editTask",
  async ({ id, task }, { rejectWithValue }) => {
    try {
      const response = await taskAPI.updateTask(id, task);
      return getTaskObject(response);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete task
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id, { rejectWithValue }) => {
    try {
      await taskAPI.deleteTask(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  tasks: [],
  searchResults: [],
  loading: false,
  searchLoading: false,
  error: null,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,

  reducers: {
    clearSearch: (state) => {
      state.searchResults = [];
      state.searchLoading = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    clearTasks: (state) => {
      state.tasks = [];
      state.searchResults = [];
    },
  },

  extraReducers: (builder) => {
    builder

      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search tasks
      .addCase(searchTasks.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchTasks.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchTasks.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchResults = [];
      })

      // Add task
      .addCase(addTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload?._id) {
          state.tasks.push(action.payload);
        }
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update task
      .addCase(editTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editTask.fulfilled, (state, action) => {
        state.loading = false;

        const updatedTask = action.payload;

        if (!updatedTask?._id) return;

        const index = state.tasks.findIndex(
          (task) => task._id === updatedTask._id
        );

        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }

        const searchIndex = state.searchResults.findIndex(
          (task) => task._id === updatedTask._id
        );

        if (searchIndex !== -1) {
          state.searchResults[searchIndex] = updatedTask;
        }
      })
      .addCase(editTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;

        state.tasks = state.tasks.filter(
          (task) => task._id !== action.payload
        );

        state.searchResults = state.searchResults.filter(
          (task) => task._id !== action.payload
        );
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearSearch,
  clearError,
  clearTasks,
} = taskSlice.actions;

export default taskSlice.reducer;