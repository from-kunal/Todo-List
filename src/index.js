import "./styles.css";
import plusIcon from "../assets/add_circle_69dp_FFFFFF_FILL0_wght700_GRAD200_opsz48.svg";
import inboxIcon from "../assets/inbox_32dp_FFFFFF_FILL0_wght700_GRAD200_opsz40.svg";
import deleteIcon from "../assets/delete_32dp_FFFFFF_FILL0_wght400_GRAD0_opsz40.svg";

import { createTodoApp, INBOX_ID } from "./modules/todoAppController.js";

document.querySelectorAll("img.plus-icon").forEach((img) => {
  img.src = plusIcon;
});

document.querySelectorAll("img.inbox-icon").forEach((img) => {
  img.src = inboxIcon;
});

const myTodoApp = createTodoApp();
console.log(myTodoApp.getProjects());
renderProjectList();
renderTodos(INBOX_ID);

// render add todos dialog box
// delegated on #app-container so the per-project "Add task" button in <main> is caught too
document.querySelector("#app-container").addEventListener("click", (event) => {
  const btn = event.target.closest("[data-action]");
  if (!btn) return;

  let currentProjectId = "inbox";
  let pendingProjectId = "inbox";

  switch (btn.dataset.action) {
    case "add-todo":
      pendingProjectId = btn.dataset.projectId ?? currentProjectId;
      document.querySelector("#add-todo-form").reset();
      document.querySelector("#add-todo-dialog").showModal();

      // with method="dialog" browser closes dialog box with form automatically
      const todoFrom = document.querySelector("#add-todo-form");

      todoFrom.addEventListener("submit", () => {
        const data = new FormData(todoFrom);

        myTodoApp.addTodo(
          pendingProjectId,
          data.get("title").trim(),
          data.get("description").trim(),
          data.get("dueDate") || null,
          data.get("todo-priority"),
        );

        renderTodos(pendingProjectId); // repaint so the new todo appears
      });

      const cancelAddTask = document.querySelector("#cancel-add-task");
      cancelAddTask.addEventListener("click", () => {
        document.querySelector("#add-todo-dialog").close();
      });

      break;

    case "select-project":
      renderTodos(btn.dataset.projectId);
      break;

    case "add-project":
      document.querySelector("#add-project-form").reset();
      document.querySelector("#add-project-dialog").showModal();

      const projectForm = document.querySelector("#add-project-form");

      projectForm.addEventListener("submit", () => {
        const projectData = new FormData(projectForm);

        myTodoApp.createProject(
          projectData.get("project-title-name"),
          projectData.get("project-descriptions"),
        );

        renderProjectList();
      });

      document
        .querySelector("#cancel-new-project")
        .addEventListener("click", () => {
          document.querySelector("#add-project-dialog").close();
        });

      break;

    case "delete-todo":
      myTodoApp.deleteTodo(btn.dataset.todoId, btn.dataset.projectId);
      renderTodos(btn.dataset.projectId);
      break;
  }
});

function renderProjectList() {
  const projectList = document.querySelector("#projects-list-each");
  projectList.replaceChildren(); // clear old projects first

  myTodoApp.getProjects().forEach((project) => {
    if (project.id === INBOX_ID) return; // doesn't prints inbox in sidebar

    const li = document.createElement("li");
    const btn = document.createElement("button");

    btn.type = "button";
    btn.className = "project-button clickable-button";
    btn.dataset.action = "select-project";
    btn.dataset.projectId = project.id;
    btn.textContent = project.title;

    li.append(btn);
    projectList.append(li);
  });
}

function renderTodos(projectId) {
  const currentProjectHeader = document.querySelector(
    ".current-project-header",
  );

  const currentProject = myTodoApp.getProject(projectId);
  currentProjectHeader.textContent = currentProject.title;

  const todoSection = document.querySelector(".todo-section");
  todoSection.replaceChildren(); // clear old rows so they don't stack up

  currentProject.todos.forEach((todo) => {
    const li = document.createElement("li");
    li.textContent = todo.title;

    const delBtn = document.createElement("button");

    delBtn.type = "button";
    delBtn.className = "delete-button clickable-button";
    delBtn.dataset.action = "delete-todo";
    delBtn.dataset.todoId = todo.id;
    delBtn.dataset.projectId = projectId;

    const delIcon = document.createElement("img");
    delIcon.className = "delete-icon";
    delIcon.alt = "delete";
    delIcon.src = deleteIcon; // imported at the top

    delBtn.append(delIcon);
    li.append(delBtn);
    todoSection.append(li);
  });

  const addLi = document.createElement("li");
  const addBtn = document.createElement("button");

  addBtn.type = "button";
  addBtn.className = "add-task-button clickable-button";
  addBtn.dataset.action = "add-todo";
  addBtn.dataset.projectId = projectId;

  const icon = document.createElement("img");
  icon.className = "plus-icon";
  icon.alt = "";
  icon.src = plusIcon; // set here: the startup icon pass won't reach it

  const label = document.createElement("span");
  label.textContent = "Add task";

  addBtn.append(icon, label);
  addLi.append(addBtn);
  todoSection.append(addLi);
}
