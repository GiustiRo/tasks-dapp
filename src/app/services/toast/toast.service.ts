import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private toast: ToastController
  ) { }

  showToast(type: string = 'success', message: string = 'Acción realizada exitosamente!') { // Better to move to a toast service component.
    if(message && message.length > 70){
      message = message.slice(0, 70);
      message = message.concat(' ... ')
    }
    this.toast.create({
      message: message,
      icon: type == 'danger'? 'alert-circle-outline': 'checkmark-circle-outline',
      position: 'bottom',
      color: type,
      duration: 3000,
      buttons: [{icon: 'close-outline'}]
      }).then(x => x.present());
  }
}
