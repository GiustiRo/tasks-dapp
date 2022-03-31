import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { TasksService } from '../services/tasks/tasks.service';
import { ToastService } from '../services/toast/toast.service';
import { Web3clientService } from '../services/web3client.service';
import { TaskFormComponent } from '../tasks/task-form/task-form.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  todo = {
    title: '',
    description: ''
  }
  walletConnected: boolean = false;
  activeWallet: string = '';

  tasksList: {
    id: number,
    title: string,
    description: string,
    done: boolean
    createdAt: string | number
  }[] = [];
  showTasks: boolean = false
  editTask = {
    idTask: '',
    edit: false
  };
  
  walletConnectedSub: Subject<boolean> = new Subject();
  taskFetchSub: Subject<any> = new Subject();


  constructor(
    private web3client: Web3clientService,
    private tasksService: TasksService,
    private toast: ToastService,
    public popoverController: PopoverController
    ) {
    this.walletConnectedSub.subscribe(wallet => {
      console.log('is wallet?', wallet);
    })
    this.taskFetchSub.subscribe(task => {
      console.log('Refreshing Tasks...');
      this.fetchUITasks();
    })
  }

  ngOnInit(){
    if(this.web3client.activeWallet != null){
      this.walletConnected = true;
      this.walletConnectedSub.next(true)
    }else{
      this.walletConnected = false;
      this.walletConnectedSub.next(false)
    }
  }

  submitForm(e) {
    e.preventDefault();
    this.createTask(this.todo.title, this.todo.description).then(res => {
      this.toast.showToast();
      this.taskFetchSub.next(res);
      Object.keys(this.todo).forEach((v) => this.todo[v] = '')
    }).catch( err => {
      console.error(err);
    })
  }

  connecWallet(){
    this.web3client.requestAccounts().then(res => {
      console.log(res);
      this.web3client.activeWallet = res[0];
      this.activeWallet = res[0];
      this.walletConnected = true;
      this.walletConnectedSub.next(true);
      this.taskFetchSub.next(null);  // Once we have a wallet connected, fetch account's tasks.
      this.toast.showToast('success', 'Bienvenido!');
    }).catch(err => {
      this.toast.showToast('danger', 'La conexión de la cuenta fue rechazada.')
    });
  }

  async createTask(title:string, description:string){
    return this.tasksService.createTask(title, description, this.activeWallet);
  }

  async deleteTask(id:number){
    console.warn(id);
    await this.tasksService.deleteTask(id, this.activeWallet).then(res => {
      this.toast.showToast();
      this.taskFetchSub.next(res);
      console.warn('Tarea Eliminada');
    })
  }

  editTaskMode(task: any){
    if(task.done){
      this.toast.showToast('warning', 'No puedes actualizar una tarea marcada como realizada!');
      return;
    }
    this.editTask.edit = true;
    this.editTask.idTask = task.id;
    this.presentPopover(null, {...task}).then(async task => {
      if(task != undefined && task.id){
        console.warn('execute response');
        // await this.tasksService.updateTask(res.id, res.title, res.description, this.activeWallet).then(res => {

        // });
        await this.updateTask(task);
      }
    });    
  }

  async updateTask(task: any){
    console.warn(task);
    await this.tasksService.updateTask(task.id, task.title, task.description, this.activeWallet).then(res => {
      this.toast.showToast();
      this.taskFetchSub.next(res);
      console.warn('Tarea Actualizada');
    })
  }

  async toggleDone(task: any){
    try {
      task.done = !task.done;
      await this.tasksService.toggleDone(task.id, this.activeWallet);
      this.toast.showToast();
    } catch (error) {      
      task.done = !task.done;
    }
    
  }

  fetchUITasks() {
    let _tasksList = [];
    this.web3client.contracts.tasksContract.methods.taskCounter().call().then(async count => {
        console.info(count);
        for (let i = 1; i <= count; i++) {
          await this.web3client.contracts.tasksContract.methods.tasks(i).call().then(res => {
            if(res?.id != 0){
              _tasksList.push({id: +res.id, title: res.title, description: res.description, done: res.done, createdAt: new Date(res.createdAt * 1000).toLocaleString()});
            }
          });      
        }
      }).finally(() => {
        console.log('tasks procesadas!');
        this.tasksList = _tasksList;
        console.log(this.tasksList);
        setTimeout(() => {          
          this.showTasks = true;
        },1000)
      }); 
  }

  async presentPopover(ev: any, task:any) {    
    const popover = await this.popoverController.create({
      component: TaskFormComponent,
      componentProps: {task: task},
      cssClass: 'edit-task-popover',
      event: ev,
      translucent: true
    });
    await popover.present();
    return await popover.onDidDismiss().then(data => {
      if(!data.data || data.role == 'backdrop'){
        return undefined; // Cancel edit.
      }else if(data.role == 'update'){
        return data.data; // Confirm update.
      }
    })
  }
}
