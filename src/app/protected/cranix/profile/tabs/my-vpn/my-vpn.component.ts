import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { SelfManagementService } from 'src/app/services/selfmanagement.service';
import { takeWhile } from 'rxjs/internal/operators/takeWhile';
import { GenericObjectService } from 'src/app/services/generic-object.service';

@Component({
  selector: 'cranix-my-vpn',
  templateUrl: './my-vpn.component.html',
  styleUrls: ['./my-vpn.component.scss'],
})
export class MyVPNComponent implements OnInit,OnDestroy {

  alive: boolean = true;
  supportedOSlist: Observable<string[]>;

  selectedOS: string; 
  
  constructor(private selfS: SelfManagementService,
    public objectService: GenericObjectService) {
    this.supportedOSlist = this.selfS.getSupportedOS()  
  }

  ngOnInit() {}

  log(){
    console.log('value is:', this.selectedOS);
  }
  downloadExec(){
    this.objectService.requestSent();
    this.selfS.getVPNInstaller(this.selectedOS)
        .pipe(takeWhile(() => this.alive ))
        .subscribe((x) => { 
           // console.log('answer is', x.headers.get('content-disposition'));
           const keys = x.headers.keys();
          let headers = keys.map(key =>
            `${key}: ${x.headers.get(key)}`);
           console.log('full answer', x);
           console.log('headers are', headers);
          var newBlob = new Blob([x.body], { type: x.body.type });

          // IE doesn't allow using a blob object directly as link href
          /* instead it is necessary to use msSaveOrOpenBlob
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
              window.navigator.msSaveOrOpenBlob(newBlob);
              return;
          }*/

          // For other browsers: 
          // Create a link pointing to the ObjectURL containing the blob.
          const data = window.URL.createObjectURL(newBlob);

          var link = document.createElement('a');
          link.href = data;
          link.download = x.headers.get('content-disposition').replace('attachment; filename=','');
          // this is necessary as link.click() does not work on the latest firefox
          link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

          setTimeout(function () {
              // For Firefox it is necessary to delay revoking the ObjectURL
              window.URL.revokeObjectURL(data);
              link.remove();
          }, 100);
        }, (err) => {
          this.objectService.errorMessage(err);
        })
  }

  downloadConfig(){
    this.objectService.requestSent();
    this.selfS.getVPNConfig(this.selectedOS)
    .pipe(takeWhile(() => this.alive ))
    .subscribe((x) => {
      console.log('full answer', x);
      console.log('answer is', x.headers.get('content-disposition'));

      var newBlob = new Blob([x.body], { type: x.body.type });

      // IE doesn't allow using a blob object directly as link href
      /* instead it is necessary to use msSaveOrOpenBlob
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(newBlob);
          return;
      }*/

      // For other browsers: 
      // Create a link pointing to the ObjectURL containing the blob.
      const data = window.URL.createObjectURL(newBlob);

      var link = document.createElement('a');
      link.href = data;
      link.download = x.headers.get('content-disposition').replace('attachment; filename=','');
      // this is necessary as link.click() does not work on the latest firefox
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

      setTimeout(function () {
          // For Firefox it is necessary to delay revoking the ObjectURL
          window.URL.revokeObjectURL(data);
          link.remove();
      }, 100);
    }, (err) => {
      this.objectService.errorMessage(err);
    })
  }

  ngOnDestroy(){
    this.alive = false; 
  }
}
