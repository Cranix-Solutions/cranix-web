import { Component, OnInit, Input } from '@angular/core';
import { Device } from 'src/app/shared/models/data-model';
import { ActionsComponent } from 'src/app/shared/actions/actions.component';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'cranix-roomdev',
  templateUrl: './roomdev.component.html',
  styleUrls: ['./roomdev.component.scss'],
})
export class RoomDevComponent implements OnInit {

  @Input() index: number;
  @Input() device: Device;
  @Input() row: number;
  @Input() place: number;

  screenShot;

  constructor(public popoverCtrl: PopoverController,
  ) { }

  ngOnInit() {
    if (this.device) {
      this.getScreen();
    }
  }

  getScreen() {
    this.screenShot = "data:image/jpg;base64," + this.device.screenShot;
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
}
