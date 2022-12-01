import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Device } from 'src/app/shared/models/data-model';
import { ActionsComponent } from 'src/app/shared/actions/actions.component';
import { ModalController, PopoverController } from '@ionic/angular';
import { Subscription, interval } from 'rxjs';
import { takeWhile } from 'rxjs/internal/operators/takeWhile';
import { EductaionService } from 'src/app/services/education.service';
import { WindowRef } from 'src/app/shared/models/ohters'

@Component({
  selector: 'cranix-roomdev',
  templateUrl: './roomdev.component.html',
  styleUrls: ['./roomdev.component.scss'],
})
export class RoomDevComponent implements OnInit, OnDestroy {

  @Input() device: Device;
  @Input() row: number;
  @Input() place: number;
  screenShot;
  devStatusSub: Subscription;
  alive: boolean = true;
  nativeWindow: any;
  id;

  constructor(
    public win: WindowRef,
    public popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    public eduService: EductaionService
  ) {
    this.nativeWindow = win.getNativeWindow();
  }

  ngOnInit() {
    this.id = this.row.toString() + '-' + this.place.toString()
    if (this.device) {
      this.getScreen();
      this.devStatusSub = interval(5000).pipe(takeWhile(() => this.alive)).subscribe((func => {
        this.getScreen();
      }))
    }
  }

  getScreen() {
    this.screenShot = "data:image/jpg;base64," + this.device.screenShot;
  }

  drop(event){
    console.log(this.row,this.place,event.item.data)
    if(event.item.data){
      if(this.device) {
        this.device.row   = event.item.data.row
        this.device.place = event.item.data.place
      }
      event.item.data.row   = this.row + 1;
      event.item.data.place = this.place + 1;
      this.eduService.placeDeviceById(event.item.data.id,event.item.data).subscribe(
        (val1) => {
          console.log(val1)
          if(this.device){
            this.eduService.placeDeviceById(this.device.id,this.device).subscribe(
              (val2) => { 
                this.eduService.alive = true
                console.log(val2)
              }
            )
          } else {
            this.eduService.alive = true
          }
        }
      ) 
    } else {
      this.eduService.alive = true
    }
  }

  stopRefresh(){
    this.eduService.alive = false
  }
  showScreen() {
    var hostname = window.location.hostname;
    var protocol = window.location.protocol;
    var port = window.location.port;
    sessionStorage.setItem('screenShot', this.screenShot);
    sessionStorage.setItem('deviceName', this.device.name);
    sessionStorage.setItem('userName', this.device.loggedInName);
    if (port) {
      this.nativeWindow.open(`${protocol}//${hostname}:${port}`);
      sessionStorage.removeItem('shortName');
    } else {
      this.nativeWindow.open(`${protocol}//${hostname}`);
      sessionStorage.removeItem('shortName');
    }
    sessionStorage.removeItem('screenShot');
    sessionStorage.removeItem('deviceName');
    sessionStorage.removeItem('userName');
  }
  async openAction(ev) {
    const popover = await this.popoverCtrl.create({
      component: ActionsComponent,
      event: ev,
      componentProps: {
        objectType: "education/device",
        objectIds: [this.device.id]
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
