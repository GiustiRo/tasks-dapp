import { Component } from '@angular/core';
import { Web3clientService } from './services/web3client.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private web3client: Web3clientService) {
    this.web3client.initWeb3();
  }
}
