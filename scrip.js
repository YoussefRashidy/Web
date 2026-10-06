// For future update saving tasks locally
/*
Task structure
text : ......
state : ..... 
*/
let tasks = loadTasks();
let submitTask = document.querySelector("#task-in-but");
let taskInput = document.querySelector("#task-in");
let onGoingDiv = document.querySelector(".in-progress");
let completedTasks = document.querySelector(".completed");
let onGoingTasks = 0;
let initial_messages = document.querySelectorAll(".initial-message");
const messages = [
  "🎉 Great job!",
  "🔥 You’re on fire!",
  "💪 Keep crushing it!",
  "🌟 Amazing work!",
  "👏 Another one done!",
  "🚀 Productivity boost!",
  "✨ You’re unstoppable!",
];
function initialize() {
  submitTask.addEventListener("click", (e) => {
    let content = taskInput.value.trim();
    if (content.length == 0) return;
    taskInput.value = "";
    let newTask = document.createElement("div");
    newTask.classList.add("task-actions");

    let taskDiv = document.createElement("div");
    taskDiv.classList.add("task");

    let checkInput = document.createElement("input");
    checkInput.type = "checkbox";
    checkInput.classList.add("on-going-check");

    let taskContent = document.createElement("p");
    taskContent.classList.add("task-content");
    taskContent.textContent = content;

    taskDiv.appendChild(checkInput);
    taskDiv.appendChild(taskContent);

    addTask(taskContent);

    let actionsDiv = document.createElement("div");
    let actionButton = document.createElement("button");
    actionButton.classList.add("Delete");
    actionButton.textContent = "❌";
    actionsDiv.appendChild(actionButton);
    actionsDiv.classList.add("actions");
    newTask.appendChild(taskDiv);
    newTask.appendChild(actionsDiv);
    newTask.classList.add("pop");
    onGoingDiv.appendChild(newTask);
    onGoingTasks++;
    if (onGoingTasks > 0 && !initial_messages[0].classList.contains("hide"))
      initial_messages[0].classList.add("hide");
    actionButton.addEventListener("click", (e) => {
      newTask.remove();
      onGoingTasks--;
      if (onGoingTasks == 0) initial_messages[0].classList.remove("hide");
      removeTask(taskContent.dataset.id);
    });

    checkInput.addEventListener("click", (e) => {
      if (checkInput.checked) {
        newTask.remove();
        completedTasks.append(newTask);
        onGoingTasks--;
        if (onGoingTasks == 0) initial_messages[0].classList.remove("hide");
        initial_messages[1].classList.add("hide");
        taskContent.classList.add("completed-task-content");
        newTask.classList.add("completed-task");
        actionsDiv.classList.add("completed-actions");
        actionButton.classList.add("completed-Delete");
        changeState(taskContent.dataset.id);
        showMotivation();
      }
      if (!checkInput.checked) {
        newTask.remove();
        onGoingDiv.append(newTask);
        onGoingTasks++;
        if (onGoingTasks > 0 && !initial_messages[0].classList.contains("hide"))
          initial_messages[0].classList.add("hide");
        taskContent.classList.remove("completed-task-content");
        newTask.classList.remove("completed-task");
        actionsDiv.classList.remove("completed-actions");
        actionButton.classList.remove("completed-Delete");
        changeState(taskContent.dataset.id);
        completedTasksText();
      }
    });
  });
}

function showMotivation() {
  const motivation = document.getElementById("motivation");
  const randomMsg = messages[Math.floor(Math.random() * messages.length)];

  motivation.textContent = randomMsg;
  motivation.classList.remove("hide");

  setTimeout(() => {
    motivation.classList.add("show");
  }, 50);

  setTimeout(() => {
    motivation.classList.remove("show");
    setTimeout(() => motivation.classList.add("hide"), 400);
  }, 2000);
}

