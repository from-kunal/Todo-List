export const addTodos = (state) => ({
  addTodo: (todo) => {
    state.todos.push(todo);
  },
});

export const readTodos = (state) => ({
  getTodos: () => [...state.todos],
});
