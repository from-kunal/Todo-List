export const createTodo = (
  title,
  description = "",
  dueDate = null,
  priority = "noPriority",
) => {
  const state = {
    title,
    id: crypto.randomUUID(), // fresh entity → fresh id, always
    description,
    dueDate,
    priority,
    completed: false,
  };

  return attachMethods(state);
};

// rehydration twin: keeps the saved id, defaults any missing fields
export const todoFromJSON = (plain) => {
  const state = {
    title: plain.title,
    id: plain.id, // use previous id
    description: plain.description ?? "",
    dueDate: plain.dueDate ?? null,
    priority: plain.priority ?? "noPriority",
    completed: plain.completed ?? false,
  };

  return attachMethods(state);
};

// shared: both paths reattach behavior the same way (JSON can't store functions)
const attachMethods = (state) => {
  return Object.assign(state, {
    toggleCompleteTodo: () => {
      state.completed = !state.completed;
    },
    isTodoComplete: () => state.completed,
  });
};
