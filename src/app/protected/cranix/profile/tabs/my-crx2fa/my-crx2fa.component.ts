import { Component, OnInit } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { AuthenticationService } from 'src/app/services/auth.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { SelfManagementService } from 'src/app/services/selfmanagement.service';
import { Crx2fa } from 'src/app/shared/models/server-models';

@Component({
  selector: 'app-my-crx2fa',
  templateUrl: './my-crx2fa.component.html',
  styleUrls: ['./my-crx2fa.component.scss'],
})
export class MyCrx2faComponent implements OnInit {

  crx2fa: Crx2fa;
  crx2fas: Crx2fa[];
  crx2faTypes: string[];
  maxTimeStep: number = 60;

  constructor(
    public authService: AuthenticationService,
    public selfService: SelfManagementService,
    public objectService: GenericObjectService,
    public platformService: Platform
  ) {
    this.crx2fa = {
       timeStep: 30,
       crx2faAddress: "", 
       validHours: 2,
       creatorId: 0,
       crx2faType: "TOTP"
    }
  }

  ngOnInit() {
    this.load()
  }

  load(){
    this.selfService.getCfaTypes().subscribe(
      (val) => { this.crx2faTypes = val; }
    )
    this.selfService.getMyCfas().subscribe(
      (val) => {
        console.log(val)
        this.crx2fas = val;
        console.log(this.crx2fas)
        if (val && val.length == 0) {
          this.crx2fa.crx2faType = "TOTP"
        }
        this.changeType()
      }
    )
  }

  save() {
    console.log("save", this.crx2fa)
    //Check and correct the values
    if(this.crx2fa.timeStep > this.maxTimeStep) { this.crx2fa.timeStep = this.maxTimeStep }
    if(this.crx2fa.validHours > 24) { this.crx2fa.timeStep = 24 }
    if(this.crx2fa.timeStep < 30) { this.crx2fa.timeStep = 30 }
    if(this.crx2fa.validHours < 1) { this.crx2fa.timeStep = 1 }
    
    this.selfService.saveMyCfa(this.crx2fa).subscribe({
      next: (val) => {
        this.objectService.responseMessage(val),
          this.selfService.getMyCfas().subscribe({
            next: (val) => {
              this.crx2fas = val;
              this.changeType();
            },
            error: (err) => {
              console.log("getMyCfas:", err);
              this.objectService.errorMessage(err)
            }
          })
      },
      error: (err) => {
        console.log("saveMyCfs",err);
        this.objectService.errorMessage(err)
      }
    })
  }
  
  delete2fa() {
    console.log("delete", this.crx2fa)
    this.selfService.deleteCfa(this.crx2fa).subscribe({
      next: (val) => {
        this.objectService.responseMessage(val);
        this.load()
      }
    })
  }

  changeType() {
    this.crx2fa.crx2faAddress = "";
    this.crx2fa.validHours = 12;
    this.crx2fa.id = 0;
    switch (this.crx2fa.crx2faType) {
      case "TOTP": {
        this.crx2fa.timeStep = 30;
        this.maxTimeStep = 60;
        break;
      }
      case "SMS":
      case "MAIL": {
        this.crx2fa.timeStep = 300;
        this.maxTimeStep = 600;
      }
    }
    for (let tmp of this.crx2fas) {
      console.log(tmp)
      if (this.crx2fa.crx2faType == tmp.crx2faType) {
        this.crx2fa.id = tmp.id
        this.crx2fa.timeStep = tmp.timeStep
        this.crx2fa.crx2faAddress = tmp.crx2faAddress
        this.crx2fa.validHours = tmp.validHours
        this.crx2fa.serial = tmp.serial
        break
      }
    }
  }
}
