import { Component, OnInit } from '@angular/core';
import { SystemService } from 'src/app/services/system.service';
import { ServiceStatus } from 'src/app/shared/models/server-models'
import { takeWhile } from 'rxjs/operators';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'cranix-system-services',
  templateUrl: './system-services.component.html',
  styleUrls: ['./system-services.component.scss'],
})
export class SystemServicesComponent implements OnInit {

  servicesStatus: ServiceStatus[];
  alive: boolean= true;
  roomStatusSub: Subscription;

  constructor(
    public systemService: SystemService
    ) { }

  ngOnInit() {
    this.getStatus();
    this.alive = true;
  }


  ngAfterViewInit() {
    this.statusTimer();
  }
  togleStatus(name,what) {
    let status = 'true';
    for( let tmp of this.servicesStatus) {
      if( tmp.service == name ) {
        if( what == 'enabled') {
          status = tmp.enabled == 'true' ? 'false' : 'true'
        } else {
          status = tmp.active == 'true' ? 'false' : 'true'
        }
      }
    }
    this.systemService.applyServiceState(name,what,status);
  }
  statusTimer() {
    this.roomStatusSub = interval(10000).pipe(takeWhile(() => this.alive)).subscribe((func => {
      this.getStatus();
    }))
  }
  getStatus() {
    let subs = this.systemService.getServiceStatus().subscribe(
      (val) => { this.servicesStatus = val },
      (err) => { console.log(err)},
      () => { subs.unsubscribe () }
     )
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
