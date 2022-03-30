const TasksContract = artifacts.require("TasksContract");

contract("TasksContract", () => {
    before(async () => {
        this.tasksContract = await TasksContract.deployed();
    });

    it('Contract was deployed', async () => {
        const address = this.tasksContract.address;
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
        assert.notEqual(address, 0x0);
        assert.notEqual(address, "");
    });

    it('Get Tasks list', async () => {
        const counter = +await this.tasksContract.taskCounter();
        const task = await this.tasksContract.tasks(counter);
        assert.equal(task.id.toNumber(), counter);
    })

    it('Task created successfully', async () => {
        await this.tasksContract.createTask("Tarea Mocha", "Esta tarea se generó automáticamente como prueba.");
        const counter = +await this.tasksContract.taskCounter();
        const result = await this.tasksContract.tasks(counter);
        assert.equal(result.title, "Tarea Mocha");
    })

    it('Delete task', async () => {
        const counter = +await this.tasksContract.taskCounter();
        const result = await this.tasksContract.tasks(counter);
        await this.tasksContract.deleteTask(result.id);
        const trytogetDeleted = await this.tasksContract.tasks(counter);
        assert.equal(trytogetDeleted.id, 0)
    })
})