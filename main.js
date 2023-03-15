//create new li element
function createToDoElement(todo, params) {
    if (!todo) return null;

    //find template
    const todoTemplate = document.getElementById('todoTemplate');
    if (!todoTemplate) return;

    //clone li element in template
    const todoElement = todoTemplate.content.firstElementChild.cloneNode(true); //li
    todoElement.dataset.id = todo.id;
    todoElement.dataset.status = todo.status;

    //render todo status
    const divElement = todoElement.querySelector('div.todo');
    if (divElement) {
        const alertClass = todo.status == 'finish' ? 'alert-success' : 'alert-secondary';
        divElement.classList.remove('alert-secondary');
        divElement.classList.add(alertClass);
    }

    //update li in template
    const titleElement = todoElement.querySelector('.todo_title');
    if (titleElement) titleElement.textContent = todo.title;

    todoElement.hidden = !isMatch(todoElement, params)

    // const liElement = document.createElement('li');
    // liElement.textContent = todo.title;
    // liElement.dataset.id = todo.id;

    //remove element
    const removeButton = todoElement.querySelector('button.remove');
    if (removeButton) {
        removeButton.addEventListener('click', () => {
            //save to local storage
            const todoList = getTodoList();
            const newTodoList = todoList.filter(x => x.id !== todo.id)
            localStorage.setItem('todo_list', JSON.stringify(newTodoList))

            //remove from dom
            todoElement.remove();
        })
    }

    //finish element
    const finishButton = todoElement.querySelector('button.mark-as-done');
    if (finishButton) {
        finishButton.addEventListener('click', () => {
            const currentStatus = todoElement.dataset.status;
            const newStatus = currentStatus === 'pending' ? 'finish' : 'pending';

            // save to local storage
            const todoList = getTodoList();
            const index = todoList.findIndex(x => x.id === todo.id);
            if(index >= 0) {
                todoList[index].status = newStatus;
                localStorage.setItem('todo_list', JSON.stringify(todoList))
            }

            todoElement.dataset.status = newStatus;

            const newAlert = currentStatus === 'pending' ? 'alert-success' : 'alert-secondary' ;
            divElement.classList.remove('alert-secondary', 'alert-success');
            divElement.classList.add(newAlert);

        })
    }

    //edit element
    const editButton = todoElement.querySelector('button.edit');
    if (editButton) {
        editButton.addEventListener('click', () => {
            //need to get todo from local storage
            //as todo data can be outdated
            const todoList = getTodoList();
            const lastestTodo = todoList.find((x) => x.id == todo.id);
            if (!lastestTodo) return;

            populateTodoForm(lastestTodo);
        })
    }

    return todoElement; //li
}
function createToDoElement2(todo) {
    if (!todo) return null;

    //find template
    const todoTemplate = document.getElementById('todoTemplate');
    if (!todoTemplate) return;

    //clone li element in template
    const todoElement = todoTemplate.content.firstElementChild.cloneNode(true); //li
    todoElement.dataset.id = todo.id;
    todoElement.dataset.status = todo.status;

    //update li in template
    const titleElement = todoElement.querySelector('.todo_title');
    if (titleElement) {
        titleElement.textContent = todo.title;
    }

    //render todo status
    const divElement = todoElement.querySelector('div.todo');
    if (divElement) {
        const alertClass = todo.status == 'finish' ? 'alert-success' : 'alert-secondary';
        divElement.classList.remove('alert-secondary');
        divElement.classList.add(alertClass);
    }

    // const liElement = document.createElement('li');
    // liElement.textContent = todo.title;
    // liElement.dataset.id = todo.id;

    //remove element
    const removeButton = todoElement.querySelector('button.remove');
    if (removeButton) {
        removeButton.addEventListener('click', () => {
            //save to local storage
            const todoList = getTodoList();
            const newTodoList = todoList.filter(x => x.id !== todo.id)
            localStorage.setItem('todo_list', JSON.stringify(newTodoList))

            //remove from dom
            todoElement.remove();
        })
    }

    //finish element
    const finishButton = todoElement.querySelector('button.mark-as-done');
    if (finishButton) {
        finishButton.addEventListener('click', () => {
            const currentStatus = todoElement.dataset.status;
            const newStatus = currentStatus === 'pending' ? 'finish' : 'pending';

            // save to local storage
            const todoList = getTodoList();
            const index = todoList.findIndex(x => x.id === todo.id);
            if(index >= 0) {
                todoList[index].status = newStatus;
                localStorage.setItem('todo_list', JSON.stringify(todoList))
            }

            todoElement.dataset.status = newStatus;

            const newAlert = currentStatus === 'pending' ? 'alert-success' : 'alert-secondary' ;
            divElement.classList.remove('alert-secondary', 'alert-success');
            divElement.classList.add(newAlert);

        })
    }

    //edit element
    const editButton = todoElement.querySelector('button.edit');
    if (editButton) {
        editButton.addEventListener('click', () => {
            //need to get todo from local storage
            //as todo data can be outdated
            const todoList = getTodoList();
            const lastestTodo = todoList.find((x) => x.id == todo.id);
            if (!lastestTodo) return;

            populateTodoForm(lastestTodo);
        })
    }

    return todoElement; //li
}

function populateTodoForm(todo) {
    //get to do input
    const todoForm = document.getElementById('todoFormId');
    if (!todoForm) return;

    //get id
    todoForm.dataset.id = todo.id;

    //get value
    const todoInput = document.getElementById('todoText');
    if (todoInput) todoInput.value = todo.title;
}

