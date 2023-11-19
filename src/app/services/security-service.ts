import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalController, ToastController } from '@ionic/angular';
import { CanDeactivate } from '@angular/router';

//Own Stuff
import { UtilsService } from './utils.service';
import { AuthenticationService } from './auth.service';
import { GenericObjectService } from './generic-object.service';
import { LanguageService } from './language.service';
import { ServerResponse } from 'src/app/shared/models/server-models';
import { AccessInRoom, IncomingRules, OutgoingRule, RemoteRule, SafeSearch } from '../shared/models/secutiry-model';
import { Room } from '../shared/models/data-model';

@Injectable()
export class SecurityService {

  hostname: string;
  url: string;
  incomingRules: IncomingRules;
  outgoingRules: OutgoingRule[];
  remoteRules: RemoteRule[];
  firewallRooms: Room[];
  firewallServices: string[];
  actualStatus: AccessInRoom[];
  public unboundChanged: boolean = false;
  public incomingChanged: boolean = false;
  public proxyChanged = {
    basic: false,
    good: false,
    bad: false,
    cephalix: false
  }

  constructor(
    private authService: AuthenticationService,
    private http: HttpClient,
    public languageS: LanguageService,
    public modalCtrl: ModalController,
    public objectService: GenericObjectService,
    public toastController: ToastController,
    private utilsS: UtilsService
  ) {
    this.hostname = this.utilsS.hostName();
  }

  getAllAccess() {
    this.url = this.hostname + `/rooms/accessList`;
    console.log(this.url);
    return this.http.get<AccessInRoom[]>(this.url, { headers: this.authService.headers });
  }

  getProxyBasic() {
    this.url = this.hostname + `/system/proxy/basic`;
    console.log(this.url);
    return this.http.get<any[]>(this.url, { headers: this.authService.headers });
  }

  setProxyBasic(acls) {
    this.url = this.hostname + `/system/proxy/basic`;
    console.log(this.url);
    return this.http.post<ServerResponse>(this.url, acls, { headers: this.authService.headers });
  }

  getProxyCustom(custom) {
    this.url = this.hostname + `/system/proxy/custom/${custom}`;
    console.log(this.url);
    return this.http.get<string[]>(this.url, { headers: this.authService.headers });
  }
  getProxyCategories() {
    this.url = this.hostname + "/system/proxy/lists";
    console.log(this.url);
    return this.http.get<any[]>(this.url, { headers: this.authService.headers });
  }
  getActiveUnboundLists() {
    this.url = this.hostname + "/system/configuration/UNBOUND_LISTS";
    console.log(this.url);
    let textHeaders = new HttpHeaders({
      'Accept': "text/plain",
      'Authorization': "Bearer " + this.authService.session.token
    });
    return this.http.get(this.url, { headers: textHeaders, responseType: 'text' });
  }

  setActiveUnboundLists(lists) {
    this.url = this.hostname + "/system/configuration";
    console.log(this.url);
    let temp = { "key": "UNBOUND_LISTS", "value": lists }
    return this.http.post<ServerResponse>(this.url, temp, { headers: this.authService.headers });
  }
  resetUnbound() {
    this.url = this.hostname + "/system/unbound";
    console.log(this.url);
    return this.http.put<ServerResponse>(this.url, null, { headers: this.authService.headers });
  }

  getUnboundSafeSearch() {
    this.url = this.hostname + "/system/unbound/safesearch";
    console.log(this.url);
    return this.http.get<SafeSearch[]>(this.url, { headers: this.authService.headers });
  }

  setUnboundSafeSearch(list: SafeSearch[]) {
    this.url = this.hostname + "/system/unbound/safesearch";
    console.log(this.url);
    return this.http.post<ServerResponse>(this.url, list, { headers: this.authService.headers })
  }

  setProxyCustom(custom, list: string[]) {
    this.url = this.hostname + `/system/proxy/custom/${custom}`;
    console.log(this.url);
    return this.http.post<ServerResponse>(this.url, list, { headers: this.authService.headers });
  }

  getIncomingRules() {
    this.url = this.hostname + `/system/firewall/incomingRules`;
    console.log(this.url);
    this.http.get<IncomingRules>(this.url, { headers: this.authService.headers }).subscribe({
      next: (val) => { this.incomingRules = val },
      error: (err) => { console.log(err) }
    })
  }

  getOutgoingRules() {
    this.url = this.hostname + `/system/firewall/outgoingRules`;
    console.log(this.url);
    this.http.get<OutgoingRule[]>(this.url, { headers: this.authService.headers }).subscribe({
      next: (val) => { this.outgoingRules = val },
      error: (err) => { console.log(err) }
    })
  }

