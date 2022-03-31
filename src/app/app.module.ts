import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { Web3clientService } from './services/web3client.service';
import { CommonModule } from '@angular/common';
import { TaskFormComponent } from './tasks/task-form/task-form.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, TaskFormComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, CommonModule, FormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, Web3clientService],
  bootstrap: [AppComponent],
})
export class AppModule {}
