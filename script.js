const list = document.getElementById('todo-list')
const itemCountSpan = document.getElementById('item-count')
const uncheckedCountSpan = document.getElementById('unchecked-count')

let todos = JSON.parse(localStorage.getItem('todos')) || [
    {
      id: 1,
      text: 'Вивчити HTML',
      checked: true
    },
    {
      id: 2,
      text: 'Вивчити CSS',
      checked: true
    },
    {
      id: 3,
      text: 'Вивчити JavaScript',
      checked: false
    }
  ]
  

  function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos))
  }
  

  function newTodo() {
  
    const text = prompt('Введіть нову справу')
  
    if (text === null || text === '') {
      return
    }
  
    const todo = {
      id: Date.now(),
      text: text,
      checked: false
    }
  
    todos.push(todo)
  
    saveTodos()
    render()
    updateCounter()
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
          onchange="checkTodo(${todo.id})"
        >
  
        <label for="${todo.id}">
          <span class="${textClass}">
            ${todo.text}
          </span>
        </label>
  
        <button
          class="btn btn-danger btn-sm float-end"
          onclick="deleteTodo(${todo.id})"
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
  

  function deleteTodo(id) {
  
    let newTodos = []
  
    for (let i = 0; i < todos.length; i++) {
  
      if (todos[i].id !== id) {
        newTodos.push(todos[i])
      }
  
    }
  
    todos = newTodos
  
    saveTodos()
    render()
    updateCounter()
  }
  

  function checkTodo(id) {
  
    for (let i = 0; i < todos.length; i++) {
  
      if (todos[i].id === id) {
        todos[i].checked = !todos[i].checked
      }
  
    }
  
    saveTodos()
    render()
    updateCounter()
  }
  

  render()
  updateCounter()