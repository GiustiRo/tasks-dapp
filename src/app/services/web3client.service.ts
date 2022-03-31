import { Injectable } from '@angular/core';

import TasksContract from 'contracts/TasksContract.json';
import Web3 from 'web3/dist/web3.min.js'

@Injectable({
  providedIn: 'root'
})
export class Web3clientService {
  eth: any
  web3: any
  networkId: number | string;
  activeWallet: any;
  contracts: { [key: string]: any } = {};


  constructor() { }

  async initWeb3() { // Initialize dapp's web3 provider (try to load web3 object, then load contracts).
    await this.loadWeb3();
    this.loadContracts();
  }

  async loadWeb3() {
    if (typeof (window as any).ethereum != undefined) {
      this.eth = (window as any).ethereum; // Check for metamask instance (or other web3 wallet) for blockchain communication.
      this.web3 = new Web3(this.eth); // Init web3js utils.
      this.networkId = await this.web3.eth.net.getId();
      console.warn(this.networkId);
    } else {
      console.log('you have to install any eth provider first..');
    }
  }

  async requestAccounts() {
    if (this.eth != null) {
      return await this.eth.request({ method: 'eth_requestAccounts' });
    }
  }

  async loadContracts() {
    if (this.web3 != null) {
      this.contracts.tasksContract = await new this.web3.eth.Contract(TasksContract.abi, TasksContract.networks[this.networkId]?.address);
      this.contracts.tasksContract?.setProvider(this.eth);
      console.log(this.contracts);
    }
  }
}
