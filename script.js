const list = document.getElementById('todo-list')
const itemCountSpan = document.getElementById('item-count')
const uncheckedCountSpan = document.getElementById('unchecked-count')
const DB_URL = "https://lab-todo-list-default-rtdb.europe-west1.firebasedatabase.app/todos.json";
const loading = document.getElementById('loading');
const error = document.getElementById('error');

let todos =  [];
  
  
async function loadTodos() {

  loading.innerText = "Завантаження..."
  error.innerText = ""

  try {

    const response = await fetch(DB_URL);
    const data = await response.json();

    todos = [];

    if (data) {
      for (const id in data) {
        todos.push({
          id: id,
          text: data[id].text,
          checked: data[id].checked
        });
      }
    }

    render();
    updateCounter();

  } catch (err) {

    error.innerText = "Помилка завантаження";

  }

  loading.innerText = "";
}


async function addTodo(todo) {
  const response = await fetch(DB_URL, {
    method: 'POST',
    body: JSON.stringify(todo),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return await response.json();
}


  async function newTodo() {
  
    const text = prompt('Введіть нову справу')
  
    if (!text) return;

    const todo = { text: text, checked: false }; 

  
    const response = await fetch(DB_URL, {
    method: 'POST',
    body: JSON.stringify(todo),
    headers: { 'Content-Type': 'application/json' }
  });
  const result = await addTodo(todo);

  todos.push({
    id: result.name,
    text: text,
    checked: false
  });

  render();
  updateCounter();
}
  

  function renderTodo(todo) {
  
    let checkedAttribute = ''
    let textClass = ''
  
    if (todo.checked) {
      checkedAttribute = 'checked'
      textClass = 'text-success text-decoration-line-through'
    }
  
    return `
      <li class="list-group-item">
  
        <input
          type="checkbox"
          class="form-check-input me-2"
          id="${todo.id}"
          ${checkedAttribute}
          onchange="checkTodo('${todo.id}')"
        >
  
        <label for="${todo.id}">
          <span class="${textClass}">
            ${todo.text}
          </span>
        </label>
  
        <button
          class="btn btn-danger btn-sm float-end"
          onclick="deleteTodo('${todo.id}')"
        >
          delete
        </button>
  
      </li>
    `
  }
  

  function render() {
  
    let html = ''
  
    for (let i = 0; i < todos.length; i++) {
      html = html + renderTodo(todos[i])
    }
  
    list.innerHTML = html
  }
  

  function updateCounter() {
  
    itemCountSpan.innerText = todos.length
  
    let uncheckedCount = 0
  
    for (let i = 0; i < todos.length; i++) {
  
      if (todos[i].checked === false) {
        uncheckedCount++
      }
  
    }
  
    uncheckedCountSpan.innerText = uncheckedCount
  }
  

  async function deleteTodo(id) {
    await fetch(
      `https://lab-todo-list-default-rtdb.europe-west1.firebasedatabase.app/todos/${id}.json`,
    {
      method: "DELETE"
    }
    );
  
    let newTodos = []
  
    for (let i = 0; i < todos.length; i++) {
  
      if (todos[i].id !== id) {
        newTodos.push(todos[i])
      }
  
    }
  
    todos = newTodos
  
    render()
    updateCounter()
  }
  

  async function checkTodo(id) {
  
    for (let i = 0; i < todos.length; i++) {
  
      if (todos[i].id === id) {
        todos[i].checked = !todos[i].checked


        await fetch(
          `https://lab-todo-list-default-rtdb.europe-west1.firebasedatabase.app/todos/${id}.json`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              checked: todos[i].checked
            })
          }
        );
      }
  
    }
  
    render()
    updateCounter()
  }
  
  loadTodos();
