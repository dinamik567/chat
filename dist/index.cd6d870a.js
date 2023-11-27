const STATUS = {
    TODO: "To do",
    DONE: "Done",
    IN_PROGRESS: "In Progress"
};
const PRIORITY = {
    HIGH: "High",
    LOW: "Low"
};
const toDoList = [];
function addTask(task, status = STATUS.TODO, priority = PRIORITY.HIGH) {
    const index = toDoList.findIndex((obj)=>obj.task === task);
    if (index === -1) toDoList.push({
        status,
        priority,
        task
    });
}
function deleteTask(task) {
    const index = toDoList.findIndex((obj)=>obj.task === task);
    if (index !== -1) toDoList.splice(index, 1);
}
function changeStatus(task, status) {
    toDoList.map((obj)=>{
        if (obj.task === task) obj.status = status;
    });
}
function changePriority(task, priority) {
    toDoList.map((obj)=>{
        if (obj.task === task) obj.priority = priority;
    });
}
addTask("сходить за водой");
addTask("сходить в зал");
addTask("Сходить в магазин");
deleteTask("сходить в зал");
changeStatus("сходить за водой", STATUS.DONE);
addTask("почитать книгу");
changePriority("почитать книгу", PRIORITY.LOW);
console.log(toDoList);

//# sourceMappingURL=index.cd6d870a.js.map
