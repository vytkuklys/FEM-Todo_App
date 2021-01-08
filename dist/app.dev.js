"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

// localStorage.clear()
var switchs = document.querySelector(".switch__h1");
switchs.addEventListener("click", function () {
  localStorage.clear();
  console.log("as");
}); //---------SELECT ELEMENTS----------

var btnClear = document.querySelector(".list-todo__btn-clear");
var btnSwitch = document.querySelector(".switch__btn");
var btnAll = document.querySelectorAll(".filter-todo__btn-all");
var btnActive = document.querySelectorAll(".filter-todo__btn-active");
var btnComplete = document.querySelectorAll(".filter-todo__btn-complete");
var input = document.querySelector(".create-todo__input");
var listTodo = document.querySelector(".list-todo__ul");
var container = document.querySelector(".container");
var header = document.querySelector(".header");
var body = document.body;
var counterItemsLeft = document.getElementById("items-left");
var lastChild = document.querySelector(".list-todo__li--last-child"); //----------------CLASS NAMES----------------

var COMPLETED = "light-mode__complete";
var LINE_THROUGH = "light-mode--line-through";
var LIGHT_MODE = "light-mode";
var BODY_BG = "light-mode__body";
var FONTACTIVE = "font-active";
var idArr = []; //load local storage

var id = 0,
    LIST = [],
    idea = "";
var data = localStorage.getItem("todoList");

