import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Device } from 'src/app/shared/models/data-model';
import { ActionsComponent } from 'src/app/shared/actions/actions.component';
import { ModalController, PopoverController } from '@ionic/angular';
import { Subscription, interval } from 'rxjs';
import { takeWhile } from 'rxjs/internal/operators/takeWhile';
import { EductaionService } from 'src/app/services/education.service';

@Component({
  selector: 'cranix-roomdev',
  templateUrl: './roomdev.component.html',
  styleUrls: ['./roomdev.component.scss'],
})
export class RoomDevComponent implements OnInit,OnDestroy {

  @Input() index:  number;
  @Input() device: Device;
  @Input() row:    number;
  @Input() place:  number;

  screenShot;

  devStatusSub: Subscription;
  alive:        boolean = true;
  nativeWindow: any;

  constructor(
    public popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    public eduService: EductaionService
  ) {
  }

  ngOnInit() {
    if (this.device) {
      this.getScreen();
      this.devStatusSub = interval(5000).pipe(takeWhile(() => this.alive)).subscribe((func => {
        this.getScreen();
      }))
    }
  }

  getScreen() {
    this.screenShot = "data:image/jpg;base64," + this.device.screenShot;
  }

  showScreen(){
    sessionStorage.setItem('screenShot', this.screenShot);
    sessionStorage.setItem('deviceName', this.device.name);
    sessionStorage.setItem('userName', this.device.loggedInName);
    window.open('/public/showScreen');
    sessionStorage.removeItem('screenShot')
  }
  async openAction(ev) {
    const popover = await this.popoverCtrl.create({
      component: ActionsComponent,
      event: ev,
      componentProps: {
        objectType: "education/device",
        objectIds: [ this.device.id ]
      },
      animated: true,
      showBackdrop: true
    });
    (await popover).present();
  }
  ngOnDestroy() {
    this.alive = false;
  }
}
