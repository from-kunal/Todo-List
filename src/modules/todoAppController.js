import { createProject, projectFromJSON } from "./project.js";
import { createTodo } from "./todos.js";
import { storage } from "./webStorage.js";

export const INBOX_ID = "inbox";

const seedInbox = () => {
  const inbox = createProject("Inbox");
  inbox.id = INBOX_ID; // fixed id so UI/controller always find it
  storage.save([inbox]);
  return [inbox];
};

export const createTodoApp = () => {
  const loaded = storage.load();
  const projectsArray =
    loaded.length === 0 ? seedInbox() : loaded.map(projectFromJSON);

  return {
    getProjects: () => [...projectsArray],
    // later: createProject, addTodo, moveTodo, deleteTodo — each ending in storage.save(projectsArray)
    getProject: (projectId) => {
      return projectsArray.find((item) => {
        return item.id === projectId;
      });
    },

    createProject: (title, description = "") => {
      const project = createProject(title, description);
      projectsArray.push(project);
      storage.save(projectsArray);
      return project;
    },

    addTodo: (
      projectId,
      title,
      description = "",
      dueDate = null,
      priority = "noPriority",
    ) => {
      const project = projectsArray.find((item) => item.id === projectId);
      if (!project) return null;

      const todo = createTodo(title, description, dueDate, priority);
      project.addTodo(todo);
      storage.save(projectsArray);
      return todo;
    },

    moveTodo: (todoId, fromProjectId, toProjectId) => {
      const source = projectsArray.find((item) => item.id === fromProjectId);
      const destination = projectsArray.find((item) => item.id === toProjectId);
      if (!source || !destination || source === destination) return false;

      const realIndex = source.todos.findIndex((item) => item.id === todoId);
      if (realIndex === -1) return false;

      const [todo] = source.todos.splice(realIndex, 1);
      destination.todos.push(todo);
      storage.save(projectsArray);
      return true;
    },

    toggleTodo: (projectId, todoId) => {
      const project = projectsArray.find((item) => item.id === projectId);
      const todo = project.todos.find((item) => item.id === todoId);

      if (!todo) return;

      todo.toggleCompleteTodo();
      storage.save(projectsArray);
    },

    deleteTodo: (todoId, projectId) => {
      const project = projectsArray.find((item) => item.id === projectId);
      if (!project) return false;

      project.todos = project.todos.filter((t) => t.id !== todoId);
      storage.save(projectsArray);
    },
  };
};