//render data
function renderToDoList(todoList, ulElementId, params) {
    //validate
    if (!Array.isArray(todoList) || todoList.length === 0) return;

    //get Ul Element by ID
    const ulElement = document.getElementById(ulElementId);
    if (!ulElement) return;

    //create/clone li Element (template) and add them to Ul
    for (let todo of todoList) {
        const liELement = createToDoElement(todo, params);
        ulElement.appendChild(liELement);
    }
}

//get local storage
function getTodoList() {
    try {
        return JSON.parse(localStorage.getItem('todo_list'))
    } catch {
        return [];
    }
}

function handleTodoFormSubmit(event) {
    event.preventDefault();

    const todoForm = document.getElementById('todoFormId');
    if (!todoForm) return;

    //get value from input
    const todoInput = document.getElementById('todoText');
    if (todoInput.value == '') {
        alert('Empty input!')
        return;
    }
    //determine add or edit mode
    const isEdit = Boolean(todoForm.dataset.id);

    if (isEdit) {
        //edit mode
        //find current to do
        const todoList = getTodoList();
        const index = todoList.findIndex((x) => x.id.toString() === todoForm.dataset.id)
        if (index < 0) return;

        //update content
        todoList[index].title = todoInput.value;

        //save to local storage
        localStorage.setItem('todo_list', JSON.stringify(todoList));

        //change DOM
        //find li element having id = todoForm.dataset.id
        const liElement = document.querySelector(`ul#todo-list>li[data-id="${todoForm.dataset.id}"]`);
        if (liElement) {
            const titleElement = liElement.querySelector('.todo_title');
            if (titleElement) titleElement.textContent = todoInput.value;
        }
    } else {
        //add mode
        const newTodo = {
            id: Date.now(),
            title: todoInput.value,
            status: 'pending'
        }
        //save to local storage
        const todoList = getTodoList();
        todoList.push(newTodo);
        localStorage.setItem('todo_list', JSON.stringify(todoList));

        //add to DOM
        const newLiElement = createToDoElement2(newTodo);
        const ulElement = document.getElementById('todo-list');
        if (!ulElement) return;
        ulElement.appendChild(newLiElement);
    }
    delete todoForm.dataset.id;
    todoForm.reset();
}

//search
function initSearchInput(params) {
    //search term input
    const searchInput = document.getElementById('searchTerm');
    if (!searchInput) return;

    if (params.get('searchTerm')) {
        searchInput.value = params.get('searchTerm')
    }

    //attach change event
    searchInput.addEventListener('input', () => {
        // searchTodo(searchInput.value);
        handleFilterChange('searchTerm', searchInput.value)
    })
}

// function searchTodo(searchTerm) {
//     const todoElementList = getAllTodoElement();

//     for (const todoElement of todoElementList) {
//         const needToShow = isMatch(todoElement, searchTerm);

//         todoElement.hidden = !needToShow;
//     }
// }

function isMatchSearch(liElement, searchTerm) {
    if (searchTerm === '') return true;
    if (!liElement) return false;

    const titleElement = liElement.querySelector('p.todo_title');
    if (!titleElement) return false;

    return titleElement.textContent.includes(searchTerm);

}

function isMatchStatus(liELement, filterStatus) {
    return filterStatus == 'all' || liELement.dataset.status == filterStatus;
}

function isMatch(liElement, params) {
    return (
        isMatchSearch(liElement, params.get('searchTerm')) &&
        isMatchStatus(liElement, params.get('status'))
    );
}

function getAllTodoElement() {
    return document.querySelectorAll('#todo-list > li')
}

//filter
function initFilterStatus(params) {
    //find select
    const filterStatusSelect = document.getElementById('filterStatus');
    if (!filterStatusSelect) return;

    if (params.get('status')) {
        filterStatusSelect.value = params.get('status');
    }

    //attach event change
    filterStatusSelect.addEventListener('change', () => {
        // filterTodo(filterStatusSelect.value);
        handleFilterChange('status', filterStatusSelect.value)
    })
}

// function filterTodo(filterStatus) {
//     const todoElementList = getAllTodoElement();

//     for (const todoElement of todoElementList) {
//         console.log(todoElement);
//         const needToShow = filterStatus === 'all' || todoElement.dataset.status === filterStatus;
//         todoElement.hidden = !needToShow;
//     }
// }

function handleFilterChange(filterName, filterValue) {
    //update query param
    const url = new URL(window.location);
    url.searchParams.set(filterName, filterValue);
    history.pushState({}, '', url);

    const todoElementList = getAllTodoElement();

    for (const todoElement of todoElementList) {
        const needToShow = isMatch(todoElement, url.searchParams);
        todoElement.hidden = !needToShow;
    }
}


//MAIN FUNCTION
(() => {
    // const todoList = [
    //     {id: 1, title: 'Learn Javascript', status: 'pending'},
    //     {id: 2, title: 'Learn React', status: 'finish'},
    //     {id: 3, title: 'Learn Golang', status: 'pending'}
    // ];
    const params = new URLSearchParams(window.location.search);
    const todoList = getTodoList();
    renderToDoList(todoList, 'todo-list', params);

    //add event to SUBMIT ADD
    const todoForm = document.getElementById('todoFormId');
    if (todoForm) {
        todoForm.addEventListener('submit', handleTodoFormSubmit)
    }
    initFilterStatus(params);
    initSearchInput(params);
})()