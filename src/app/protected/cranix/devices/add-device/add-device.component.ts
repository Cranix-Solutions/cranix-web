import { Component, OnInit } from '@angular/core';
//own stuff
import { DevicesService } from 'src/app/services/devices.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { RoomsService } from 'src/app/services/rooms.service';
import { Device, Room } from 'src/app/shared/models/data-model';
import { ModalController, NavParams } from '@ionic/angular';
import { LanguageService } from 'src/app/services/language.service';
import { AuthenticationService } from 'src/app/services/auth.service';

@Component({
  selector: 'cranix-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.scss'],
})
export class AddDeviceComponent implements OnInit {

  ipAdresses: string[] = [];
  deviceNames = {};
  room: Room;
  name: string = "";
  device: Device;

  constructor(
    public authService: AuthenticationService,
    public deviceService: DevicesService,
    public languageS: LanguageService,
    public modalCtrl: ModalController,
    private navParams: NavParams,
    public objectService: GenericObjectService,
    public roomService: RoomsService
  ) { }

  ngOnInit() {
    this.room = this.navParams.get('room');
    if (this.room) {
      this.initValues(this.room.id);
    } else {
      this.initValues(null);
    }
  }

  public ngAfterViewInit() {
    while (document.getElementsByTagName('mat-tooltip-component').length > 0) { document.getElementsByTagName('mat-tooltip-component')[0].remove(); }
  }
  initValues(id: number) {
    this.device = new Device();
    if (id) {
      this.authService.log(id);
      this.ipAdresses = [];
      this.deviceNames = {};
      let sub = this.roomService.getAvailiableIPs(id).subscribe(
        (val) => {
          for (let a of val) {
            let b = a.split(" ");
            this.ipAdresses.push(b[0]);
            this.deviceNames[b[0]] = b[1];
          }
        },
        (err) => { this.authService.log(err) },
        () => { sub.unsubscribe() }
      )
      this.room = this.objectService.getObjectById('room', id);
      this.authService.log(this.room);
      this.device.hwconfId = this.room.hwconfId;
      this.device.roomId = this.room.id;
    }
    if( this.authService.session.mac ) {
      this.device.mac = this.authService.session.mac;
    }
  }
  onSubmit(device: Device) {
    let devices: Device[] = [];
    devices.push(device);
    this.authService.log(devices);
    let subs = this.roomService.addDevice(devices, this.room.id).subscribe(
      (val) => {
        if (val.code == "OK") {
          this.objectService.getAllObject('device');
          this.objectService.okMessage(this.languageS.transResponse(val));
          this.modalCtrl.dismiss();
        } else {
          this.objectService.errorMessage(this.languageS.transResponse(val));
        }
      },
      (err) => {
         this.objectService.errorMessage("ServerError" + err);
         this.authService.log(err);
         },
      () => { subs.unsubscribe() }
    )
  }
  ipChanged(ev) {
    this.device.name = this.deviceNames[ev];
  }
  roomChanged(ev) {
    this.initValues(parseInt(ev));
  }
}
