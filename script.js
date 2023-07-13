const taskInput = document.querySelector(".task-input input"),
  filters = document.querySelectorAll(".filters span"),
  clearAll = document.querySelector(".clear-btn"),
  taskBox = document.querySelector(".task-box"),
  addBtn = document.querySelector(".add-btn");


let editId,
  isEditTask = false,
  todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTodo();
  });
});

function showTodo() {
  let liTag = "";
  const activeFilter = document.querySelector(".filters span.active").id;
  if (todos) {
    todos.forEach((todo, id) => {
      let completed = todo.status === "completed" ? "checked" : "";
      let completedClass = todo.status === "completed" ? "completed" : "";
      if (activeFilter === "all" || activeFilter === todo.status) {
        liTag += `<li class="task">
                    <label for="${id}">
                      <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                      <p class="${completedClass}">${id + 1}. ${todo.name}</p>
                    </label>
                    <div class="settings">
                      <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                      <ul class="task-menu">
                        <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
                        <li onclick='deleteTask(${id}, "${todo.status}")'><i class="uil uil-trash"></i>Delete</li>
                        ${
                          todo.status === "completed"
                            ? `<li onclick='markPending(${id})'><i class="uil uil-square"></i>Mark Pending</li>`
                            : `<li onclick='markCompleted(${id})'><i class="uil uil-check-square"></i>Mark Completed</li>`
                        }
                      </ul>
                    </div>
                  </li>`;
      }
    });
  }
  taskBox.innerHTML = liTag || `<span>You don't have any tasks here</span>`;
  let checkTask = taskBox.querySelectorAll(".task");
  !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
  taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
}
showTodo();

function showMenu(selectedTask) {
  let menuDiv = selectedTask.parentElement.lastElementChild;
  menuDiv.classList.toggle("show");
  document.addEventListener("click", e => {
    if (e.target.tagName !== "I" || e.target !== selectedTask) {
      menuDiv.classList.remove("show");
    }
  });
}

function updateStatus(selectedTask) {
  let taskName = selectedTask.parentElement.lastElementChild;
  if (selectedTask.checked) {
    taskName.classList.add("completed");
    todos[selectedTask.id].status = "completed";
  } else {
    taskName.classList.remove("completed");
    todos[selectedTask.id].status = "pending";
  }
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo();
}

function editTask(taskId, textName) {
  editId = taskId;
  isEditTask = true;
  taskInput.value = textName;
  taskInput.focus();
  taskInput.classList.add("active");
}

function deleteTask(deleteId, filter) {
  isEditTask = false;
  todos.splice(deleteId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo();
}

function markCompleted(taskId) {
  todos[taskId].status = "completed";
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo();
}

function markPending(taskId) {
  todos[taskId].status = "pending";
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo();
}

clearAll.addEventListener("click", () => {
  isEditTask = false;
  todos.splice(0, todos.length);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo();
});

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keyup", e => {
  if (e.key === "Enter") {
    addTask();
  }
});

taskInput.addEventListener("keyup", e => {
  let userTask = taskInput.value.trim();
  if (e.key === "Enter" && userTask) {
    if (!isEditTask) {
      todos = !todos ? [] : todos;
      let taskInfo = { name: userTask, status: "pending" };
      todos.push(taskInfo);
    } else {
      isEditTask = false;
      todos[editId].name = userTask;
    }
    taskInput.value = "";
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo();
  }
});
function addTask() {
    let userTask = taskInput.value.trim();
    if (userTask) {
      if (!isEditTask) {
        todos = !todos ? [] : todos;
        let taskInfo = { name: userTask, status: "pending" };
        todos.push(taskInfo);
      } else {
        isEditTask = false;
        todos[editId].name = userTask;
      }
      taskInput.value = "";
      localStorage.setItem("todo-list", JSON.stringify(todos));
      showTodo();
    }
  }
