import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

//Own stuff
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { CephalixService } from 'src/app/services/cephalix.service';
import { Institute, DynDns, CephalixCare, Repository, Customer } from 'src/app/shared/models/cephalix-data-model';
import { AuthenticationService } from 'src/app/services/auth.service';
import { User } from 'src/app/shared/models/data-model';
import { contracts } from 'src/app/shared/models/cephalix-data-model';
@Component({
  selector: 'cranix-institute-edit',
  templateUrl: './institute-edit.component.html',
  styleUrls: ['./institute-edit.component.scss'],
})
export class InstituteEditComponent implements OnInit {
  allAddons: Repository[];
  addons: Repository[];
  origAddons: Repository[];
  segment = 'details';
  care: CephalixCare;
  object: Institute = null;
  objectKeys: string[] = [];
  myCustomer: Customer;
  isourl: string = "";
  managers = {}
  users: User[] = [];
  myContracts: string[] = contracts;
  dynDnsDomains: string[] = ['cephalix.eu', 'cephalix.de', 'cranix.eu']
  dynDnsName: string = "";
  dynDnsDomain: string = "cephalix.eu";
  dynDnsPort: string = "22";
  dynDnsRo: boolean = false;
  dynDnsIp: string = "";
  dynDns: DynDns;
  constructor(
    public authService: AuthenticationService,
    public cephalixService: CephalixService,
    public translateService: TranslateService,
    public objectService: GenericObjectService
  ) {
    this.object = this.objectService.selectedObject;
    this.cephalixService.getAllAddons().subscribe((val) => { this.allAddons = val });
    this.cephalixService.getAddonsOfInstitute(this.object.id).subscribe((val) => { this.addons = val; this.origAddons = val })
    this.cephalixService.getUsersFromInstitute(this.object.id).subscribe(
      (val) => {
        for (let man of val) {
          this.managers[man.id] = true;
        }
        for (let user of this.objectService.allObjects['user']) {
          if (user.role.toLowerCase() == "reseller" || user.role == "sysadmins") {
            if (!this.managers[user.id]) {
              this.managers[user.id] = false;
            }
            this.users.push(user)
          }
        }
      }
    )
    if (this.objectService.cephalixDefaults.createIsoBy && this.objectService.cephalixDefaults.createIsoBy == 'regCode') {
      this.isourl = this.object.regCode;
    } else {
      this.isourl = this.object.uuid;
    }
    let institute = new Institute();
    if (!this.authService.isAllowed("customer.manage")) {
      delete institute.cephalixCustomerId;
    } else {
      //Read dynDns settings
      this.cephalixService.getDynDns(this.object.id).subscribe(
        (val) => {
          if (val) {
            this.dynDns = val;
            this.dynDnsDomain = val.domain;
            this.dynDnsName = val.hostname;
            this.dynDnsPort = val.port;
            this.dynDnsRo = val.ro;
            this.dynDnsIp = val.ip;
          } else {
            this.dynDns = new DynDns();
          }
        }
      )
      this.cephalixService.getCare(this.object.id).subscribe(
        (val) => {
          if (val) {
            this.care = val;
          } else {
            this.care = new CephalixCare();
          }
        }
      )
      this.myCustomer = this.objectService.getObjectById(
        'customer',this.object.cephalixCustomerId
      );
    }
    this.objectKeys = Object.getOwnPropertyNames(institute);
    console.log("InstituteEditComponent:", this.object);
  }

  ngOnInit() { }

  segmentChanged(event) {
    this.segment = event.detail.value;
  }
  public ngAfterViewInit() {
    while (document.getElementsByTagName('mat-tooltip-component').length > 0) { document.getElementsByTagName('mat-tooltip-component')[0].remove(); }
  }
  onSubmit(form) {
    form['id'] = this.object.id;
    console.log(form)
    this.objectService.modifyObjectDialog(form, "institute");

    if (this.authService.isAllowed("customer.manage") &&
      (this.dynDns.domain != this.dynDnsDomain || this.dynDns.hostname != this.dynDnsName ||
        this.dynDns.port != this.dynDnsPort || this.dynDns.ro != this.dynDnsRo)) {
      this.dynDns.domain = this.dynDnsDomain
      this.dynDns.hostname = this.dynDnsName
      this.dynDns.port = this.dynDnsPort
      this.dynDns.ro = this.dynDnsRo
      this.cephalixService.setDynDns(this.object.id, this.dynDns)
    }
    if (this.authService.isAllowed("customer.manage")) {
      this.cephalixService.setCare(this.object.id, this.care)
    }
    if( this.myCustomer && this.myCustomer.id != this.object.cephalixCustomerId ){
      this.cephalixService.addInstituteToCustomer(
        this.object.id, this.myCustomer.id
      );
    }
  }

  compareFn(o1: User, o2: User | User[]) {
    if (!o1 || !o2) {
      return o1 === o2;
    }
    if (Array.isArray(o2)) {
      return o2.some((u: User) => u.id === o1.id);
    }
    return o1.id === o2.id;
  }

  setNextDefaults() {
    this.cephalixService.getNextDefaults().subscribe(
      (val) => {
        for (let key of this.objectKeys) {
          if (!this.object[key] && val[key]) {
            this.object[key] = val[key];
          }
        }
        this.ngOnInit();
      }
    )
  }

  writeConfig() {
    this.objectService.requestSent();
    this.cephalixService.writeConfig(this.object.id)
  }
  delete(ev: Event) {
    this.objectService.deleteObjectDialog(this.object, 'institute', '');
  }
  managerChanged(id) {
    if (this.managers[id]) {
      this.cephalixService.deleteUserFromInstitute(id, this.object.id)
    } else {
      this.cephalixService.addUserToInstitute(id, this.object.id)
    }
    this.managers[id] = !this.managers[id];
  }

  addonChanged() {
    console.log(this.addons)
    console.log(this.origAddons)
    for (let repo of this.addons) {
      if (!this.origAddons.some((r: Repository) => r.id === repo.id)) {
        this.cephalixService.addAddonToInstitute(this.object.id, repo.id)
      }
    }
    for (let repo of this.origAddons) {
      if (!this.addons.some((r: Repository) => r.id === repo.id)) {
        this.cephalixService.removeAddonFromInstitute(this.object.id, repo.id)
      }
    }
  }
  compareAddons(o1: Repository, o2: Repository) {
    if (!o1 || !o2) {
      return o1 === o2;
    }
    if (Array.isArray(o2)) {
      return o2.some((r: Repository) => r.id === o1.id);
    }
    return o1.id === o2.id;
  }
}
