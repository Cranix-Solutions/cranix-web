import { Component, OnInit, OnDestroy, ViewChild, AfterContentInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { AuthenticationService } from 'src/app/services/auth.service';
import { Room, AccessStatus, AccessInRooms, SmartRoom, EduRoom } from 'src/app/shared/models/data-model';
import { EductaionService } from 'src/app/services/education.service';
import { takeWhile } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { TranslateService } from '@ngx-translate/core';
import { PopoverController,IonSelect } from '@ionic/angular';
import { ActionsComponent } from 'src/app/shared/actions/actions.component';
import { JsonPipe } from '@angular/common';
import { GenericObjectService } from 'src/app/services/generic-object.service';

@Component({
  selector: 'cranix-room-control',
  templateUrl: './room-control.component.html',
  styleUrls: ['./room-control.component.scss'],
})
export class RoomControlComponent implements OnInit,OnDestroy,AfterViewInit {

  alive = true;

  direct: boolean;
  login: boolean;
  portal: boolean;
  printing: boolean;
  proxy: boolean;

  devices = [1,2,3,4,5,6]
  room : EduRoom; 

  selectedRoomId: number; 

  rooms : Observable<Room[]>;

  gridSize : number; 
  @ViewChild('roomSelect') selectRef: IonSelect;


  gridSizes = [ 1,2,3,4,5,6,7,8,9,10,11,12]

  constructor(private authS: AuthenticationService,
              private eduS: EductaionService,
              public popoverCtrl: PopoverController,
              private translateS: TranslateService,
              private objectS: GenericObjectService
              ) {
    this.rooms = this.eduS.getMyRooms();

  
              }
  ngOnInit() {
   
      console.log(`Room on init: ${this.room}`)
     /* this.eduS.getMyRooms()
      .pipe(takeWhile( () => this.alive ))
      .subscribe(res => {
        console.log('my rooms are: ', res);
        this.myRooms = res
      });*/
  }

  ngAfterViewInit(){

    if (this.authS.session.roomId){
      this.eduS.getRoomById(parseInt(this.authS.session.roomId))
          .pipe(takeWhile( () => this.alive ))
          .subscribe(res => {
            this.room = res
          });
          
    }else if(!this.room && !this.authS.session.roomId) {
      console.log(`Room afterViewChecked: ${this.room}`)
      this.openSelect();
    /*  this.eduS.getRoomById(9)
      .pipe(takeWhile( () => this.alive ))
      .subscribe(res => {
        this.room = res
      });*/
    }
  }
  array(n: number): any[] {
    return Array(n);
  }

  sizeChange(ev){
    console.log('event is: ', ev);
  }
  click(){
    console.log("Cliked");
  }

  getDevice(r,p){
  //  console.log(`Device at row: ${r} and place: ${p} is: ${this.room.devices.find(e => e.row === r && e.place === p)}`)
    return this.room.devices.find(e => e.row === r && e.place === p);
  }

  selectChanged(ev){
    console.log(`Select roomId is: ${this.selectedRoomId}`)
    this.eduS.getRoomById(this.selectedRoomId)
    .pipe(takeWhile( () => this.alive ))
    .subscribe(res => { 	
      this.room = res
      console.log('Room is:', this.room);
    })
    //this.eduS.getRoomById()
  }
  openSelect(){
    this.selectRef.open();
  }
  async openAction() {
  
    const popover = await this.popoverCtrl.create({
      component: ActionsComponent,
     // event: ev,
      componentProps: {
        type: "room",
        roomId: this.room.id,
        //selection: this.selected
      },
      animated: true,
      showBackdrop: true
    });
    (await popover).present();
  }
  setAccess() {
    let status: AccessInRooms = {
      accessType: "FW",
      roomId: this.room.id,
      printing: this.room.accessInRooms.printing,
      proxy: this.room.accessInRooms.proxy,
      portal: this.room.accessInRooms.portal,
      direct: this.room.accessInRooms.direct,
      login: this.room.accessInRooms.login
    }
    console.log('fw status is', status);
    this.eduS.setAccessStatus(status)
      .pipe(takeWhile(() => this.alive))
      .subscribe((res) => {
        console.log(res);
        this.objectS.responseMessage(res);
        /*
        if (res.code === "OK") {
          this.translateS.get(res.value)
            .subscribe((res) => {
             // this.notify.success(res);
              console.log(res);
            })
        } else if (res.code === "ERROR") {
          this.translateS.get(res.value)
            .subscribe((res) => {
            //  this.notify.error(res);
            console.log(res);

            })
        }*/
      }, err => {
        this.objectS.errorMessage(err);
        //this.notify.error(err.message);
      })
  }

  onBTNSHARE(){
    console.log('share')
  }
  onBTNCOLLECT(){
    console.log('collect')
  }
  ngOnDestroy(){
    this.alive = false; 
  }
}
