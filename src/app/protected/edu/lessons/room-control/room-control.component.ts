import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/auth.service';
import { Room } from 'src/app/shared/models/data-model';
import { EductaionService } from 'src/app/services/education.service';
import { takeWhile } from 'rxjs/operators';
import { PopoverController, IonSelect, ModalController } from '@ionic/angular';
import { ActionsComponent } from 'src/app/shared/actions/actions.component';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { FilesCollectComponent } from 'src/app/shared/actions/files-collect/files-collect.component';
import { FilesUploadComponent } from 'src/app/shared/actions/files-upload/files-upload.component';
@Component({
  selector: 'cranix-room-control',
  templateUrl: './room-control.component.html',
  styleUrls: ['./room-control.component.scss'],
})
export class RoomControlComponent implements OnInit, OnDestroy, AfterViewInit {
  direct: boolean;
  login: boolean;
  portal: boolean;
  printing: boolean;
  proxy: boolean;
  setExceptionsModalIsOpen: boolean = false;
  allowedDomains: string;

  gridSize: number = 2;
  @ViewChild('selectRoom') selectRef: IonSelect;

  gridSizes = [1, 2, 3, 4, 6, 12]

  constructor(
    public authS: AuthenticationService,
    public eduS: EductaionService,
    public popoverCtrl: PopoverController,
    public modalController: ModalController,
    private objectS: GenericObjectService
  ) {
    this.eduS.getMyRooms();
  }
  ngOnInit() {
    this.eduS.selectedRoom = null;
    if (this.authS.isMD()) {
      this.gridSize = 12
    }
  }


  ngAfterViewInit() {
    if (this.authS.session.roomId) {
      let room: Room = this.objectS.getObjectById('room', this.authS.session.roomId);
      if (room.roomControl == 'inRoom') {
        this.eduS.selectedRoom = room;
      }
    }
    if (this.eduS.selectedRoom) {
      this.eduS.disableChange = false;
      this.eduS.alive = true;
      this.eduS.getEduRoomStatus(true);
      this.eduS.statusTimer();
    } else {
      this.selectRef.open();
    }
  }


  sizeChange(ev) {
    console.log('event is: ', ev);
  }
  roomSelected(){
    if (this.eduS.selectedRoom) {
      console.log("selectRooms returned")
      this.eduS.disableChange = false;
      this.eduS.alive = true;
      this.eduS.getEduRoomStatus(true);
      this.eduS.statusTimer();
    }
  }

  /**
   * Opens an action menue for the content
   * @param ev
   */
  async openAction(ev) {
    const popover = await this.popoverCtrl.create({
      component: ActionsComponent,
      event: ev,
      componentProps: {
        objectType: "education/room",
        objectIds: [this.eduS.room.id]
      },
      animated: true,
      showBackdrop: true
    });
    (await popover).present();
  }

  allowDomains(){
    this.eduS.allowDomains(this.allowedDomains.split("\n"))
    this.setExceptionsModalIsOpen = false;
  }
  
  setAccess(type: string) {
    this.objectS.requestSent();
    this.eduS.disableChange = true;
    switch (type) {
      case 'login':
        this.eduS.room.accessInRooms.login = !this.eduS.room.accessInRooms.login;
        break;
      case 'proxy':
        this.eduS.room.accessInRooms.proxy = !this.eduS.room.accessInRooms.proxy;
        break;
      case 'direct':
        this.eduS.room.accessInRooms.direct = !this.eduS.room.accessInRooms.direct;
        break;
      case 'printing':
        this.eduS.room.accessInRooms.printing = !this.eduS.room.accessInRooms.printing;
        break;
    }
    this.eduS.setAccessStatus(this.eduS.room.accessInRooms)
      .pipe(takeWhile(() => this.eduS.alive))
      .subscribe({
        next: (res) => {
          this.eduS.disableChange = false;
          this.objectS.responseMessage(res);
        },
        error: (err) => {
          this.objectS.errorMessage(err);
        }
      })
  }

  /**
   * Share the files in the room.
   */
  async onBTNSHARE() {
    const modal = await this.modalController.create({
      component: FilesUploadComponent,
      cssClass: 'small-modal',
      animated: true,
      showBackdrop: true,
      componentProps: {
        objectType: "room",
        actionMap: { objectIds: [this.eduS.selectedRoom.id] }
      }
    });
    (await modal).present();
  }
  /*
   *  Collect the files from the room
   */
  async onBTNCOLLECT() {
    const modal = await this.modalController.create({
      component: FilesCollectComponent,
      cssClass: 'small-modal',
      animated: true,
      showBackdrop: true,
      componentProps: {
        objectType: "room",
        actionMap: { objectIds: [this.eduS.selectedRoom.id] }
      }
    });
    (await modal).present();
    console.log('collect')
  }

  ngOnDestroy() {
    this.eduS.destroyEduRoom();
  }
}
