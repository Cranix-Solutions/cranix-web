import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Device } from 'src/app/shared/models/data-model';
import { ActionsComponent } from 'src/app/shared/actions/actions.component';
import { PopoverController } from '@ionic/angular';
import { Subscription, interval } from 'rxjs';
import { takeWhile } from 'rxjs/internal/operators/takeWhile';

@Component({
  selector: 'cranix-roomdev',
  templateUrl: './roomdev.component.html',
  styleUrls: ['./roomdev.component.scss'],
})
export class RoomDevComponent implements OnInit,OnDestroy {

  @Input() index: number;
  @Input() device: Device;
  @Input() row: number;
  @Input() place: number;

  screenShot;
  userId;

  devStatusSub: Subscription;
  alive : boolean = true; 

  constructor(public popoverCtrl: PopoverController,
  ) { }

  ngOnInit() {
    if (this.device) {
      this.devStatusSub = interval(3000).pipe(takeWhile(() => this.alive)).subscribe((func => {
        this.getScreen();
      }))
      
    }
  }

  
  getScreen() {
    this.screenShot = "data:image/jpg;base64," + this.device.screenShot;
    this.userId = this.device.loggedInId;
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
