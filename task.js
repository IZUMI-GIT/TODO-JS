function getStoredTasks(){
    return JSON.parse(localStorage.getItem("tasks"))
}

function getCompleteTasks(){
    return JSON.parse(localStorage.getItem("crossedTasks"))
}


function addTodo(){
    const taskTitle = document.getElementById("title").value;
    const taskDesc = document.getElementById("description").value;

    // if(taskTitle.trim() !="" && taskDesc.trim() != ""){
    
    let tasks = getStoredTasks() || []

    const newTask = {taskTitle,taskDesc};

    tasks.push(newTask)
    localStorage.setItem("tasks" , JSON.stringify(tasks))
    localStoring();
    
    // console.log(btnlength)
    // console.log(a)
    // console.log(b)

    document.getElementById("title").value = '';
    document.getElementById("description").value = '';

    }
    // else{
    //     if(taskTitle == "") alert("Enter some task you idiot")
    //     else alert("enter some bloody description")
    // }
// }

function clearTodos() {
    localStorage.removeItem("tasks");
    localStorage.removeItem("crossedTasks")

    localStoring();
}


function localStoring(){

    let tasks = getStoredTasks() || []
    const rootDiv = document.getElementById("todo");
    

    if(tasks.length != 0 ){
        rootDiv.innerHTML = "";
        tasks.forEach((task , index) => {

            const containerDiv = document.createElement('div')
            const taskIp = document.createElement('div')
            const desc = document.createElement('div')
            const editBtn = document.createElement('button')
            const doneBtn = document.createElement('button')
            
            containerDiv.setAttribute("id", `t${index}`)
            containerDiv.innerHTML = '<br />'
            taskIp.innerText = `task : ${task.taskTitle}`
            desc.innerText = `description : ${task.taskDesc}`
            editBtn.innerText = "Edit"
            doneBtn.innerText = "Mark as Done"

            editBtn.addEventListener("click" , () => editHandle(index))
            doneBtn.addEventListener("click" , () => clickHandle(index))

            let wrapperList = [taskIp, desc, editBtn, doneBtn];

            rootDiv.appendChild(containerDiv)

            for(let i=0;i<wrapperList.length; i++){
                containerDiv.appendChild(wrapperList[i])
            }

            // containerDiv.appendChild(taskIp);
            // containerDiv.appendChild(desc);
            // containerDiv.appendChild(editBtn);
            // containerDiv.appendChild(doneBtn);
        })
    }else{
        rootDiv.innerText = 'no tasks available'
    }
    //     document.getElementById("todo").innerHTML +=  
    // `<div id = "t${index}">
    //     <br />
    //     <div>task : ${task.taskTitle}</div>
    //     <div>desc : ${task.taskDesc}</div>
    //     <button onclick = "editHandle(${index})">edit</button>
    //     <button onclick = "clickHandle(${index})">Mark as done</button>
    // </div>`                
    // });


    let crossedTasks = getCompleteTasks() || [];
    const crossedDiv = document.getElementById("crossedTodo")

    if(crossedTasks.length != 0){
        crossedDiv.innerHTML = ''

        crossedTasks.forEach((task, index) => {
            const containerDiv = document.createElement('div')
            const taskIp = document.createElement('div')
            const desc = document.createElement('div')
            const deleteBtn = document.createElement('button')
            const undoBtn = document.createElement('button')
            
            containerDiv.setAttribute("id", `c${index}`)
            containerDiv.innerHTML = '<br />'
            taskIp.innerText = `task : ${task.taskTitle}`
            desc.innerText = `description : ${task.taskDesc}`
            undoBtn.innerText = 'Undo'
            deleteBtn.innerText = "Delete"

            undoBtn.onclick = () => undoHandle(index)
            deleteBtn.addEventListener("click" , () => deleteHandle(index))

            wrapperList = [taskIp, desc, undoBtn, deleteBtn]
            crossedDiv.appendChild(containerDiv)

            for(let i = 0;i<wrapperList.length; i++){
                containerDiv.appendChild(wrapperList[i])
                containerDiv.style.textDecoration = "line-through"
            }

            let promise1 = new Promise((resolve) => {
                setTimeout(()=>deleteHandle(index), 11000)
            })
            // containerDiv.appendChild(taskIp);
            // containerDiv.appendChild(desc);
            // containerDiv.appendChild(deleteBtn);

        // crossedTasks.forEach((task, index) => {
        //     document.getElementById("crossedTodo").innerHTML += `
        //     <br />
        //     <div><s>task : ${task.taskTitle}</s></div>
        //     <div><s>desc : ${task.taskDesc}</s></div>
        //     </div>
        //     `

        });
    }else{
        crossedDiv.innerText = 'none'
    }
}

