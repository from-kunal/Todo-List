import { addTodos, readTodos } from "./behavoiour.js";
import { todoFromJSON } from "./todos.js";

export const createProject = (title, description = "") => {
  const state = {
    title,
    description,
    id: crypto.randomUUID(),
    todos: [],
  };

  return attachMethods(state);
};

export const projectFromJSON = (plain) => {
  const state = {
    title: plain.title,
    description: plain.description ?? "",
    id: plain.id, // keep saved id
    todos: (plain.todos ?? []).map(todoFromJSON), // revive nested todos
  };

  return attachMethods(state);
};

const attachMethods = (state) => {
  return Object.assign(state, addTodos(state), readTodos(state));
};
