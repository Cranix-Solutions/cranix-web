import { Component, OnInit, OnDestroy } from '@angular/core';
import { SelfManagementService } from 'src/app/services/selfmanagement.service';
import { AdHocLanService } from 'src/app/services/adhoclan.service';
import { takeWhile } from 'rxjs/internal/operators/takeWhile';
import { GenericObjectService } from 'src/app/services/generic-object.service';

@Component({
  selector: 'cranix-my-devices',
  templateUrl: './my-devices.component.html',
  styleUrls: ['./my-devices.component.scss'],
})
export class MyDevicesComponent implements OnInit,OnDestroy {

  alive :boolean = true; 

  myDevs; 
  constructor(private adhocS: AdHocLanService,
    public objectService: GenericObjectService,) {
    this.myDevs = this.adhocS.getMyDevices()
   }

  ngOnInit() {}

  deleteDev(dev: number){
    this.adhocS.deleteAdHocDevice(dev)
        .pipe(takeWhile(() => this.alive ))
        .subscribe((res) => {
          this.objectService.responseMessage(res)
        }, (err) => {
          this.objectService.errorMessage(err);
        })
  }

  ngOnDestroy(){
    this.alive = false; 
  }
}