  getRemoteRules() {
    this.url = this.hostname + `/system/firewall/remoteAccessRules`;
    console.log(this.url);
    this.http.get<RemoteRule[]>(this.url, { headers: this.authService.headers }).subscribe({
      next: (val) => { this.remoteRules = val },
      error: (err) => { console.log(err) }
    })
  }

  getFirewallRooms() {
    this.url = this.hostname + "/rooms/allWithFirewallControl";
    console.log(this.url);
    this.http.get<Room[]>(this.url, { headers: this.authService.headers }).subscribe({
      next: (val) => { this.firewallRooms = val; },
      error: (err) => { console.log(err) }
    })
  }

  getFirewallServices() {
    this.url = this.hostname + `/system/firewall/services`;
    console.log(this.url);
    this.http.get<string[]>(this.url, { headers: this.authService.headers }).subscribe({
      next: (val) => { this.firewallServices = val },
      error: (err) => { console.log(err) }
    })
  }

  setFirewallStatus(status) {
    this.url = this.hostname + `/system/firewall/${status}`;
    console.log(this.url);
    this.objectService.requestSent();
    let sub = this.http.put<ServerResponse>(this.url, null, { headers: this.authService.headers }).subscribe({
      next: (val) => {
        this.readDatas();
        this.objectService.responseMessage(val);
      },
      error: (err) => {
        this.objectService.errorMessage(this.languageS.trans("An error was accoured"));
      },
      complete: () => { sub.unsubscribe() }
    });
  }
  setIncommingRules() {
    this.url = this.hostname + '/system/firewall/incomingRules';
    console.log(this.url);
    this.objectService.requestSent();
    let sub = this.http.post<ServerResponse>(this.url, this.incomingRules, { headers: this.authService.headers }).subscribe({
      next: (val) => {
        if (val.code = "OK") {
          this.incomingChanged = false;
        }
        this.objectService.responseMessage(val);
      },
      error: (err) => {
        this.objectService.errorMessage(this.languageS.trans("An error was accoured"));
      },
      complete: () => { sub.unsubscribe() }
    });
  }

  addOutgoingRule(rule) {
    this.url = this.hostname + '/system/firewall/outgoingRules';
    console.log(this.url);
    this.objectService.requestSent();
    let sub = this.http.post<ServerResponse>(this.url, rule, { headers: this.authService.headers }).subscribe({
      next: (val) => {
        this.getOutgoingRules();
        this.objectService.responseMessage(val);
      },
      error: (err) => {
        this.objectService.errorMessage(this.languageS.trans("An error was accoured"));
      },
      complete: () => { sub.unsubscribe() }
    });
  }

  deleteOutgoingRule(rule) {
    this.url = this.hostname + '/system/firewall/outgoingRules/delete';
    console.log(this.url);
    this.objectService.requestSent();
    let sub = this.http.post<ServerResponse>(this.url, rule, { headers: this.authService.headers }).subscribe({
      next: (val) => {
        this.getOutgoingRules();
        this.objectService.responseMessage(val);
      },
      error: (err) => {
        this.objectService.errorMessage(this.languageS.trans("An error was accoured"));
      },
      complete: () => { sub.unsubscribe() }
    });
  }

  addRemoteRule(rule) {
    this.url = this.hostname + '/system/firewall/remoteAccessRules';
    console.log(this.url);
    this.objectService.requestSent();
    let sub = this.http.post<ServerResponse>(this.url, rule, { headers: this.authService.headers }).subscribe({
      next: (val) => {
        this.getRemoteRules();
        this.objectService.responseMessage(val);
      },
      error: (err) => {
        this.objectService.errorMessage(this.languageS.trans("An error was accoured"));
      },
      complete: () => { sub.unsubscribe() }
    });
  }

  deleteRemoteRule(rule) {
    this.url = this.hostname + '/system/firewall/remoteAccessRules/delete';
    console.log(this.url);
    this.objectService.requestSent();
    let sub = this.http.post<ServerResponse>(this.url, rule, { headers: this.authService.headers }).subscribe({
      next: (val) => {
        this.getRemoteRules();
        this.objectService.responseMessage(val);
      },
      error: (err) => {
        this.objectService.errorMessage(this.languageS.trans("An error was accoured"));
      },
      complete: () => { sub.unsubscribe() }
    });
  }

  getActualAccessStatus() {
    this.url = `${this.hostname}/rooms/accessStatus`;
    console.log(this.url);
    let sub = this.http.get<AccessInRoom[]>(this.url, { headers: this.authService.headers }).subscribe({
      next: (val) => {
        this.actualStatus = val;
        console.log(this.actualStatus);
      },
      error: (err) => { console.log('getActualAccessStatus', err) },
      complete: () => { sub.unsubscribe() }
    })
  }

