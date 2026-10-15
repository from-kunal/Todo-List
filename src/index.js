import { createTodoApp } from "./modules/todoAppController.js";

const myTodoApp = createTodoApp();
console.log(myTodoApp.getProjects());
myTodoApp.createProject("heroToZero");

myTodoApp.addTodo("heroToZero", "save 5 people", "", "", "very high");
