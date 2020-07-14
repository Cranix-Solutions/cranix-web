import { Component, OnInit, Input } from '@angular/core';
import { AlertController, PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { EductaionService } from 'src/app/services/education.service';
import { devActionMenu } from '../objects.menus';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'cranix-dev-power',
  templateUrl: './dev-power.component.html',
  styleUrls: ['./dev-power.component.scss'],
})
export class DevPowerComponent implements OnInit {

  alive = true; 
  menu: any[] = [];

  @Input() type;
  @Input() id;
  
  constructor(
    public alertController: AlertController,
    private popoverController: PopoverController,
    private translateService: TranslateService,
    private eduS: EductaionService

  ) {

    this.menu = devActionMenu
    
  }

  ngOnInit() {

  }

  async messages(ev: string){
    const alert = await this.alertController.create({
    //  header: this.translateService.instant(ev),
      buttons: [
        {
          text: this.translateService.instant('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: this.translateService.instant('OK'),
          handler: () => {
            this.executeAction(ev)
            console.log('Confirm Okay');
          }
        }
      ]
    });
    alert.onDidDismiss().then(() => this.popoverController.dismiss());
    await alert.present();
  }

  executeAction(action){
    this.eduS.applyPower(this.type,this.id,action)
        .pipe(takeWhile(() => this.alive))
        .subscribe((res) => {
          console.log(`Result ist: ${res}`)
        })
  }
  ngOnDestroy(){
    this.alive = false;
  }
}
