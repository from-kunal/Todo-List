import "./styles.css";
import plusIcon from "../assets/add_circle_69dp_FFFFFF_FILL0_wght700_GRAD200_opsz48.svg";
import inboxIcon from "../assets/inbox_32dp_FFFFFF_FILL0_wght700_GRAD200_opsz40.svg";

import { createTodoApp } from "./modules/todoAppController.js";

document.querySelectorAll("img.plus-icon").forEach((img) => {
  img.src = plusIcon;
});

document.querySelectorAll("img.inbox-icon").forEach((img) => {
  img.src = inboxIcon;
});

const myTodoApp = createTodoApp();
console.log(myTodoApp.getProjects());
// myTodoApp.createProject("heroToZero");
//
// myTodoApp.addTodo("heroToZero", "save 5 people", "", "", "very high");

// render add todos dialog box
document.querySelector("#app-sidebar").addEventListener("click", (event) => {
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
      });

      document
        .querySelector("#cancel-add-task")
        .addEventListener("click", () => {
          document.querySelector("#add-todo-dialog").close();
        });

      break;
    case "select-project":

    case "add-project":
  }
});
