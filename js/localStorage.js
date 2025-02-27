import "./script.js";
//get background
document.documentElement.style.setProperty("--hue", localStorage.getItem("bg"));
let theme_index = localStorage.getItem("theme_index") || 0;
$themes[theme_index].classList.add("active");

//get tasks
let all_tasks = getTasksFromLocalStorage();
all_tasks.forEach((element) => {
  const task_container = document.createElement("div");
  task_container.classList.add("task_container");
  task_container.id = Object.keys(element)[0];
  task_container.innerHTML = `
<span class="circle-icon"  data_parent_id="${task_container.id}" ></span>
<p>${element[task_container.id]}</p>
<div class="feature">
  <i class="fa-solid fa-pen edit"  data_parent_id="${task_container.id}"></i>
  <ion-icon
      name="trash-outline"
      aria-hidden="true"
      data_parent_id="${task_container.id}">
  </ion-icon>
</div>
`;
  if ($displayTasksFigure) {
    $displayTasksFigure.remove();
  }
  $displayTasks.appendChild(task_container);
});

function getTasksFromLocalStorage() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}
