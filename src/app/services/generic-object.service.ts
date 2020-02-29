import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilsService } from './utils.service';
import { AuthenticationService } from './auth.service';
import { Subscription, BehaviorSubject } from 'rxjs';
import { ServerResponse } from '../shared/models/server-models';
import { AlertController, ToastController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class GenericObjectService {
  customersModified = new BehaviorSubject(false);
  devicesModified       = new BehaviorSubject(false);
  groupsModified        = new BehaviorSubject(false);
  hwconfsModified     = new BehaviorSubject(false);
  institutesModified   = new BehaviorSubject(false);
  roomsModified         = new BehaviorSubject(false);
  usersModified           = new BehaviorSubject(false);
  selects: any = {
    'status': ['N','A','D']
  }
  initialized: boolean = false;
  enumerates: string[] = [
    'instituteType', 'groupType', 'deviceType', 'roomType', 'roomControl', 'network', 'accessType', 'role'
  ];
  headers: HttpHeaders;

  constructor(
    public alertController: AlertController,
    private authS: AuthenticationService,
    private http: HttpClient,
    private utilsS: UtilsService,
    private toastController: ToastController) { }

  initialize(force: boolean) {
    let subs: any = {};
    if (force || !this.initialized) {
      this.headers = new HttpHeaders({
        'Content-Type': "application/json",
        'Accept': "application/json",
        'Authorization': "Bearer " + this.authS.getToken()
      });
      for (let key of this.enumerates) {
        let url = this.utilsS.hostName() + "/system/enumerates/" + key;
        subs[key] = this.http.get<string[]>(url, { headers: this.headers }).subscribe(
          (val) => { this.selects[key] = val; },
          (err) => {},
          () => { subs[key].unsubscribe() });
      }
      this.initialized = true;
    }
  }
  applyAction(object, objectType, action) {
    switch (action) {
      case "add": {
        return this.addObject(object, objectType);
      }
      case "modify": {
        return this.modifyObject(object, objectType);
      }
      case "delete": {
        return this.deleteObject(object, objectType);
      }
    }
  }

  addObject(object, objectType) {
    const body = object;
    let url = this.utilsS.hostName() + "/" + objectType + "s/add";
    return this.http.post<ServerResponse>(url, body, { headers: this.headers });
  }
  modifyObject(object, objectType) {
    const body = object;
    let url = this.utilsS.hostName() + "/" + objectType + "s/" + object.id;
    return this.http.post<ServerResponse>(url, body, { headers: this.headers })
  }
  deleteObject(object, objectType) {
    const body = object;
    let url = this.utilsS.hostName() + "/" + objectType + "s/" + object.id;
    return this.http.delete<ServerResponse>(url, { headers: this.headers })
  }

  async deleteObjectDialog(object, objectType) {
    let serverResponse: ServerResponse;
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Do you realy want to  delete:',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'OK',
          handler: () => {
            var a = this.deleteObject(object, objectType).subscribe(
              (val) => {
                serverResponse = val;
                if (serverResponse.code == "OK") {
                  this.okMessage("Object was deleted");
                  this.setModified(objectType);
                } else {
                  this.errorMessage("" + serverResponse.value  );
                }
               },
              (err) => {
                 this.errorMessage("An error was accoured");
              },
              () => { a.unsubscribe() }
            )
          }
        }
      ]
    });
    await alert.present();
  }

async errorMessage(message: string){
  const toast = await  this.toastController.create({
    position: "middle",
    message: message,
    cssClass: "bar-assertive",
    color: "danger",
    duration: 3000
  });
    (await toast).present();
}
async okMessage(message: string){
  const toast = await  this.toastController.create({
    position: "middle",
    message: message,
    cssClass: "bar-assertive",
    color: "success",
    duration: 3000
  });
    (await toast).present();
}
setModified(objectType: string){
  switch(objectType) {
    case 'customer': {this.customersModified.next(true);break;}
    case 'device': {this.devicesModified.next(true);break;}
    case 'group': {this.groupsModified.next(true);break;}
    case 'hwconf': {this.hwconfsModified.next(true);break;}
    case 'institute': {this.institutesModified.next(true);break;}
    case 'user': {this.usersModified.next(true);break; }
    case 'room': {this.roomsModified.next(true);break;}
  }
}
}