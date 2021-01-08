// localStorage.clear()
const switchs = document.querySelector(".switch__h1");
switchs.addEventListener("click", ()=>{
    localStorage.clear();
    console.log("as")
})
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

let idArr = [];

//load local storage
let id = 0,
    LIST = [],
    idea = "";
let data = localStorage.getItem("todoList");
if (data) {
    LIST = JSON.parse(data);
    id = LIST.length;
    loadList(LIST);
} else {
    LIST = [];
    id = 0;
    while(id < 4){
        console.log(id)
        switch(id){
            case 0:
                idea = "Display: Gratitude;";
                break;
            case 1:
                idea = "Contemplate: Death;";
                break;
            case 2:
                idea = "Drink: 2 liter of water;";
                break;
            case 3:
                idea = "Sleep: Solid 8 hours straight;";
                break;
        }
        LIST.push({
            name: idea,
            id: id,
            completed: false,
            deleted: false
        });
        id++;
    }
    loadList(LIST);
    localStorage.setItem("todoList", JSON.stringify(LIST));
    counter();
}

/*draggables is placed below local storage to avoid errors*/
let draggables = document.querySelectorAll('.draggable');
let listItems = document.querySelectorAll(".list-todo__li");

/*----------EVENT LISTENERS---------------*/

/*-----mouseover and mouseout event to add/remove delete icon*/
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
btnAll.forEach((btn)=>{
    btn.addEventListener("click", function dog() {
        let allArr = LIST.filter((item) => (item.deleted == false));
        emptyList();
        loadList(allArr);
        idArr = [];
        // getIdArr(allArr);
        refreshDraggablesEvent();
        changeFont("btnAll");
    });
});
// function getIdArr(arr){
//     let i = 0;
//     arr.forEach((item)=>{
//         idArr[i] = item.id;
//         i++;
//     })
//     console.log(idArr, "idArr")
// }
/*click event to run a function for filter to show active/incomplete items*/
btnActive.forEach((btn)=>{
    btn.addEventListener("click", () => {
        let activeArr = LIST.filter((item) => (item.completed == false && item.deleted == false));
        emptyList();
        changeFont("btnActive");
        loadList(activeArr);
        // idArr = [];
        // getIdArr(activeArr);
        refreshDraggablesEvent();
    });
});


/*click event to run a function for filter to show completed items*/
btnComplete.forEach((btn)=>{
    btn.addEventListener("click", () => {
        let completeArr = LIST.filter((item) => (item.completed == true));
        emptyList();
        changeFont("btnComplete");
        loadList(completeArr);
        // idArr = [];
        // getIdArr(completeArr);
        refreshDraggablesEvent();
    });
});

/*click event to run a function to remove completed items*/
btnClear.addEventListener("click", () => {
    let clearItem = LIST.filter((item) => (item.completed == true && item.deleted == false));
    let elementz;
    clearItem.forEach((item) => {
        elementz = document.getElementById(item.id);
        deleteTodo(elementz);
    });
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
                completed: false,
                deleted: false
            });
            id++;
            localStorage.setItem("todoList", JSON.stringify(LIST));
            counter();
        }
        input.value = "";
        refreshDraggablesEvent();
    }
});

/*----------------FUNCTIONS------------*/
/*function to make the list empty before adding chosen type of items */
function emptyList() {
    let filterAll = LIST.filter((item) => (item.deleted == false));
    let element;
    filterAll.forEach((item) => {
        element = document.getElementById(item.id);
        if (element) {
            element.parentNode.parentNode.removeChild(element.parentNode);
        }
    });
}
function changeFont(btnName){
    console.log("hi")
    switch(btnName){
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
//function to run each item from local storage a createTodo function
function loadList(LIST) {
    LIST.forEach((item) => {
        createTodo(item.name, item.id, item.completed, item.deleted);
    });
    counter();
}

/*function to create todo item on the list*/
function createTodo(todo, id, completed, deleted) {
    if (deleted) {
        return;
    }
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

/*function to delete list items*/
function deleteTodo(element) {
    element.parentNode.parentNode.removeChild(element.parentNode);
    LIST[element.id].deleted = true;
    localStorage.setItem("todoList", JSON.stringify(LIST));
    counter();
}

/*function to display the number of items on the list*/
function counter() {
    let itemsLeft = LIST.filter((item) => (item.deleted == false && item.completed == false)).length;
    counterItemsLeft.innerHTML = `${itemsLeft}`;
}

/*------DRAG 'N DROP--------*/

/**/
let exp;
let end = 0;
let start = 0;
draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
        draggable.classList.add("dragging");
        start = draggable.childNodes[0].id;
    });
    draggable.addEventListener("dragend", () => {
        draggable.classList.remove("dragging");
        // reorderItems(exp)
        reorderItems();
    });
})

function reorderItems(){
    console.log(start, '-start', end, "-end", "arr-", idArr);
    let skaiciuok = 0;
    let tmp = new Object;
    if(start > end){
        tmp = LIST.splice(start, 1);
        console.log(LIST)
        LIST.splice(Number(end) + 1, 0, tmp[0]);
    }else if(start < end){
        tmp = LIST.splice(start, 1);
        console.log(LIST)
        LIST.splice(Number(end), 0, tmp[0]);
    }
    for(let i = 0; i < LIST.length; i++){
        LIST[i].id = i;
        console.log(idArr[i])
        // console.log(LIST[idArr[i]].id)
    }
    refreshDraggablesEvent();
    updateId();
    localStorage.setItem("todoList", JSON.stringify(LIST));
    let tamo = document.querySelector(".font-active").className.split(' ');
    console.log(tamo)
    if(tamo[1] == "filter-todo__btn-all"){
        let allArr = LIST.filter((item) => (item.deleted == false));
        emptyList();
        loadList(allArr);
        refreshDraggablesEvent();
    }else if(tamo[1] == "filter-todo__btn-active"){
        let activeArr = LIST.filter((item) => (item.completed == false) && (item.deleted == false));
        emptyList();
        loadList(activeArr);
        refreshDraggablesEvent();
    }else if(tamo[1] == "filter-todo__btn-complete"){
        let activeArr = LIST.filter((item) => (item.completed == true) && (item.deleted == false));
        emptyList();
        loadList(activeArr);
        refreshDraggablesEvent();
    }else{
        console.log("Some issues with filter")
    }
    
}
function updateId(){
    let l = LIST.length;
    l--;
    for(let k = 0; k < listItems.length - 1; k++){
        console.log(listItems[k].childNodes[0].id,  "before")
        listItems[k].childNodes[0].id = l;
        listItems[k].childNodes[3].id = l;
        console.log(listItems[k].childNodes[0].id, "after")
        console.log(l)

        l--;
    }
}
listTodo.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(listTodo, e.clientY);
    let draggable = document.querySelector(".dragging");
    if(afterElement){
        end = afterElement.childNodes[0].id;
    }else{
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


/*function that refreshes draggables and allows dragstart/mouseover(out) to function w/o errors after updates of list items (filtered or added)*/
function refreshDraggablesEvent() {
    draggables = document.querySelectorAll('.draggable');
    listItems = document.querySelectorAll(".list-todo__li");
    console.log(draggables)
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