  setAccessStatusInRoom(accessInRoom: AccessInRoom) {
    this.url = this.hostname + "/rooms/" + accessInRoom.roomId + "/accessStatus";
    console.log(this.url);
    this.objectService.requestSent();
    let sub = this.http.post<ServerResponse>(this.url, accessInRoom, { headers: this.authService.headers }).subscribe({
      next: (val) => { this.objectService.responseMessage(val); },
      error: (err) => {
        this.objectService.errorMessage(this.languageS.trans("An error was accoured"));
      },
      complete: () => { sub.unsubscribe() }
    });
  }
  addAccessInRoom(accessInRoom: AccessInRoom) {
    this.url = this.hostname + "/rooms/" + accessInRoom.roomId + "/accessList";
    console.log(this.url);
    this.objectService.requestSent();
    let sub = this.http.post<ServerResponse>(this.url, accessInRoom, { headers: this.authService.headers }).subscribe({
      next: (val) => {
        this.objectService.responseMessage(val);
      },
      error: (err) => {
        this.objectService.errorMessage(this.languageS.trans("An error was accoured"));
      },
      complete: () => { sub.unsubscribe() }
    });
  }

  deleteAccessInRoom(id: number) {
    this.url = this.hostname + "/rooms/accessList/" + id;
    console.log(this.url);
    this.objectService.requestSent();
    let sub = this.http.delete<ServerResponse>(this.url, { headers: this.authService.headers }).subscribe({
      next: (val) => {
        this.objectService.responseMessage(val);
      },
      error: (err) => {
        this.objectService.errorMessage(this.languageS.trans("An error was accoured"));
      },
      complete: () => { sub.unsubscribe() }
    });
  }

  modifyAccessInRoom(accessInRoom: AccessInRoom) {
    this.url = this.hostname + "/rooms/accessList/"
    console.log(this.url, accessInRoom);
    this.objectService.requestSent();
    let sub = this.http.post<ServerResponse>(this.url, accessInRoom, { headers: this.authService.headers }).subscribe({
      next: (val) => {
        this.objectService.responseMessage(val);
      },
      error: (err) => {
        this.objectService.errorMessage(this.languageS.trans("An error was accoured"));
      },
      complete: () => { sub.unsubscribe() }
    });
  }

  readDatas() {
    this.incomingRules = null;
    this.outgoingRules = null;
    this.remoteRules = null;
    this.getFirewallServices();
    this.getIncomingRules();
    this.getOutgoingRules();
    this.getRemoteRules();
    this.getFirewallRooms();
  }
}

@Injectable()
export class FirewallCanDeactivate implements CanDeactivate<SecurityService> {
  constructor(
    public languageS: LanguageService,
    public securityService: SecurityService
  ) { }
  canDeactivate(securityService: SecurityService) {
    if (this.securityService.incomingChanged) {
      return window.confirm(
        this.languageS.trans('The incomming rules was changed but not saved.') +
        this.languageS.trans('The changes will be lost if you leave the module.')
      );
    }
    return true;
  }
}

@Injectable()
export class ProxyCanDeactivate implements CanDeactivate<SecurityService> {
  constructor(
    public languageS: LanguageService,
    public securityService: SecurityService
  ) { }
  canDeactivate(securityService: SecurityService) {
    if (this.securityService.proxyChanged['basic']) {
      return window.confirm(
        this.languageS.trans('The proxy basic configuration was changed.') +
        this.languageS.trans('The changes will be lost if you leave the module.')
      );
    }
    if (this.securityService.proxyChanged['good']) {
      return window.confirm(
        this.languageS.trans('The white list was changed.') +
        this.languageS.trans('The changes will be lost if you leave the module.')
      );
    }
    if (this.securityService.proxyChanged['bad']) {
      return window.confirm(
        this.languageS.trans('The black list was changed.') +
        this.languageS.trans('The changes will be lost if you leave the module.')
      );
    }
    if (this.securityService.proxyChanged['cephalix']) {
      return window.confirm(
        this.languageS.trans('The chephalix list  was changed.') +
        this.languageS.trans('The changes will be lost if you leave the module.')
      );
    }
    return true;
  }
}

@Injectable()
export class UnboundCanDeactivate implements CanDeactivate<SecurityService> {
  constructor(
    public languageS: LanguageService,
    public securityService: SecurityService
  ) { }
  canDeactivate(securityService: SecurityService) {
    if (this.securityService.unboundChanged) {
      return window.confirm(
        this.languageS.trans('The unbound configuration was changed.') +
        this.languageS.trans('The changes will be lost if you leave the module.')
      );
    }
    return true;
  }
}
