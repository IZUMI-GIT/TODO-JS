let count = 0;

function getStoredTasks(){
    return JSON.parse(localStorage.getItem("tasks"))
}

function getCompleteTasks(){
    return JSON.parse(localStorage.getItem("crossedTasks"))
}

function renderTasks(tasks, rootDiv){

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
            doneBtn.addEventListener("click" , () => doneHandle(index))

            let wrapperList = [taskIp, desc, editBtn, doneBtn];

            rootDiv.appendChild(containerDiv)

            for(let i=0;i<wrapperList.length; i++){
                containerDiv.appendChild(wrapperList[i])
            }
           
            //Duedate feature
            let remainingTime = task.dueTime - Date.now()
            console.log(remainingTime)
            if(!task.dueStatus && remainingTime > 0){
                setTimeout(() => {
                    console.log("index = " + index)
                    task.dueStatus = true;
                    localStorage.setItem("tasks",JSON.stringify(tasks))

                    let elem = document.getElementById(`t${index}`)
                    if(elem){
                        elem.style.color = 'red'
                    }
                },remainingTime)
            }else{
                console.log("already in due , index : " + index)
                document.getElementById(`t${index}`).style.color = "red";
            }
        })
    }else{
        rootDiv.innerText = 'no tasks available'
    }
}

function addTodo(){
    const taskTitle = document.getElementById("title").value;
    const taskDesc = document.getElementById("description").value;
    const taskDueDate = new Date(document.getElementById("dueDate").value)
    const taskPriority = document.getElementById("priority").value.toUpperCase()
    const taskTags = document.getElementById("tags").value.toUpperCase()

    const givenTime = Date.parse(new Date(taskDueDate));

    if(taskTitle.trim() !="" && taskDesc.trim() != ""){
    
    let tasks = getStoredTasks() || []
    if(givenTime >= Date.now()){
    const newTask = {taskTitle,taskDesc,dueTime : givenTime, dueStatus : false, taskPriority, taskTags};
    }else{
        alert("duedate is already over")
    }

    tasks.push(newTask)
    localStorage.setItem("tasks" , JSON.stringify(tasks))
    localStoring();
    filtering();

    document.getElementById("title").value = '';
    document.getElementById("description").value = '';
    document.getElementById("dueDate").value = '';

    }
}

function clearTodos() {
    localStorage.removeItem("tasks");
    localStorage.removeItem("crossedTasks")

    document.getElementById("todo").innerHTML = "no tasks available";
    document.getElementById('filter').value = "All"    
}

function filtering(){
    let filterValue = document.getElementById('filter').value.toUpperCase();
    let tagValue = document.getElementById('taging').value.toUpperCase();
    let unfilteredTasks = getStoredTasks() || [];

    console.log(typeof filterValue)
    if(filterValue == "ALL" && tagValue == "ALL"){
        tasks = unfilteredTasks
    }else if(filterValue != "ALL" && tagValue == "ALL"){
        tasks = unfilteredTasks.filter((x) =>{
            return x.taskPriority == filterValue;
        })
    }else if(filterValue == "ALL" && tagValue != "ALL"){
        tasks = unfilteredTasks.filter((x) => {
            return x.taskTags == tagValue;
        })
    }else{
        tasks =  unfilteredTasks.filter((x) => {
            return (x.taskPriority == filterValue && x.taskTags == tagValue)
        })
    }

    console.log(tasks)
    const rootDiv = document.getElementById("todo"); 
    renderTasks(tasks, rootDiv)
}


function localStoring(){
    let tasks = getStoredTasks() || []
    const rootDiv = document.getElementById("todo"); 

    renderTasks(tasks, rootDiv) //renderTasks

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

            setTimeout(()=>deleteHandle(index), 11000)   //Auto-delete

        });
    }else{
        crossedDiv.innerText = 'none'
    }

    let mode = JSON.parse(localStorage.getItem("mode")) || [];
    count++;
    if(mode.value == 1 && count == 1){
        darkHandle();
    }    
    
}


function doneHandle(id){
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

function searching(){
    let rootDiv = document.getElementById('todo')
    let searchWord = document.getElementById('searching').value.toLowerCase();
    let taskArray = getStoredTasks() || [];

    console.log(searchWord)

    tasks = taskArray.filter((task)=>{
        let lowerCaseTask = task.taskTitle.toLowerCase()
        if(lowerCaseTask.includes(searchWord) || task.taskDesc.toLowerCase().includes(searchWord)){
            return task
        }
    })

    renderTasks(tasks, rootDiv)
}

document.getElementById("addTodoBtn").addEventListener('click', addTodo);
document.getElementById("clearTodosBtn").addEventListener('click', () => clearTodos())
document.getElementById('mode').addEventListener('click', function(){
    darkHandle();

    let mode = JSON.parse(localStorage.getItem("mode")) || [];
    if(mode.value == 0 || mode.value == undefined){
        mode = {value : 1}
    }else{
        mode = {value : 0}
    }

    localStorage.setItem("mode", JSON.stringify(mode))
})