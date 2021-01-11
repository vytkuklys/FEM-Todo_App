//---------SELECT ELEMENTS----------
const btnClear = document.querySelector(".list-todo__btn-clear");
const btnSwitch = document.querySelector(".switch__btn");
const btnAll = document.querySelectorAll(".filter-todo__btn-all");
const btnActive = document.querySelectorAll(".filter-todo__btn-active");
const btnComplete = document.querySelectorAll(".filter-todo__btn-complete");
const input = document.querySelector(".create-todo__input");
const listTodo = document.querySelector(".list-todo__ul");
const container = document.querySelector(".container");
const header = document.querySelector(".header");
const body = document.body;
const counterItemsLeft = document.getElementById("items-left");
const lastChild = document.querySelector(".list-todo__li--last-child");

//----------------CLASS NAMES----------------
const COMPLETED = "light-mode__complete";
const LINE_THROUGH = "light-mode--line-through";
const LIGHT_MODE = "light-mode";
const BODY_BG = "light-mode__body";
const FONTACTIVE = "font-active"

//-----------Load local storage
let id = 0,
    LIST = [],
    task = "";
let data = localStorage.getItem("todoList");
if (data) {
    LIST = JSON.parse(data);
    id = LIST.length;
    loadList(LIST);
} else {
    LIST = [];
    id = 0;
    while (id < 4) {
        switch (id) {
            case 0:
                task = "Show gratitude";
                break;
            case 1:
                task = "Comtemplate imminence of death";
                break;
            case 2:
                task = "Drink 2 liters of water";
                break;
            case 3:
                task = "Sleep for solid 8 hours straight";
                break;
        }
        LIST.push({
            name: task,
            id: id,
            completed: false
        });
        id++;
    }
    loadList(LIST);
    localStorage.setItem("todoList", JSON.stringify(LIST));
    counter();
}

/*These variables are placed below local storage to avoid errors*/
let draggables = document.querySelectorAll('.draggable');
let listItems = document.querySelectorAll(".list-todo__li");

/*----------EVENT LISTENERS---------------*/

/*Dragover/dragend and Mouseover/Mouseleave envent listeners where added to a function for the lack
of better way to sustain their usability after interaction (changes to list items)*/
refreshEventListeners();

/*click event to run delete or complete function*/
listTodo.addEventListener("click", (event) => {
    /*if statement below prevents an error when clicked on elements without job attribute*/
    if (event.target.attributes.job) {
        const element = event.target;
        const elementJob = event.target.attributes.job.value;
        if (elementJob == "complete") {
            completeTodo(element);
        } else if (elementJob == "delete") {
            deleteTodo(element);
        }
    }
});

/*click event to run a function for filter to show all items*/
btnAll.forEach((btn) => {
    btn.addEventListener("click", function dog() {
        emptyList();
        loadList(LIST);
        refreshEventListeners();
        changeFont("btnAll");
    });
});

/*click event to run a function for filter to show active/incomplete items*/
btnActive.forEach((btn) => {
    btn.addEventListener("click", () => {
        let activeArr = LIST.filter((item) => (item.completed == false));
        emptyList();
        changeFont("btnActive");
        loadList(activeArr);
        refreshEventListeners();
    });
});


/*click event to run a function for filter to show completed items*/
btnComplete.forEach((btn) => {
    btn.addEventListener("click", () => {
        let completeArr = LIST.filter((item) => (item.completed == true));
        emptyList();
        changeFont("btnComplete");
        loadList(completeArr);
        refreshEventListeners();
    });
});

/*click event to run a function to remove completed items*/
btnClear.addEventListener("click", () => {
    let completedItems = LIST.filter((item) => (item.completed == true));
    let completed;
    let toRemoveFromLocalStorage = [];
    let i = 0;
    completedItems.forEach((item) => {
        completed = document.getElementById(item.id);
        completed.parentNode.parentNode.removeChild(completed.parentNode);
        toRemoveFromLocalStorage[i] = completed.id;
        i++;
    });
    //for loop to filter out removed items from local storage
    for (let j = 0; j < toRemoveFromLocalStorage.length; j++) {
        LIST = LIST.filter((item) => (item.id !== Number(toRemoveFromLocalStorage[j])));
    }
    //for loop to change id's according to index position 
    for (let k = 0; k < LIST.length; k++) {
        LIST[k].id = k;
    }
    refreshEventListeners();
    updateDraggableId();
    refreshList();
});

//click event to togle dark and light themes
btnSwitch.addEventListener("click", () => {
    header.classList.toggle(LIGHT_MODE);
    container.classList.toggle(LIGHT_MODE);
    body.classList.toggle(BODY_BG);
});

/*click event to get value of input and run with it createTodo function*/
input.addEventListener("keyup", () => {
    if (event.keyCode == 13) {
        let todo = input.value;
        if (todo) {
            createTodo(todo, id, false, false);
            LIST.push({
                name: todo,
                id: id,
                completed: false
            });
            id++;
            localStorage.setItem("todoList", JSON.stringify(LIST));
            counter();
        }
        input.value = "";
        refreshEventListeners();
    }
});

/*----------------FUNCTIONS------------*/
/*function to make the list empty before adding chosen type of items */
function emptyList() {
    let element;
    LIST.forEach((item) => {
        element = document.getElementById(item.id);
        if (element) {
            element.parentNode.parentNode.removeChild(element.parentNode);
        }
    });
}

