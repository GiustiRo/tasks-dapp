// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;


contract TasksContract {

    uint public taskCounter = 0;

    constructor() {
        createTask("Test", "Tarea de ejemplo.. Hello World!");
        createTask("Buena Tarea!", "Esta es una buena tarea de ejemplo...");
        createTask("Cerrando la semana", "Ejemplo de tarea para marcar como finalizada cuando termine la semana actual de Marzo/Abril.");
    }

    struct Task {
        uint id;
        string title;
        string description;
        bool done;
        uint256 createdAt; // Timestamp (uint and uint256 are equivalents)
    }

    mapping(uint => Task) public tasks;

    function createTask(string memory _title, string memory _description) public {
        taskCounter++;
        tasks[taskCounter] = Task(taskCounter, _title, _description, false, block.timestamp);
    }

    function updateTask(uint _id, string memory _title, string memory _description) public {
        if(tasks[_id].id > 0){
            tasks[_id].title = _title;
            tasks[_id].description = _description;
        }
    }

    function deleteTask(uint _id) public {
        if(tasks[_id].id > 0){
            delete tasks[_id];
        }
    }

    function toggleDone(uint _id) public {
        Task memory _task = tasks[_id];
        _task.done = !_task.done;
        tasks[_id] = _task;
    }
}