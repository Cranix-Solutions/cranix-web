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

  alive: boolean = true;
  ipAdresses: string[];
  deviceNames = {};
  roomId: number;
  name: string = "";
  device: Device = new Device();
  roomsToSelect: Observable<Room[]>;
  addDeviceForm: FormGroup;
  hwConfs: Observable<Hwconf[]>;
  disabled: boolean = false;

  @Input() addHocRooms: Room[];
  @Input() public rooms: Room;

  constructor(
    public authService: AuthenticationService,
    public deviceService: DevicesService,
    public languageService: LanguageService,
    public modalCtrl: ModalController,
    public objectService: GenericObjectService,
    public roomService: RoomsService,
    private fb: FormBuilder,
    private selfS: SelfManagementService
  ) {

  }

  ngOnInit() {
    console.log('room is, :::', this.rooms);
  }

  public ngAfterViewInit() {
    while (document.getElementsByTagName('mat-tooltip-component').length > 0) { document.getElementsByTagName('mat-tooltip-component')[0].remove(); }
    console.log('After view:', this.addHocRooms);
    if (!this.addHocRooms) {
      console.log('no AddHOC')
      this.addDeviceForm = this.fb.group({
        ip: [, Validators.required],
        name: [],
        roomId: [],
        wlanMac: ['', Validators.pattern(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/)],
        hwconfId: [, Validators.required],
        serial: [''],
        inventary: [''],
        row: [''],
        place: [''],
        mac: ['', Validators.compose([Validators.pattern(/^((([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})))/), Validators.required])],

      });
      this.hwConfs = this.objectService.getObjects('hwconf');
    } else {
      this.addDeviceForm = this.fb.group({
        name: ['', Validators.required],
        mac: ['', Validators.compose([Validators.pattern(/^((([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})))/), Validators.required])],
        ip: [{ value: null, disabled: true }],
        roomId: [{ value: this.addHocRooms[0].id }, Validators.required],
        wlanMac: [{ value: null, disabled: true }],
        hwconfId: [{ value: this.addHocRooms[0].hwconfId, disabled: true }, Validators.required],
        serial: [{ value: null, disabled: true }],
        inventary: [{ value: null, disabled: true }],
        row: [{ value: null, disabled: true }],
        place: [{ value: null, disabled: true }],
      });
      console.log('AddhocRooms', this.addDeviceForm)
    }
    /**this.addDeviceForm.valueChanges.subscribe(() => {
      this.onFormValuesChanged();
    });**/

    if (this.addHocRooms) {
      this.roomsToSelect = this.selfS.getMyRooms();
    } else {
      this.roomsToSelect = this.objectService.getObjects('room');
      if (this.rooms) {
        this.roomId = this.rooms.id;
        this.addDeviceForm.controls['roomId'].patchValue(this.roomId);
        this.addDeviceForm.controls['roomId'].disable();
        this.addDeviceForm.controls['hwconfId'].patchValue(this.rooms.hwconfId);
        this.roomService.getAvailiableIPs(this.roomId)
          .pipe(takeWhile(() => this.alive))
          .subscribe((res) => {
            this.ipAdresses = res;
          })
      }
    }
  }
  onSubmit(devices: Device) {
    console.log('devices', devices);
    this.objectService.requestSent()
    let newDevice = [];
    let macs = devices.mac.split('\n');

    for (let x = 0; x < macs.length; x++) {
      newDevice[x] = {
        name: this.ipAdresses[this.ipAdresses.indexOf(this.ipAdresses.find(item => item.includes(devices.name))) + x].split(' ')[1],
        ip: this.ipAdresses[this.ipAdresses.indexOf(this.ipAdresses.find(item => item.includes(devices.name))) + x].split(' ')[0],
        mac: macs[x],
        hwconfId: devices.hwconfId,
        roomId: this.roomId
      }
    }

    if (this.addHocRooms) {
      console.log('adding Addoc', devices);
      this.selfS.addDevice(devices)
        .pipe(takeWhile(() => this.alive))
        .subscribe((res) => {
          this.objectService.responseMessage(res);
        },
          (err) => { },
          () => this.modalCtrl.dismiss())
    } else {
      this.disabled = true;
      this.roomService.addDevice(newDevice, newDevice[0].roomId)
        .pipe(takeWhile(() => this.alive))
        .subscribe((responses) => {
          let response = this.languageService.trans("List of the results:");
          for (let resp of responses) {
            response = response + "<br>" + this.languageService.transResponse(resp);
          }
          this.objectService.okMessage(response)
        },
          (err) => { },
          () => {
            this.disabled = false;
            this.modalCtrl.dismiss()
          })
    }
  }

  ipChanged(ev) {
    this.addDeviceForm.controls['name'].patchValue(ev.detail.value.split(" ")[1])
  }

  roomChanged(ev) {
    console.log('rooms is: ', ev);
    this.roomId = ev.detail.value;
    this.roomService.getAvailiableIPs(ev.detail.value)
      .pipe(takeWhile(() => this.alive))
      .subscribe((res) => {
        this.ipAdresses = res;
      })
    if (this.addHocRooms) {
      this.addDeviceForm.controls['hwconfId'].patchValue(ev.detail.value);
    }
  }
/**   onFormValuesChanged() {
    console.log('Form value is: ', this.addDeviceForm);
  }**/
  ngOnDestroy() {
    this.alive = false;
  }
}