import { Component, OnInit, Input, OnDestroy } from '@angular/core';
//own stuff
import { DevicesService } from 'src/app/services/devices.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { RoomsService } from 'src/app/services/rooms.service';
import { Device, Room, Hwconf } from 'src/app/shared/models/data-model';
import { ModalController } from '@ionic/angular';
import { LanguageService } from 'src/app/services/language.service';
import { AuthenticationService } from 'src/app/services/auth.service';
import { SelfManagementService } from 'src/app/services/selfmanagement.service';
import { takeWhile } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'cranix-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.scss'],
})
export class AddDeviceComponent implements OnInit, OnDestroy {

  selectedRoom: Room;
  device: Device = new Device();
  alive: boolean = true;
  ipAdresses: string[];
  deviceNames = {};
  name: string = "";
  roomsToSelect: Room[] = [];
  addDeviceForm: FormGroup;
  hwConfs: Observable<Hwconf[]>;
  disabled: boolean = false;
  macOk = true;

  @Input() public adHocRoom: boolean;
  constructor(
    public authService: AuthenticationService,
    public deviceService: DevicesService,
    public languageService: LanguageService,
    public modalCtrl: ModalController,
    public objectService: GenericObjectService,
    public roomService: RoomsService,
    private selfS: SelfManagementService
  ) {
  }

  ngOnInit() {
    //Preset mac if any.
    if( this.authService.session.mac ) {
      this.device.mac = this.authService.session.mac;
    }
    this.objectService.getObjects('hwconf').subscribe(obj => this.hwConfs = obj);
    console.log('room is, :::', this.objectService.selectedRoom);
    if (this.adHocRoom) {
      this.selfS.getMyRooms().subscribe(
        (val) => { this.roomsToSelect = val; }
      )
    } else {
      if (this.objectService.selectedRoom) {
        this.selectedRoom = this.objectService.selectedRoom;
        this.roomChanged(this.selectedRoom)
      } else {
        this.roomService.getRoomsToRegister().subscribe(
          (val) => { this.roomsToSelect = val; }
        )
      }
    }
  }

  public ngAfterViewInit() {
    while (document.getElementsByTagName('mat-tooltip-component').length > 0) { document.getElementsByTagName('mat-tooltip-component')[0].remove(); }
    console.log('After view:', this.adHocRoom);
  }

  onSubmit() {
    console.log('this.device', this.device);
    this.objectService.requestSent()
    this.disabled = true;
    if (this.adHocRoom) {
      console.log('adding Addoc', this.device);
      this.selfS.addDevice(this.device)
        .pipe(takeWhile(() => this.alive))
        .subscribe((res) => {
          this.objectService.responseMessage(res);
          if (res.code == "OK") {
            this.modalCtrl.dismiss();
          }
        },
          (err) => { },
          () => { this.disabled = false; })
    } else {
      let newDevice = [];
      let macs = this.device.mac.split('\n');
      let startIndex = this.ipAdresses.indexOf(this.device.ip);
      if (macs.length == 1) {
        newDevice[0] = {
          name: this.device.name,
          ip: this.ipAdresses[startIndex].split(' ')[0],
          mac: macs[0],
          hwconfId: this.device.hwconfId,
          roomId: this.device.roomId,
          serial: this.device.serial,
          inventary: this.device.inventary,
          row: this.device.row,
          place: this.device.place
        }
      } else {
        for (let x = 0; x < macs.length; x++) {
          newDevice[x] = {
            name: this.ipAdresses[startIndex + x].split(' ')[1],
            ip: this.ipAdresses[startIndex + x].split(' ')[0],
            mac: macs[x],
            hwconfId: this.device.hwconfId,
            roomId: this.device.roomId
          }
        }
      }
      console.log(newDevice, this.device.roomId)
      this.roomService.addDevice(newDevice, this.device.roomId)
        .pipe(takeWhile(() => this.alive))
        .subscribe((responses) => {
          let response = this.languageService.trans("List of the results:");
          for (let resp of responses) {
            response = response + "<br>" + this.languageService.transResponse(resp);
          }
          this.objectService.okMessage(response)
          this.objectService.getAllObject('device');
        },
          (err) => {
            this.objectService.errorMessage(err)
          },
          () => {
            this.disabled = false;
            this.modalCtrl.dismiss()
          })
    }
  }

  ipChanged(ev) {
    this.device.name=ev.detail.value.split(" ")[1];
  }

  roomChanged(room) {
    console.log('rooms is: ', room);
    this.device.roomId = room.id;
    this.device.hwconfId = room.hwconfId;
    if (!this.adHocRoom) {
      this.roomService.getAvailiableIPs(room.id)
        .pipe(takeWhile(() => this.alive))
        .subscribe((res) => {
          this.ipAdresses = res;
        })

    }
  }

  checkMac(ev) {
    let ok = true;
    let pattern=/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/;
    let line: string;
    for(line of ev.detail.value.split('\n') ){
      if(!line.match(pattern) ) {
        ok = false;
        break;
      }
    }
    this.macOk = ok;
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
