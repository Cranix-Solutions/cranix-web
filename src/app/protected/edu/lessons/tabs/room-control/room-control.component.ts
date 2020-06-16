import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'src/app/services/auth.service';
import { Room, AccessStatus } from 'src/app/shared/models/data-model';
import { EductaionService } from 'src/app/services/education.service';
import { takeWhile } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { TranslateService } from '@ngx-translate/core';
import { PopoverController } from '@ionic/angular';
import { ActionsComponent } from 'src/app/shared/actions/actions.component';

@Component({
  selector: 'cranix-room-control',
  templateUrl: './room-control.component.html',
  styleUrls: ['./room-control.component.scss'],
})
export class RoomControlComponent implements OnInit,OnDestroy {

  alive = true;

  direct: boolean;
  login: boolean;
  portal: boolean;
  printing: boolean;
  proxy: boolean;

  devices = [1,2,3,4,5,6]
  room : Room; 

  rooms : Observable<Room[]>;

  constructor(private authS: AuthenticationService,
              private eduS: EductaionService,
              public popoverCtrl: PopoverController,
              private translateS: TranslateService,
              ) {
    this.rooms = this.eduS.getMyRooms();

    if (this.authS.session.roomId){
      this.eduS.getRoomById(parseInt(this.authS.session.roomId))
          .pipe(takeWhile( () => this.alive ))
          .subscribe(res => {
            this.room = res
          });
          
    }else {

    }
  }

  ngOnInit() {
    
  }

  array(n: number): any[] {
    return Array(n);
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
    let status: AccessStatus = {
      accessType: "FW",
      roomId: this.room.id,
      printing: this.printing,
      proxy: this.proxy,
      portal: this.portal,
      direct: this.direct,
      login: this.login
    }
    console.log('fw status is', status);
    this.eduS.setAccessStatus(status)
      .pipe(takeWhile(() => this.alive))
      .subscribe((res) => {
        if (res.code === "OK") {
          this.translateS.get(res.value)
            .subscribe((res) => {
             // this.notify.success(res);

            })
        } else if (res.code === "ERROR") {
          this.translateS.get(res.value)
            .subscribe((res) => {
            //  this.notify.error(res);
            })
        }
      }, err => {
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
