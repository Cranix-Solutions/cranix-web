import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
//Own module
import { AuthenticationService } from '../../services/auth.service';

@Component({
  selector: 'cranix-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {

  roomName: string = "";
  commonName: string = "";
  instituteName: string = "";
  constructor(
    private authService: AuthenticationService,
    public alertController: AlertController
  ) {
    this.commonName = authService.session.commonName;
    this.roomName        = authService.session.roomName;
    this.instituteName  = authService.session.instituteName;
  }

  ngOnInit() { }

  async logOut() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Do you realy want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'OK',
          handler: () => {
            this.authService.logout();
          }
        }
      ]
    });
    await alert.present();
  }
}
