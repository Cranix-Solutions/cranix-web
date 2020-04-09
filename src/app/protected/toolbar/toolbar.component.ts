import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
//Own module
import { AuthenticationService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';

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
    public authService: AuthenticationService,
    public alertController: AlertController,
    public translateService: LanguageService
  ) {
    this.commonName = authService.session.commonName;
    this.roomName        = authService.session.roomName;
    this.instituteName  = authService.session.instituteName;
  }

  ngOnInit() { }

  async logOut() {
    const alert = await this.alertController.create({
      header:  this.translateService.trans('Confirm!'),
      message: this.translateService.trans('Do you realy want to logout?'),
      buttons: [
        {
          text: this.translateService.trans('Cancel'),
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

  closeWindow() {}
}
