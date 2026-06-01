// Select DOM elements
const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("todo-list");

// Try to load saved todo from localStorage (if any)
const saved = localStorage.getItem("todos");
const todos = saved ? JSON.parse(saved) : [];

function saveTodos() {
  // save current todos array to localStorage
  localStorage.setItem("todos", JSON.stringify(todos));
}

// create a DOM node for a todo object and append it to list
function createTodoNode(todo, index) {
  const li = document.createElement("item");
  li.classList.add("li-edit");

  // checkbox to toggle completion
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = !!todo.completed;
  checkbox.addEventListener("change", () => {
    todo.completed = checkbox.checked;

    // visual feedback: strike through when completed
    textSpan.style.textDecoration = todo.completed ? "line-through" : "";
    textSpan.style.color = todo.completed
      ? "rgba(255, 255, 255, 0.57)"
      : "black";
    saveTodos();
  });

  // Text of TODO
  const textSpan = document.createElement("span");
  textSpan.textContent = todo.text;
  textSpan.style.margin = "0 8px";
  if (todo.completed) {
    textSpan.style.textDecoration = "line-through";
    textSpan.style.color = "grey";
  }

  // add double click event listener to edit todo
  textSpan.addEventListener("dblclick", enableEdit);

  // Delete Todo Button
  const delBtn = document.createElement("button");
  // Delete Image
  const delImg = document.createElement("img");
  delImg.src = "./assets/delete.svg";
  delImg.alt = "Delete";
  delImg.width = 20;
  delImg.height = 20;
  delBtn.classList.add("delete-btn");
  delBtn.appendChild(delImg);
  delBtn.addEventListener("click", () => {
    todos.splice(index, 1);
    render();
    saveTodos();
  });

  // edit todo button
  const editBtn = document.createElement("button");
  // Edit Image
  const editImg = document.createElement("img");
  editImg.src = "./assets/edit.png";
  editImg.alt = "Edit";
  editImg.width = 20;
  editImg.height = 20;
  editBtn.classList.add("edit-btn");
  editBtn.appendChild(editImg);
  editBtn.addEventListener("click", enableEdit);

  // Button group - edit and delete
  const btnGrp = document.createElement("div");
  btnGrp.classList.add("btnGrp-buttons");
  btnGrp.appendChild(editBtn);
  btnGrp.appendChild(delBtn);

  // each element in single line -- seperate list
  const sepList = document.createElement("div");
  sepList.classList.add("sep-list");
  sepList.appendChild(checkbox);
  sepList.appendChild(textSpan);
  sepList.appendChild(btnGrp);

  function enableEdit() {
    const inp = document.createElement("input");
    inp.type = "text";
    inp.value = todo.text;
    inp.classList.add("edit-input");

    li.replaceChild(inp, textSpan);
    inp.focus();

    function saveEdit() {
      const newText = inp.value.trim();
      if (newText === "") {
        todos.splice(index, 1);
      } else {
        todo.text = newText;
      }
      saveTodos();
      render();
    }
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        saveEdit();
      }
    });
    inp.addEventListener("blur", saveEdit);
  }
  li.appendChild(checkbox);
  li.appendChild(textSpan);
  li.appendChild(btnGrp);
  li.appendChild(sepList);
  return li;
}

// Render the whole todo list from todos array
function render() {
  list.innerHTML = "";
  // recreate each item
  todos.forEach((todo, index) => {
    const node = createTodoNode(todo, index);
    list.appendChild(node);
  });
}

function addTodo() {
  const text = input.value.trim();
  if (!text) {
    return;
  }

  // push a new todo object
  todos.push({ text, completed: false });
  input.value = "";
  render();
  saveTodos();
}

addBtn.addEventListener("click", addTodo);
// Enter key support
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTodo();
  }
});
render();
