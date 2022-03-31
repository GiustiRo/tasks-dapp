import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent implements OnInit {
  @Input('task') task: any
  constructor(
    public popoverController: PopoverController
  ) { }

  ngOnInit() {    
    console.warn(this.task);
  }

  submitForm(event){
    event.preventDefault();
    this.popoverController.getTop().then(pop => {
      pop.dismiss(this.task, 'update');
    });
  }

}
