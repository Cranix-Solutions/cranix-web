import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { ServerResponse } from '../shared/models/server-models';
import { AlertController, ToastController } from '@ionic/angular';
import { Validators } from '@angular/forms';
// own modules
import { UtilsService } from './utils.service';
import { AuthenticationService } from './auth.service';
import { LanguageService } from './language.service';
@Injectable({
  providedIn: 'root'
})
export class GenericObjectService {
  allObjects: any = {};
  selectedObject: any = null;

  /**
   * The base objects which need to be loaded by the initialisations
   */
  objects: string[] = [
    'user', 'group', 'room', 'device', 'institute', 'customer', 'ticket', 'hwconf','printer'
  ]

  selects: any = {
    'status': ['N', 'A', 'D']
  }
  initialized: boolean = false;
  enumerates: string[] = [
    'instituteType', 'groupType', 'deviceType', 'roomType', 'roomControl', 'network', 'accessType', 'role','noticeType'
  ];

  /**
   * Attributes which can not be modified
   */
  readOnlyAttributes: string[] = [
    'classes',
    'fsQuotaUsed',
    'ip',
    'msQuotaUsed',
    'name',
    'ownerName',
    'recDate',
    'role',
    'uid',
    'wlanIp'
  ]
  /**
   * Attributes which we get but need not be shown
   */
  hiddenAttributes: string[] = [
    'id',
    'ownerId',
    'deleted',
    'saveNext',
    'cephalixInstituteId'
  ]
  /**
   * Required attributes
   */
  required: any = {
    'givenName': '*',
    'groupType': '*',
    'instituteType': '*',
    'name': '*',
    'regCode': '*',
    'role': '*',
    'surName': '*'
  };

  headers: HttpHeaders;

  constructor(
    public alertController: AlertController,
    private authS: AuthenticationService,
    private http: HttpClient,
    private languageS: LanguageService,
    private utilsS: UtilsService,
    private toastController: ToastController) {
    for (let key of this.objects) {
      this.allObjects[key] = new BehaviorSubject([]);
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
      for (let key of this.objects) {
        this.getAllObject(key);
      }
      for (let key of this.enumerates) {
        let url = this.utilsS.hostName() + "/system/enumerates/" + key;
        subs[key] = this.http.get<string[]>(url, { headers: this.headers }).subscribe(
          (val) => { this.selects[key] = val; },
          (err) => { },
          () => { subs[key].unsubscribe() });
      }
      
      this.initialized = true;
    }
  }

  getAllObject(objectType) {
    let url = this.utilsS.hostName() + "/" + objectType + "s/all";
    let sub = this.http.get<ServerResponse>(url, { headers: this.headers }).subscribe(
      (val) => { this.allObjects[objectType].next(val) },
      (err) => { console.log('getAllObject', objectType, err); },
      () => {
        sub.unsubscribe();
      }
    );
  }

  getObjects(objectType) {
    return this.allObjects[objectType].asObservable();
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

  idToName(objectType, objectId) {
    console.log(objectType, objectId);
    for (let obj of this.allObjects[objectType].getValue()) {
      if (obj.id === objectId) {
        return obj.name;
      }
    }
    return objectId;
  }
  idToUid(objectType, objectId) {
    for (let obj of this.allObjects[objectType].getValue()) {
      if (obj.id === objectId) {
        return obj.uid;
      }
    }
    return objectId;
  }
  addObject(object, objectType) {
    const body = object;
    let url = this.utilsS.hostName() + "/" + objectType + "s/add";
    console.log(objectType);
    console.log(object);
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
    let name = "";
    if (objectType == 'user') {
      name = object.uid + " ( " + object.givenName + " " + object.surName + " )";
    } else {
      name = object.name;
    }
    let serverResponse: ServerResponse;
    const alert = await this.alertController.create({
      header: this.languageS.trans('Confirm!'),
      message: this.languageS.trans('Do you realy want to  delete?') + '<br>' + name,
      buttons: [
        {
          text: this.languageS.trans('Cancel'),
          role: 'cancel',
        }, {
          text: 'OK',
          handler: () => {
            var a = this.deleteObject(object, objectType).subscribe(
              (val) => {
                serverResponse = val;
                if (serverResponse.code == "OK") {
                  this.getAllObject(objectType);
                  this.okMessage(this.languageS.trans("Object was deleted"));
                } else {
                  this.errorMessage("" + serverResponse.value);
                }
              },
              (err) => {
                this.errorMessage(this.languageS.trans("An error was accoured"));
              },
              () => { a.unsubscribe() }
            )
          }
        }
      ]
    });
    await alert.present();
  }

  async errorMessage(message: string) {
    const toast = await this.toastController.create({
      position: "middle",
      message: message,
      cssClass: "bar-assertive",
      color: "danger",
      duration: 3000
    });
    (await toast).present();
  }
  async okMessage(message: string) {
    const toast = await this.toastController.create({
      position: "middle",
      message: message,
      cssClass: "bar-assertive",
      color: "success",
      duration: 3000
    });
    (await toast).present();
  }

  compareFn(a: string, b: string): boolean {
    return a == b;
  }
  /**
   * Helper script fot the template to detect the type of the variables
   * @param val 
   */
  typeOf(key,object,action) {
    let obj = object[key];
    if (key == 'birthDay' || key == 'validity' || key == 'recDate' || key == 'validFrom' || key == 'validUntil' ) {
      return "date";
    }
    if (key == 'reminder'  || key == 'created' ) {
      return "date-time";
    }
    if (key == 'text') {
      return "text";
    }
    if (typeof obj === 'boolean' && obj) {
      return "booleanTrue";
    }
    if (typeof obj === 'boolean') {
      return "booleanFalse";
    }
    if (this.hiddenAttributes.indexOf(key) != -1) {
      return "hidden";
    }
    if (action == 'edit' && this.readOnlyAttributes.indexOf(key) != -1) {
      return "stringRO";
    }
    return "string";
  }

  convertObject(object) {
    //TODO introduce checks
    let output: any = {};
    for (let key in object) {
      if (key == 'birthDay' || key == 'validity' || key == 'recDate' || key == 'validFrom' || key == 'validUntil' || key == 'created' ) {
        let date = new Date(object[key]);
        output[key] = date.toJSON();
      } else if (this.required[key]) {
        output[key] = [object[key], Validators.compose([Validators.required])];
      } else {
        output[key] = object[key];
      }
    }
    console.log("convertObject:");
    console.log(output);
    return output;
  }
}