// function crossedTasks() {
//     const rootDiv = document.getElementById("crossedTodo")
//     rootDiv.innerHTML = "";

//     let crossedTasks = JSON.parse(localStorage.getItem("crossedTasks"));

//     crossedTasks.forEach((task, index) => {
//         rootDiv.innerHTML += `
//         <div id=${index}>
//         <div>task : ${task.a}</div>
//         <div>desc : ${task.b}</div>
//         </div>
//         `
//     });
// }

// function clickHandle(id){
//     console.log(JSON.parse(id))
//     let taskArray = JSON.parse(localStorage.getItem("tasks")) || [];
//     let x = taskArray.splice(id,1)
//     console.log(x)
//     localStorage.setItem("tasks",JSON.stringify(taskArray))
//     localStoring()

// }

function clickHandle(id){
    let taskArray = getStoredTasks() || [];
    let x = taskArray.splice(id,1);
    
    let crossedArray = getCompleteTasks() || [];
    console.log(x[0])
    let arr = x[0]
    console.log(arr)
    crossedArray.push(arr)

    localStorage.setItem("tasks" , JSON.stringify(taskArray))
    localStorage.setItem("crossedTasks", JSON.stringify(crossedArray))

    console.log(taskArray)
    console.log(crossedArray)
    localStoring();

    // crossedTasks();
}




function editHandle(id){

    let taskArray = getStoredTasks() || [];

    document.getElementById(`t${id}`).innerHTML = `
    <br />
    <label for="task${id}">task: </label>
    <input type="text" id="task${id}" value="${taskArray[id].taskTitle}" />
    <br />
    <label for="desc${id}">desc: </label>
    <input type="text" id="desc${id}" value="${taskArray[id].taskDesc}" />
    <button onClick = "saveHandle(${id})">save</button>
    <button onClick = "localStoring()">cancel</button>
    `            
}

function saveHandle(id){
    let taskArray = getStoredTasks() || [];

    let taskTitle = document.getElementById(`task${id}`).value;
    let taskDesc = document.getElementById(`desc${id}`).value;

    console.log({taskTitle, taskDesc})
    if(taskTitle != '' && taskDesc != ''){
        taskArray[id] = {taskTitle, taskDesc}
    }else{
        alert("Fill all the details")
        
    }
    
    localStorage.setItem("tasks",JSON.stringify(taskArray))

    localStoring();
}

function deleteHandle(id){
    let completeTaskArray = getCompleteTasks() || [];
    completeTaskArray.splice(id,1);

    localStorage.setItem("crossedTasks",JSON.stringify(completeTaskArray));

    localStoring()
}

function undoHandle(id){
    let completeTaskArray = getCompleteTasks() || []
    let taskArray = getStoredTasks() || []

    let x = completeTaskArray.splice(id, 1)
    let arr = x[0]
    taskArray.push(arr);

    localStorage.setItem("tasks", JSON.stringify(taskArray))
    localStorage.setItem("crossedTasks", JSON.stringify(completeTaskArray))

    localStoring();
}

function darkHandle(){
    var elem = document.body;
    elem.classList.toggle("dark-mode")    
}

document.getElementById("addTodoBtn").addEventListener('click', addTodo);
document.getElementById("clearTodosBtn").addEventListener('click', () => clearTodos())
document.getElementById('mode').addEventListener('click', function(){
    darkHandle();
})