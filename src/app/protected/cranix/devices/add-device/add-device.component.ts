import { Component, OnInit, Input, OnDestroy } from '@angular/core';
//own stuff
import { DevicesService } from 'src/app/services/devices.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { RoomsService } from 'src/app/services/rooms.service';
import { Device, Room } from 'src/app/shared/models/data-model';
import { ModalController, NavParams } from '@ionic/angular';
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
export class AddDeviceComponent implements OnInit,OnDestroy {

  alive: boolean = true; 
  ipAdresses: Observable<string[]>;
  deviceNames = {};
  roomId: number;
  name: string = "";
  device: Device = new Device();
  roomsToSelect: Observable<Room[]>;
  addDeviceForm: FormGroup;

  @Input() addHocRooms: Room[];
  @Input() public rooms: Room;
  
  constructor(
    public authService: AuthenticationService,
    public deviceService: DevicesService,
    public languageS: LanguageService,
    public modalCtrl: ModalController,
    private navParams: NavParams,
    public objectService: GenericObjectService,
    public roomService: RoomsService,
    private fb: FormBuilder, 
    private selfS: SelfManagementService
  ) { 

    this.addDeviceForm = this.fb.group({
      ip: [, Validators.required],
      name: [''],
      //mac:[this.mac, Validators.required],
      wlanMac: ['',Validators.pattern(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/)],
      hwconfId: [, Validators.required],
      serial: [''],
      inventary: [''],
      row: [''],
      place: [''],
      mac: [' ', Validators.compose([Validators.pattern(/^((([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})))/), Validators.required])],

    });

    /*if(this.addHocRooms){
      console.log('addhocrooms is: ', this.addHocRooms)
      this.roomsToSelect = this.selfS.getMyRooms();
    
      console.log(`AdhocRooms are: ${JSON.stringify(this.roomsToSelect)}`)
    }else {
      this.roomsToSelect = this.roomService.getMYRooms();
      if(!this.rooms){
        this.rooms = this.roomsToSelect[0];
      }
      console.log('rooms is: ', this.rooms)
      this.roomId = this.rooms.id;
      
      console.log(`Rooms are: ${JSON.stringify(this.roomsToSelect)}`)
    }
    console.log('addhoc Room', this.addHocRooms);*/
  }

  ngOnInit() {
    console.log('room is, :::', this.rooms);
   // this.room = this.navParams.get('room');
   /* if (this.addHocRooms.length){
      this.room = this.addHocRooms[0];
      this.initValues(this.addHocRooms[0].id)
   /* }else if(this.addHocRooms.length > 1){
      this.roomsToSelect = this.addHocRooms;
      this.room = this.addHocRooms[0];
    }else if (this.room) {
      this.initValues(this.room.id);
      this.roomsToSelect = this.objectService.selects['roomId'];
    } else{
      this.initValues(null);
      this.roomsToSelect = this.objectService.selects['roomId'];
    }*/
    if(this.addHocRooms){
      console.log('addhocrooms is: ', this.addHocRooms)
      this.roomsToSelect = this.selfS.getMyRooms();
    
      console.log(`AdhocRooms are: ${JSON.stringify(this.roomsToSelect)}`)
    }else {
      this.roomsToSelect = this.roomService.getMYRooms();
      if(this.rooms){
              this.roomId = this.rooms.id;
      }
      console.log('rooms is: ', this.rooms)
      
      console.log(`Rooms are: ${JSON.stringify(this.roomsToSelect)}`)
    }
    console.log('addhoc Room', this.addHocRooms);
  
  }

  public ngAfterViewInit() {
    while (document.getElementsByTagName('mat-tooltip-component').length > 0) { document.getElementsByTagName('mat-tooltip-component')[0].remove(); }
  }
  /*initValues(id: number) {
    this.device = new Device();
    if (id) {
      this.authService.log(id);
      this.ipAdresses = [];
      if(!this.addHocRooms){
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
      }
      this.device.roomId = this.room.id;
    }
    if( this.authService.session.mac ) {
      this.device.mac = this.authService.session.mac;
    }
  }*/
  onSubmit(devices: Device[]) {
   /* let devices: Device[] = [];
    devices.push(device);
    this.authService.log(devices);
    if(this.addHocRooms){
      console.log('addhoc dev is:', device);
      this.selfS.addDevice(device)
          .pipe(takeWhile(() => this.alive ))
          .subscribe((res) => {
            this.objectService.okMessage(res)
            this.modalCtrl.dismiss();
          },
          (err)=> {
            this.objectService.errorMessage("ServerError:" + JSON.stringify(err));
          } )
    } else {
    let subs = this.roomService.addDevice(devices, this.room.id).subscribe(
      (val) => {
        this.objectService.responseMessage(val);
        if (val.code == "OK") {
          this.objectService.getAllObject('device');
          this.modalCtrl.dismiss();
        }
      },
      (err) => {
         this.objectService.errorMessage("ServerError" + err);
         this.authService.log(err);
         },
      () => { subs.unsubscribe() }
    )
  }*/
  }
  ipChanged(ev) {
    console.log('ip change event: ', ev);
    this.addDeviceForm.controls['name'].setValue(ev.split(" ")[1])
    
  }
  roomChanged(ev) {
   // this.initValues(parseInt(ev));
   console.log('rooms is: ', ev);
   this.roomId = ev.detail.value;
   this.ipAdresses = this.roomService.getAvailiableIPs(ev.detail.value)
  }

  ngOnDestroy(){
    this.alive = false;
  }
}
