import { Component, OnInit, OnDestroy } from '@angular/core';
import { SelfManagementService } from 'src/app/services/selfmanagement.service';
import { takeWhile } from 'rxjs/internal/operators/takeWhile';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { ModalController } from '@ionic/angular';
import { AddDeviceComponent } from 'src/app/protected/cranix/devices/add-device/add-device.component';

@Component({
  selector: 'cranix-my-devices',
  templateUrl: './my-devices.component.html',
  styleUrls: ['./my-devices.component.scss'],
})
export class MyDevicesComponent implements OnInit, OnDestroy {

  alive: boolean = true;

  myDevs;
  constructor(private selfS: SelfManagementService,
    public modalCtrl: ModalController,
    public objectService: GenericObjectService) {

  }

  ngOnInit() {
    this.myDevs = this.selfS.getMyDevices()
  }

  deleteDev(dev: number) {
    this.selfS.removeDevice(dev)
      .pipe(takeWhile(() => this.alive))
      .subscribe((res) => {
        this.objectService.responseMessage(res)
        this.myDevs = this.selfS.getMyDevices()
      }, (err) => {
        this.objectService.errorMessage(err);
      })
  }

  async addDevice(ev: Event) {
    const modal = await this.modalCtrl.create({
      component: AddDeviceComponent,
      cssClass: 'small-modal',
      componentProps: {
        adHocRoom: true
      },
      animated: true,
      swipeToClose: true,
      backdropDismiss: false
    });
    modal.onDidDismiss().then((data) => {
      this.myDevs = this.selfS.getMyDevices()
    });
    return await modal.present();
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