if (data) {
  LIST = JSON.parse(data);
  id = LIST.length;
  loadList(LIST);
} else {
  LIST = [];
  id = 0;

  while (id < 4) {
    console.log(id);

    switch (id) {
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


var draggables = document.querySelectorAll('.draggable');
var listItems = document.querySelectorAll(".list-todo__li");
/*----------EVENT LISTENERS---------------*/

/*-----mouseover and mouseout event to add/remove delete icon*/

draggables.forEach(function (draggable) {
  draggable.addEventListener("mouseover", function () {
    draggable.classList.remove("mouseover");
  });
});
draggables.forEach(function (draggable) {
  draggable.addEventListener("mouseout", function () {
    draggable.classList.add("mouseover");
  });
});
/*click event to run delete or complete function*/

listTodo.addEventListener("click", function (event) {
  /*if statement below prevents an error when clicked on elements without job attribute*/
  if (event.target.attributes.job) {
    var element = event.target;
    var elementJob = event.target.attributes.job.value;

    if (elementJob == "complete") {
      completeTodo(element);
    } else if (elementJob == "delete") {
      deleteTodo(element);
    }
  }
});
/*click event to run a function for filter to show all items*/

btnAll.forEach(function (btn) {
  btn.addEventListener("click", function dog() {
    var allArr = LIST.filter(function (item) {
      return item.deleted == false;
    });
    emptyList();
    loadList(allArr);
    idArr = []; // getIdArr(allArr);

    refreshDraggablesEvent();
    changeFont("btnAll");
  });
}); // function getIdArr(arr){
//     let i = 0;
//     arr.forEach((item)=>{
//         idArr[i] = item.id;
//         i++;
//     })
//     console.log(idArr, "idArr")
// }

/*click event to run a function for filter to show active/incomplete items*/

btnActive.forEach(function (btn) {
  btn.addEventListener("click", function () {
    var activeArr = LIST.filter(function (item) {
      return item.completed == false && item.deleted == false;
    });
    emptyList();
    changeFont("btnActive");
    loadList(activeArr); // idArr = [];
    // getIdArr(activeArr);

    refreshDraggablesEvent();
  });
});
/*click event to run a function for filter to show completed items*/

btnComplete.forEach(function (btn) {
  btn.addEventListener("click", function () {
    var completeArr = LIST.filter(function (item) {
      return item.completed == true;
    });
    emptyList();
    changeFont("btnComplete");
    loadList(completeArr); // idArr = [];
    // getIdArr(completeArr);

    refreshDraggablesEvent();
  });
});
/*click event to run a function to remove completed items*/

btnClear.addEventListener("click", function () {
  var clearItem = LIST.filter(function (item) {
    return item.completed == true && item.deleted == false;
  });
  var elementz;
  clearItem.forEach(function (item) {
    elementz = document.getElementById(item.id);
    deleteTodo(elementz);
  });
}); //click event to togle dark and light themes

btnSwitch.addEventListener("click", function () {
  header.classList.toggle(LIGHT_MODE);
  container.classList.toggle(LIGHT_MODE);
  body.classList.toggle(BODY_BG);
});
/*click event to get value of input and run with it createTodo function*/

input.addEventListener("keyup", function () {
  if (event.keyCode == 13) {
    var todo = input.value;

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
  var filterAll = LIST.filter(function (item) {
    return item.deleted == false;
  });
  var element;
  filterAll.forEach(function (item) {
    element = document.getElementById(item.id);

    if (element) {
      element.parentNode.parentNode.removeChild(element.parentNode);
    }
  });
}

function changeFont(btnName) {
  console.log("hi");

  switch (btnName) {
    case "btnAll":
      btnAll.forEach(function (btn) {
        return btn.classList.add(FONTACTIVE);
      });
      btnActive.forEach(function (btn) {
        return btn.classList.remove(FONTACTIVE);
      });
      btnComplete.forEach(function (btn) {
        return btn.classList.remove(FONTACTIVE);
      });
      break;

    case "btnActive":
      btnAll.forEach(function (btn) {
        return btn.classList.remove(FONTACTIVE);
      });
      btnActive.forEach(function (btn) {
        return btn.classList.add(FONTACTIVE);
      });
      btnComplete.forEach(function (btn) {
        return btn.classList.remove(FONTACTIVE);
      });
      break;

    case "btnComplete":
      btnAll.forEach(function (btn) {
        return btn.classList.remove(FONTACTIVE);
      });
      btnActive.forEach(function (btn) {
        return btn.classList.remove(FONTACTIVE);
      });
      btnComplete.forEach(function (btn) {
        return btn.classList.add(FONTACTIVE);
      });
      break;

    default:
      break;
  }
} //function to run each item from local storage a createTodo function


function loadList(LIST) {
  LIST.forEach(function (item) {
    createTodo(item.name, item.id, item.completed, item.deleted);
  });
  counter();
}
/*function to create todo item on the list*/


function createTodo(todo, id, completed, deleted) {
  if (deleted) {
    return;
  }

  var complete = completed ? COMPLETED : "";
  var line = completed ? LINE_THROUGH : "";
  var todoItem = "\n    <li class=\"list-todo__li draggable mouseover\" draggable=\"true\"><div class=\"list-todo__div ".concat(complete, "\" id=\"").concat(id, "\" job=\"complete\"></div>\n        <p class=\"list-todo__p ").concat(line, "\">").concat(todo, "</p><img src=\"images/icon-cross.svg\"alt=\"cross icon\" class=\"list-todo__img\" job=\"delete\" id=\"").concat(id, "\">\n    </li>\n    ");
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
  var itemsLeft = LIST.filter(function (item) {
    return item.deleted == false && item.completed == false;
  }).length;
  counterItemsLeft.innerHTML = "".concat(itemsLeft);
}
/*------DRAG 'N DROP--------*/

/**/


var exp;
var end = 0;
var start = 0;
draggables.forEach(function (draggable) {
  draggable.addEventListener('dragstart', function () {
    draggable.classList.add("dragging");
    start = draggable.childNodes[0].id;
  });
  draggable.addEventListener("dragend", function () {
    draggable.classList.remove("dragging"); // reorderItems(exp)

    reorderItems();
  });
});

function reorderItems() {
  console.log(start, '-start', end, "-end", "arr-", idArr);
  var skaiciuok = 0;
  var tmp = new Object();

  if (start > end) {
    tmp = LIST.splice(start, 1);
    console.log(LIST);
    LIST.splice(Number(end) + 1, 0, tmp[0]);
  } else if (start < end) {
    tmp = LIST.splice(start, 1);
    console.log(LIST);
    LIST.splice(Number(end), 0, tmp[0]);
  }

  for (var i = 0; i < LIST.length; i++) {
    LIST[i].id = i;
    console.log(idArr[i]); // console.log(LIST[idArr[i]].id)
  }

  refreshDraggablesEvent();
  updateId();
  localStorage.setItem("todoList", JSON.stringify(LIST));
  var tamo = document.querySelector(".font-active").className.split(' ');
  console.log(tamo);

  if (tamo[1] == "filter-todo__btn-all") {
    var allArr = LIST.filter(function (item) {
      return item.deleted == false;
    });
    emptyList();
    loadList(allArr);
    refreshDraggablesEvent();
  } else if (tamo[1] == "filter-todo__btn-active") {
    var activeArr = LIST.filter(function (item) {
      return item.completed == false && item.deleted == false;
    });
    emptyList();
    loadList(activeArr);
    refreshDraggablesEvent();
  } else if (tamo[1] == "filter-todo__btn-complete") {
    var _activeArr = LIST.filter(function (item) {
      return item.completed == true && item.deleted == false;
    });

    emptyList();
    loadList(_activeArr);
    refreshDraggablesEvent();
  } else {
    console.log("Some issues with filter");
  }
}

function updateId() {
  var l = LIST.length;
  l--;

  for (var k = 0; k < listItems.length - 1; k++) {
    console.log(listItems[k].childNodes[0].id, "before");
    listItems[k].childNodes[0].id = l;
    listItems[k].childNodes[3].id = l;
    console.log(listItems[k].childNodes[0].id, "after");
    console.log(l);
    l--;
  }
}

listTodo.addEventListener("dragover", function (e) {
  e.preventDefault();
  var afterElement = getDragAfterElement(listTodo, e.clientY);
  var draggable = document.querySelector(".dragging");

  if (afterElement) {
    end = afterElement.childNodes[0].id;
  } else {
    end = -1;
  }

  if (afterElement == undefined) {
    listTodo.insertBefore(draggable, lastChild);
  } else {
    listTodo.insertBefore(draggable, afterElement);
  }
});

function getDragAfterElement(container, y) {
  var draggableElements = _toConsumableArray(listTodo.querySelectorAll('.draggable:not(.dragging)'));

  return draggableElements.reduce(function (closest, child) {
    var box = child.getBoundingClientRect();
    var offset = y - box.top - box.height / 2;

    if (offset < 0 && offset > closest.offset) {
      return {
        offset: offset,
        element: child
      };
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
  console.log(draggables);
  draggables.forEach(function (draggable) {
    draggable.addEventListener('dragstart', function () {
      draggable.classList.add("dragging");
      start = draggable.childNodes[0].id;
    });
    draggable.addEventListener("dragend", function () {
      draggable.classList.remove("dragging");
      reorderItems();
    });
  });
  draggables.forEach(function (draggable) {
    draggable.addEventListener("mouseover", function () {
      draggable.classList.remove("mouseover");
    });
  });
  draggables.forEach(function (draggable) {
    draggable.addEventListener("mouseout", function () {
      draggable.classList.add("mouseover");
    });
  });
}