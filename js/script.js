/*** selected elements ****/
let $data = document.querySelector(".date p");
let $themeIcon = document.querySelector(".theme_icon");
let $themeBox = document.querySelector(".themes_box");
let $infoIcone = document.querySelector(".themes_box .info");
let $infoUnit = document.querySelector(".info_unit");
let $infoUnitClose = document.querySelector(".info_unit button");
let $overlayout = document.querySelector(".overlayout");
let $themes = document.querySelectorAll(".themes span");
let $addField = document.querySelector(".add_task .add_field");
let $displayTasks = document.querySelector(".display_tasks");
let $displayTasksFigure = document.querySelector(".display_tasks figure");
let $inputTask = document.querySelector(".add_field [name='task']");
let $edit_task = document.querySelector(".edit_task");

/*** end selected elements ****/

/****** start options ********/
const hue = [227, 200, 177, 150, 133, 254];
const originalHTML = ` <ion-icon
                name="add-outline"
                class="add-icon"
                aria-hidden="true"
              ></ion-icon>
              <p>add a task</p>`;
const structureAddTask = `
            <ion-icon name="ellipse-outline" class="circle-icon" aria-hidden="true"></ion-icon>
            <input
                type="text"
                name="task"
                placeholder="Try typing 'Jogging 20min at morning'" autocomplete="off"
              />`;
let dataBase = getTasksFromLocalStorage();

//localStorage.clear();
/******end options***************** */

//to put current date
controleDate();

//for change background
controleBackground();

//add task
$addField.addEventListener("click", task);

//complete and delete
$displayTasks.addEventListener("click", handleTaskClick);

/*** show themes Box */
$themeIcon.addEventListener("click", function () {
  $themeIcon.classList.toggle("active");
  $themeBox.classList.toggle("active");
});

/*** show info Box */
if ($infoIcone !== null) {
  $infoIcone.addEventListener("click", function () {
    $infoUnit.classList.add("active");
    $overlayout.classList.add("active");
    $themeBox.classList.remove("active");
    $themeIcon.classList.remove("active");
  });
  $infoUnitClose.addEventListener("click", function () {
    $infoUnit.classList.remove("active");
    $overlayout.classList.remove("active");
  });
}

/** back the $addField  to original html **/
$addField.addEventListener(
  "blur",
  function (event) {
    if (
      event.target.tagName.toLowerCase() === "input" &&
      event.target.name === "task"
    ) {
      $addField.innerHTML = "";
      $addField.innerHTML = originalHTML;
    }
  },
  true
);

/** return display figure */
returnfigure();

/***** functions *****/

function controleDate() {
  let fullDate = new Date();
  let option = { weekday: "long", month: "short", day: "numeric" };

  //Intl.DateTimeFormat() => this Api to formate date , it take option to do that
  let today = Intl.DateTimeFormat("en-us", option).format(fullDate);
  $data.textContent = today;
}

function controleBackground() {
  //here i go on all spans and put the background
  $themes.forEach((element, index) => {
    element.style.cssText = `background-image: linear-gradient(to bottom, hsl(${hue[index]}, 40%, 50%), hsl(${hue[index]}, 40%, 60%));`;

    //if click above one choose it and store data in localstorage
    element.addEventListener("click", function () {
      $themes.forEach((e) => {
        e.classList.remove("active");
      });
      element.classList.add("active");
      document.documentElement.style.setProperty("--hue", hue[index]);
      localStorage.setItem("bg", `${hue[index]}`);
      localStorage.setItem("theme_index", `${index}`);
    });
  });
}

function task() {
  //if it click on $addField this mean i want to write a task so change the structure to new one to can write
  $addField.innerHTML = structureAddTask;
  $addField.lastChild.focus();
  $addField.lastChild.addEventListener("keydown", function (event) {
    addtask(event);
  });
}