function safeBtoa(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function hashCodeGenerator(taskContent) {
  return safeBtoa(taskContent.textContent + Date.now());
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function loadTasks() {
  let tasks = localStorage.getItem("tasks");
  return tasks ? JSON.parse(tasks) : [];
}

function addTask(taskContent) {
  taskContent.dataset.id = hashCodeGenerator(taskContent);
  let obj = {
    hashCode: taskContent.dataset.id,
    text: taskContent.textContent,
    state: false,
  };
  tasks.push(obj);
  saveTasks(tasks);
}

function removeTask(taskCode) {
  tasks = tasks.filter((t) => t.hashCode !== taskCode);
  saveTasks(tasks);
}

function changeState(taskCode) {
  let target = tasks.find((t) => t.hashCode === taskCode);
  target.state = !target.state;
  saveTasks(tasks);
}

function renderTasks() {
  tasks.forEach((task) => {
    let newTask = document.createElement("div");
    newTask.classList.add("task-actions");

    let taskDiv = document.createElement("div");
    taskDiv.classList.add("task");

    let checkInput = document.createElement("input");
    checkInput.type = "checkbox";
    checkInput.classList.add("on-going-check");
    checkInput.checked = task.state;

    let taskContent = document.createElement("p");
    taskContent.classList.add("task-content");
    taskContent.textContent = task.text;
    taskContent.dataset.id = task.hashCode;

    taskDiv.appendChild(checkInput);
    taskDiv.appendChild(taskContent);

    let actionsDiv = document.createElement("div");
    let actionButton = document.createElement("button");
    actionButton.classList.add("Delete");
    actionButton.textContent = "❌";
    actionsDiv.appendChild(actionButton);
    actionsDiv.classList.add("actions");

    newTask.appendChild(taskDiv);
    newTask.appendChild(actionsDiv);

    if (task.state) {
      taskContent.classList.add("completed-task-content");
      newTask.classList.add("completed-task");
      actionsDiv.classList.add("completed-actions");
      actionButton.classList.add("completed-Delete");
      completedTasks.appendChild(newTask);
      initial_messages[1].classList.add("hide");
    } else {
      newTask.classList.add("pop");
      onGoingDiv.appendChild(newTask);
      onGoingTasks++;
    }

    actionButton.addEventListener("click", () => {
      newTask.remove();
      if (!task.state) {
        onGoingTasks--;
        if (onGoingTasks == 0) initial_messages[0].classList.remove("hide");
      }
      removeTask(task.hashCode);
      completedTasksText();
    });

    checkInput.addEventListener("click", () => {
      changeState(task.hashCode);
      if (checkInput.checked) {
        newTask.remove();
        completedTasks.append(newTask);
        onGoingTasks--;
        if (onGoingTasks == 0) initial_messages[0].classList.remove("hide");
        initial_messages[1].remove();
        taskContent.classList.add("completed-task-content");
        newTask.classList.add("completed-task");
        actionsDiv.classList.add("completed-actions");
        actionButton.classList.add("completed-Delete");
        showMotivation();
      }
      if (!checkInput.checked) {
        newTask.remove();
        onGoingDiv.append(newTask);
        onGoingTasks++;
        if (onGoingTasks > 0 && !initial_messages[0].classList.contains("hide"))
          initial_messages[0].classList.add("hide");
        taskContent.classList.remove("completed-task-content");
        newTask.classList.remove("completed-task");
        actionsDiv.classList.remove("completed-actions");
        actionButton.classList.remove("completed-Delete");
      }
      completedTasksText();
    });
  });

  if (onGoingTasks > 0 && !initial_messages[0].classList.contains("hide")) {
    initial_messages[0].classList.add("hide");
  }
}

function completedTasksText() {
  if (onGoingTasks == tasks.length)
    while (initial_messages[1].classList.contains("hide"))
      initial_messages[1].classList.remove("hide");
}

initialize();
loadTasks();
renderTasks();
