import { Component, OnInit, Input, OnDestroy } from '@angular/core';
//own stuff
import { DevicesService } from 'src/app/services/devices.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { RoomsService } from 'src/app/services/rooms.service';
import { Device, Room, Hwconf } from 'src/app/shared/models/data-model';
import { ModalController, NavParams } from '@ionic/angular';
import { LanguageService } from 'src/app/services/language.service';
import { AuthenticationService } from 'src/app/services/auth.service';
import { SelfManagementService } from 'src/app/services/selfmanagement.service';
import { takeWhile } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HwconfsService } from 'src/app/services/hwconfs.service';
import { from } from 'rxjs';
import { forkJoin } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'cranix-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.scss'],
})
export class AddDeviceComponent implements OnInit,OnDestroy {

  alive: boolean = true; 
  ipAdresses: string[];
  deviceNames = {};
  roomId: number;
  name: string = "";
  device: Device = new Device();
  roomsToSelect: Observable<Room[]>;
  addDeviceForm: FormGroup;
  hwConfs: Observable<Hwconf[]>;

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
    private hwConfS: HwconfsService,
    private selfS: SelfManagementService
  ) { 

    /*if(!this.addHocRooms){

      console.log('no AddHOC')
    this.addDeviceForm = this.fb.group({
      ip: [, Validators.required],
      name: [],
      roomId:[],
      //mac:[this.mac, Validators.required],
      wlanMac: ['',Validators.pattern(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/)],
      hwconfId: [, Validators.required],
      serial: [''],
      inventary: [''],
      row: [''],
      place: [''],
      mac: ['', Validators.compose([Validators.pattern(/^((([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})))/), Validators.required])],
      
    });
    this.hwConfs = this.objectService.getObjects('hwconf');/*getHWConfs()
        .pipe(takeWhile(() => this.alive ))
        .subscribe((res) => {
          this.hwConfs = res;
        })*
   // this.hwConfs = this.hwConfS.getHWConfs();
    }else {
      this.addDeviceForm = this.fb.group({
        name: ['', Validators.required],
        //mac:[this.mac, Validators.required],
        mac: ['', Validators.compose([Validators.pattern(/^((([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})))/), Validators.required])],
        ip: [{value: null, disabled: true}],
        roomId:[{value: this.addHocRooms[0].id, disabled: true}, Validators.required],
        wlanMac: [{value: null, disabled: true}],
        hwconfId: [{value: this.addHocRooms[0].hwconfId, disabled : true}, Validators.required],
        serial:[{value: null, disabled: true}],
        inventary: [{value: null, disabled: true}],
        row: [{value: null, disabled: true}],
        place: [{value: null, disabled: true}],
      });
      console.log('AddhocRooms', this.addDeviceForm)
    }
    this.addDeviceForm.valueChanges.subscribe(() => {
      this.onFormValuesChanged();
    });*/

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
   
  //  console.log('addhoc Room', this.addHocRooms);
  
  }

  public ngAfterViewInit() {
    while (document.getElementsByTagName('mat-tooltip-component').length > 0) { document.getElementsByTagName('mat-tooltip-component')[0].remove(); }
    console.log('After view:', this.addHocRooms); 
    if(!this.addHocRooms){

      console.log('no AddHOC')
    this.addDeviceForm = this.fb.group({
      ip: [, Validators.required],
      name: [],
      roomId:[],
      //mac:[this.mac, Validators.required],
      wlanMac: ['',Validators.pattern(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/)],
      hwconfId: [, Validators.required],
      serial: [''],
      inventary: [''],
      row: [''],
      place: [''],
      mac: ['', Validators.compose([Validators.pattern(/^((([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})))/), Validators.required])],
      
    });
    this.hwConfs = this.objectService.getObjects('hwconf');/*getHWConfs()
        .pipe(takeWhile(() => this.alive ))
        .subscribe((res) => {
          this.hwConfs = res;
        })*/
   // this.hwConfs = this.hwConfS.getHWConfs();
    }else {
      this.addDeviceForm = this.fb.group({
        name: ['', Validators.required],
        //mac:[this.mac, Validators.required],
        mac: ['', Validators.compose([Validators.pattern(/^((([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})))/), Validators.required])],
        ip: [{value: null, disabled: true}],
        roomId:[{value: this.addHocRooms[0].id}, Validators.required],
        wlanMac: [{value: null, disabled: true}],
        hwconfId: [{value: this.addHocRooms[0].hwconfId, disabled : true}, Validators.required],
        serial:[{value: null, disabled: true}],
        inventary: [{value: null, disabled: true}],
        row: [{value: null, disabled: true}],
        place: [{value: null, disabled: true}],
      });
      console.log('AddhocRooms', this.addDeviceForm)
    }
    this.addDeviceForm.valueChanges.subscribe(() => {
      this.onFormValuesChanged();
    });
    
    if(this.addHocRooms){
     // console.log('addhocrooms is: ', this.addHocRooms)
      this.roomsToSelect = this.selfS.getMyRooms();
    
    //  console.log(`AdhocRooms are: ${JSON.stringify(this.roomsToSelect)}`)
    }else {
      this.roomsToSelect = this.objectService.getObjects('room');
      if(this.rooms){
              this.roomId = this.rooms.id;
              this.addDeviceForm.controls['roomId'].patchValue(this.roomId);
              this.addDeviceForm.controls['roomId'].disable() ; 
              this.addDeviceForm.controls['hwconfId'].patchValue(this.rooms.hwconfId);
              this.roomService.getAvailiableIPs(this.roomId)
                  .pipe(takeWhile( ()=> this.alive))
                  .subscribe((res) => {
                    this.ipAdresses = res; 
                  })
      }
   //   console.log('rooms is: ', this.rooms)
      
   //   console.log(`Rooms are: ${JSON.stringify(this.roomsToSelect)}`)
    }
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
  onSubmit(devices: Device) {
    console.log('devices', devices);
    this.objectService.requestSent()
    let macs; 
    let newDevice = [];
    if (devices.mac.indexOf('\n')){
       macs = devices.mac.split('\n');      
    }
    console.log('macs are: ', macs);
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
  if (macs.length > 1 && !this.addHocRooms){
    for(let x = 0; x < macs.length; x++)
    { 

      newDevice[x] = {
        name     : this.ipAdresses[this.ipAdresses.indexOf(this.ipAdresses.find( item => item.includes(devices.name))) + x].split(' ')[1],
        ip       : this.ipAdresses[this.ipAdresses.indexOf(this.ipAdresses.find( item => item.includes(devices.name))) + x].split(' ')[0],
        mac      : macs[x],
        hwconfId : devices.hwconfId,
        roomId : this.roomId
      }  
          // names.push(this.avaiIPs[x].split(' ')[1]);
          // ips.push(this.avaiIPs[x].split(' ')[0]);
          // macs.push(this.macs[x])        
    }
    /*this.multiDev = {
      name: names,
      ips: ips,
      mac: macs,
      hwconfId : dev.hwconfId
    }
    console.log("multidev: ", this.multiDev);*/

 } else if(!this.addHocRooms) {
 //  console.log("this is device", dev)
   devices.ip = devices.ip.split(" ")[0];
   newDevice.push(devices);
 }


 console.log("das ist dev array: ", newDevice);

    if(!this.addHocRooms){
      if(newDevice.length > 1){
        let devs = from(newDevice);
       // let devs = new Observable(newDevice)
       devs.pipe(mergeMap( dev => {
         console.log('devs are', dev);
         let arr = [dev];
         return this.roomService.addDevice(arr,dev.roomId)
       } )).pipe(takeWhile(() => this.alive ))
       .subscribe((res) => {
         this.objectService.responseMessage(res);
       },
       (err)=>{},
       () => this.modalCtrl.dismiss())

      /*  devs.mergeMap(dev => {
          console.log('dev: ', dev)
         // return this.roomService.addDevice(dev,dev.roomId)
        })
          .pipe(takeWhile(() => this.alive ))
          .subscribe((res) => {
            this.objectService.responseMessage(res);
          })*/
      }
      }else { 
        console.log('adding Addoc',devices);
        this.selfS.addDevice(devices)
        .pipe(takeWhile(() => this.alive ))
        .subscribe((res) => {
          this.objectService.responseMessage(res);
        },
        (err)=>{},
        () => this.modalCtrl.dismiss())
      }
    }
  
  
  ipChanged(ev) {
    console.log('ip change event: ', ev);
    console.log('split ip: ', ev.detail.value.split(" ")[0]);
   // this.addDeviceForm.controls['ip'].patchValue(ev.detail.value.split(" ")[0])
    this.addDeviceForm.controls['name'].patchValue(ev.detail.value.split(" ")[1])
  //  this.addDeviceForm.controls['name'].setValue(ev.detail.value.split(" ")[1])

  }
  roomChanged(ev) {
   // this.initValues(parseInt(ev));
   console.log('rooms is: ', ev);
   this.roomId = ev.detail.value;
   this.roomService.getAvailiableIPs(ev.detail.value)
       .pipe(takeWhile(() => this.alive ))
       .subscribe((res) => {
         this.ipAdresses = res;
        })
        if(this.addHocRooms){
          this.addDeviceForm.controls['hwconfId'].patchValue(ev.detail.value);
        }
  }

  onFormValuesChanged() {
    console.log('Form value is: ', this.addDeviceForm);
  }
  ngOnDestroy(){
    this.alive = false;
  }
}