/*function to change font color of chosen filter (all, complete or active) */
function changeFont(btnName) {
    switch (btnName) {
        case "btnAll":
            btnAll.forEach((btn) => btn.classList.add(FONTACTIVE))
            btnActive.forEach((btn) => btn.classList.remove(FONTACTIVE))
            btnComplete.forEach((btn) => btn.classList.remove(FONTACTIVE))
            break;
        case "btnActive":
            btnAll.forEach((btn) => btn.classList.remove(FONTACTIVE))
            btnActive.forEach((btn) => btn.classList.add(FONTACTIVE))
            btnComplete.forEach((btn) => btn.classList.remove(FONTACTIVE))
            break;
        case "btnComplete":
            btnAll.forEach((btn) => btn.classList.remove(FONTACTIVE))
            btnActive.forEach((btn) => btn.classList.remove(FONTACTIVE))
            btnComplete.forEach((btn) => btn.classList.add(FONTACTIVE))
            break;
        default:
            break;
    }
}
// //function to run each item from local storage a createTodo function
function loadList(LIST) {
    LIST.forEach((item) => {
        createTodo(item.name, item.id, item.completed);
    });
    counter();
}

/*function to create todo item on the list*/
function createTodo(todo, id, completed) {
    let complete = completed ? COMPLETED : "";
    let line = completed ? LINE_THROUGH : "";
    let todoItem =
        `
    <li class="list-todo__li draggable mouseover" draggable="true"><div class="list-todo__div ${complete}" id="${id}" job="complete"></div>
        <p class="list-todo__p ${line}">${todo}</p><img src="images/icon-cross.svg"alt="cross icon" class="list-todo__img" job="delete" id="${id}">
    </li>
    `
    listTodo.insertAdjacentHTML("afterbegin", todoItem);
}

/*function to make list items completed/incomplete*/
function completeTodo(element) {
    element.classList.toggle(COMPLETED);
    element.nextElementSibling.classList.toggle(LINE_THROUGH);
    LIST[element.id].completed = LIST[element.id].completed ? false : true;
    localStorage.setItem("todoList", JSON.stringify(LIST));
    counter();
}

/*function to refresh list items after changes to local storage are made so that draggable items would
 contain the newest changes. This is used for drag and drop to reorder items on screen and elements in 
 local storage*/
function refreshList() {
    let filter = document.querySelector(".font-active").className.split(' ');
    if (filter[1] == "filter-todo__btn-all") {
        emptyList();
        loadList(LIST);
    } else if (filter[1] == "filter-todo__btn-active") {
        let activeArr = LIST.filter((item) => (item.completed == false));
        emptyList();
        loadList(activeArr);
    } else if (filter[1] == "filter-todo__btn-complete") {
        let completedArr = LIST.filter((item) => (item.completed == true));
        emptyList();
        loadList(completedArr);
    } else {
        console.log("Some issues with finding filter class")
    }
    refreshEventListeners();
    localStorage.setItem("todoList", JSON.stringify(LIST));
}

/*function to delete list items*/
function deleteTodo(element) {
    element.parentNode.parentNode.removeChild(element.parentNode);
    /*Element was removed to prevent error that occured after deleting list items and using drag/drop */
    LIST.splice(element.id, 1)
    for (let i = 0; i < LIST.length; i++) {
        LIST[i].id = i;
    }
    id = LIST.length;
    counter();
    refreshEventListeners();
    updateDraggableId();
    refreshList();
}

/*function to display the number of items on the list*/
function counter() {
    let itemsLeft = LIST.filter((item) => (item.completed == false)).length;
    counterItemsLeft.innerHTML = `${itemsLeft}`;
}

/*------DRAG 'N DROP--------*/
/*function to reorder items on the LIST by removing dragstart item then placing it
in the dragend position. After this ids of LIST(local storage) elements are set according to 
their index position
*/
function reorderItems() {
    let tmp = [];
    if (start > end) {
        tmp = LIST.splice(start, 1);
        LIST.splice(Number(end) + 1, 0, tmp[0]);
    } else if (start < end) {
        tmp = LIST.splice(start, 1);
        LIST.splice(Number(end), 0, tmp[0]);
    }
    LIST = LIST.filter((item) => item !== undefined);
    for (let i = 0; i < LIST.length; i++) {
        LIST[i].id = i;
    }
    refreshEventListeners();
    refreshList();
}

/*function to update Ids of draggables. Which allows to prevent errors after items are removed from the
list*/
function updateDraggableId() {
    let i = LIST.length;
    i--;
    for (let k = 0; k < listItems.length - 1; k++) {
        listItems[k].childNodes[0].id = i;
        listItems[k].childNodes[3].id = i;
        i--;
    }
}

/*function that refreshes draggables and allows dragstart/mouseover(out) to function w/o errors
 after updates of list items (filtered or added)*/
function refreshEventListeners() {
    draggables = document.querySelectorAll('.draggable');
    listItems = document.querySelectorAll(".list-todo__li");
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add("dragging");
            start = draggable.childNodes[0].id;
        });
        draggable.addEventListener("dragend", () => {
            draggable.classList.remove("dragging");
            reorderItems();
        });
    })
    draggables.forEach((draggable) => {
        draggable.addEventListener("mouseover", () => {
            draggable.classList.remove("mouseover")
        })
    })
    draggables.forEach((draggable) => {
        draggable.addEventListener("mouseout", () => {
            draggable.classList.add("mouseover")
        })
    })
}

listTodo.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(listTodo, e.clientY);
    let draggable = document.querySelector(".dragging");
    if (afterElement) {
        end = afterElement.childNodes[0].id;
    } else {
        end = -1;
    }
    if (afterElement == undefined) {
        listTodo.insertBefore(draggable, lastChild)
    } else {
        listTodo.insertBefore(draggable, afterElement)
    }
})


function getDragAfterElement(container, y) {
    const draggableElements = [...listTodo.querySelectorAll('.draggable:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return {
                offset: offset,
                element: child
            }
        } else {
            return closest;
        }
    }, {
        offset: Number.NEGATIVE_INFINITY
    }).element;
}
