import { Injectable } from '@angular/core';
import { ToastService } from '../toast/toast.service';
import { Web3clientService } from '../web3client.service';


@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(
    private web3client: Web3clientService,
    private toast: ToastService
  ) { }

  checkContract(contract:string) {
    return this.web3client.contracts[contract] && this.web3client.contracts[contract] != null;
  }

  async createTask(title: string, description: string, fromWallet?: string) { // CRUD methods better to be at centralized service component.
    try {
      if (this.checkContract('tasksContract')) {
        return await this.web3client.contracts.tasksContract.methods.createTask(title, description).send({ from: fromWallet });
      }
    } catch (error) {
      this.showToast('danger', error.message);
      throw new Error(error.message);
    }
  }

  async deleteTask(id: number, fromWallet?: string){
    try {
      if (this.checkContract('tasksContract')) {
        await this.web3client.contracts.tasksContract.methods.deleteTask(id).send({from: fromWallet});
      }
    } catch (error) {
      this.showToast('danger', error.message);
      throw new Error(error.message);
    }
  }

  async updateTask(id: number, title:string, description:string, fromWallet?: string){
    try {
      if (this.checkContract('tasksContract')) {
        await this.web3client.contracts.tasksContract.methods.updateTask(id, title, description).send({from: fromWallet});
      }
    } catch (error) {
      this.showToast('danger', error.message);
      throw new Error(error.message);
    }
  }

  async toggleDone(id: number, fromWallet?: string) {
    try {
      if (this.checkContract('tasksContract')) {
        await this.web3client.contracts.tasksContract.methods.toggleDone(id).send({ from: fromWallet });
      }
    } catch (error) {
      this.showToast('danger', error.message);
      throw new Error(error.message);
    }
  }

  showToast(type: string, message: string) { // Better to move to a toast service component.
    this.toast.showToast(type, message);
  }
}
