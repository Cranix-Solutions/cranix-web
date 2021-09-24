import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Device } from 'src/app/shared/models/data-model';
import { ActionsComponent } from 'src/app/shared/actions/actions.component';
import { ModalController, PopoverController } from '@ionic/angular';
import { Subscription, interval } from 'rxjs';
import { takeWhile } from 'rxjs/internal/operators/takeWhile';
import { ShowScreenComponent } from 'src/app/shared/show-screen/show-screen.component';

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

  constructor(
    public popoverCtrl: PopoverController,
    public modalCtrl: ModalController
  ) { 
  }

  ngOnInit() {
    if (this.device) {
      this.devStatusSub = interval(5000).pipe(takeWhile(() => this.alive)).subscribe((func => {
        this.getScreen();
      }))
    }
  }

  getScreen() {
    this.screenShot = "data:image/jpg;base64," + this.device.screenShot;
  }

  async showScreen() {
    const modal = await this.modalCtrl.create({
      component: ShowScreenComponent,
      cssClass: 'big-modal',
      animated: true,
      swipeToClose: true,
      showBackdrop: true,
      componentProps: {
        device: this.device
      },
    });
    (await modal).present();console.log(this.device)
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
