const API = "/api/tasks";
let currentFilter = "all";
let tasks = [];

const taskList = document.getElementById("taskList");
const emptyMsg = document.getElementById("emptyMsg");
const errorMsg = document.getElementById("errorMsg");

async function fetchTasks() {
  const res = await fetch(API);
  tasks = await res.json();
  render();
}

async function addTask() {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const priority = document.getElementById("priority").value;
  const due_date = document.getElementById("due_date").value;

  errorMsg.textContent = "";

  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, priority, due_date }),
  });

  if (!res.ok) {
    const err = await res.json();
    errorMsg.textContent = err.error || "Could not add task.";
    return;
  }

  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("due_date").value = "";
  fetchTasks();
}

async function updateStatus(id, status) {
  await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  fetchTasks();
}

async function deleteTask(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  fetchTasks();
}

function render() {
  taskList.innerHTML = "";
  const filtered =
    currentFilter === "all" ? tasks : tasks.filter((t) => t.status === currentFilter);

  emptyMsg.hidden = filtered.length !== 0;

  filtered.forEach((task) => {
    const li = document.createElement("li");
    li.className = `task-item ${task.status === "done" ? "done" : ""}`;

    li.innerHTML = `
      <div class="task-main">
        <p class="task-title">${escapeHtml(task.title)}</p>
        ${task.description ? `<p class="task-desc">${escapeHtml(task.description)}</p>` : ""}
        <div class="badges">
          <span class="badge priority-${task.priority}">${task.priority}</span>
          ${task.due_date ? `<span class="badge">Due ${task.due_date}</span>` : ""}
        </div>
      </div>
      <div class="task-actions">
        <select data-id="${task.id}" class="statusSelect">
          <option value="pending" ${task.status === "pending" ? "selected" : ""}>Pending</option>
          <option value="in_progress" ${task.status === "in_progress" ? "selected" : ""}>In progress</option>
          <option value="done" ${task.status === "done" ? "selected" : ""}>Done</option>
        </select>
        <button class="delete" data-id="${task.id}">Delete</button>
      </div>
    `;
    taskList.appendChild(li);
  });

  document.querySelectorAll(".statusSelect").forEach((sel) => {
    sel.addEventListener("change", (e) => updateStatus(e.target.dataset.id, e.target.value));
  });
  document.querySelectorAll(".delete").forEach((btn) => {
    btn.addEventListener("click", (e) => deleteTask(e.target.dataset.id));
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

document.getElementById("addBtn").addEventListener("click", addTask);

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });
});

fetchTasks();
