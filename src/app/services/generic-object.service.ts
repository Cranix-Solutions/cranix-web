import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilsService } from './utils.service';
import { AuthenticationService } from './auth.service';
import { Subscription, BehaviorSubject } from 'rxjs';
import { ServerResponse } from '../shared/models/server-models';
import { AlertController, ToastController } from '@ionic/angular';
// own modules
@Injectable({
  providedIn: 'root'
})
export class GenericObjectService {
  modified: any = {};
  allObjects: any = {};
  objects: string[] = [
    'user','group','room','device','institute','customer','ticket','hwconf'
  ]

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
    private toastController: ToastController) {
      for(let key of  this.objects) {
        this.modified[key] = new BehaviorSubject(false);
      }
    }

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
      for(let key of this.objects ){
        this.getAllObject(key);
      }
      this.initialized = true;
    }
  }

  getAllObject(objectType) {
    let url = this.utilsS.hostName() + "/" + objectType + "s/all";
    let sub = this.http.get<ServerResponse>(url,  { headers: this.headers }).subscribe(
      (val) => ( this.allObjects[objectType] = val ),
      (err) => {},
      () => {
        this.modified[objectType].next(true);
        sub.unsubscribe(); }
    );
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
                  this.modified[objectType].next(true);
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
}