function addtask(event) {
  if (event.key == "Enter") {
    //catch the task valve
    let $input_field = $addField.lastChild;
    let task = $input_field.value;
    $input_field.value = "";

    if (task == "") {
      return;
    }

    //prepare the task to show
    const task_container = document.createElement("div");
    task_container.classList.add("task_container");
    task_container.id = `task_${Date.now()}`;

    //store to database and localstorage
    dataBase.push({ [task_container.id]: task });
    addTasktoLocalStorage({ [task_container.id]: task });
    //task structure
    const structureTask = `
<span class="circle-icon"  data_parent_id="${task_container.id}" ></span>
<p>${task}</p>
<div class="feature">
  <i class="fa-solid fa-pen edit"  data_parent_id="${task_container.id}"></i>
  <ion-icon
      name="trash-outline"
      aria-hidden="true"
      data_parent_id="${task_container.id}">
  </ion-icon>
</div>`;
    task_container.innerHTML = structureTask;
    if ($displayTasksFigure) {
      $displayTasksFigure.remove();
    }
    $displayTasks.appendChild(task_container);
  }
}

function handleTaskClick(event) {
  //data
  const target = event.target;
  const parentDiv = document.querySelector(
    `#${target.getAttribute("data_parent_id")}`
  );

  if (!parentDiv) return;

  let task = parentDiv.children[1].textContent;
  let parent_id = target.getAttribute("data_parent_id");

  if (target.getAttribute("name") === "trash-outline") {
    parentDiv.remove();

    //to delete task from database and localstorage
    if (parent_id) {
      filterdatabase(parent_id);
    }
  } else if (target.classList.contains("circle-icon")) {
    //sound and active complete circle
    target.classList.add("active");
    const audio = new Audio("../sounds/task-complete.mp3");
    audio.play();

    //to delete task from database and localstorage
    if (parent_id) {
      filterdatabase(parent_id);
    }
    setTimeout(() => {
      parentDiv.remove();
    }, 300);
  } else if (target.classList.contains("edit")) {
    editTask(task, parentDiv, parent_id);
  }
}
function saveTasksToLocalStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function getTasksFromLocalStorage() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function addTasktoLocalStorage(taskDetails) {
  const dataBase = getTasksFromLocalStorage() || [];
  dataBase.push(taskDetails);
  saveTasksToLocalStorage(dataBase);
}

function filterdatabase(id) {
  //filter database to keep all tasks and remove the one he want to remove it
  dataBase = dataBase.filter((e) => {
    if (Object.keys(e)[0] !== id) {
      return e;
    }
  });
  saveTasksToLocalStorage(dataBase);
}

function returnfigure() {
  //type of mutation that i need to know it
  let config = {
    childList: true,
  };

  if (!$displayTasks || !$displayTasksFigure) {
    console.error("Elements are not defined properly.");
    return;
  }

  //function that i want to execute when something happen
  const callback = (mutationsList, observer) => {
    mutationsList.forEach((mutation) => {
      if (mutation.type === "childList") {
        if (
          $displayTasks.children.length == 0 &&
          !$displayTasks.contains($displayTasksFigure)
        ) {
          $displayTasks.appendChild($displayTasksFigure);
          observer.disconnect(); //stoping observe
        }
      }
    });
  };

  //new MutationObserver
  const observer = new MutationObserver(callback);

  //observe the element i want to observe it and send the config
  observer.observe($displayTasks, config);
}
function editTask(oldtask, parentDiv, parent_id) {
  // Show edit box and isolate everything else
  $edit_task.classList.add("active");
  $overlayout.classList.add("active");

  // Put original task in textarea
  let textarea = $edit_task.children[0];
  textarea.value = oldtask;

  // Apply changes
  let edit_ok = $edit_task.children[1];

  // Remove any previous event listener
  edit_ok.replaceWith(edit_ok.cloneNode(true)); // Remove all listeners
  edit_ok = $edit_task.children[1]; // Get the new button

  // Add the new event listener
  edit_ok.addEventListener("click", function () {
    handleEdit(textarea.value, parentDiv, parent_id);
  });
}

function handleEdit(new_value, parentDiv, parent_id) {
  // Edit in database to save change
  let newdataBase = dataBase.map((e) => {
    if (Object.keys(e)[0] !== parent_id) {
      return e;
    } else {
      return { [parent_id]: new_value };
    }
  });
  dataBase = newdataBase;
  saveTasksToLocalStorage(dataBase);

  // Update the task in the DOM
  parentDiv.children[1].textContent = new_value;

  // Hide edit box
  $edit_task.classList.remove("active");
  $overlayout.classList.remove("active");
}
