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
    'user', 'group', 'room', 'device', 'hwconf', 'printer'
  ]
  /**
   * Object visiable only on cephalix servers.
   */
  cephalixObjects: string[] = [
    'institute', 'customer', 'ticket'
  ]
  /**
   * Default.ini for cephalix
   */
  cephalixDefaults: any = {};

  selects: any = {
    'status': ['N', 'A', 'D'],
    'identifier': ['sn-gn-bd', 'uuid', 'uid'],
    'lang': ['DE', 'EN'],
    'devCount': [2,4,8,16,32,64,128,256,512,1024,2048,4096]
  }
  initialized: boolean = false;
  enumerates: string[] = [
    'instituteType', 'groupType', 'deviceType', 'roomType', 'roomControl', 'network', 'accessType', 'role', 'noticeType'
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
    'accessInRooms',
    'cephalixInstituteId',
    'deleted',
    'devices',
    'id',
    'identifier',
    'network',
    'ownerId',
    'partitions',
    'saveNext',
    'users',
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
    public authService: AuthenticationService,
    private http: HttpClient,
    private languageS: LanguageService,
    private utilsS: UtilsService,
    private toastController: ToastController) {
  }

  initialize(force: boolean) {
    this.headers = new HttpHeaders({
      'Content-Type': "application/json",
      'Accept': "application/json",
      'Authorization': "Bearer " + this.authService.getToken()
    });
    if (this.authService.isAllowed('cephalix.manage')) {
      this.initializeCephalixObjects();
    }
    for (let key of this.objects) {
      this.allObjects[key] = new BehaviorSubject([]);
    }
    let subs: any = {};
    if (force || !this.initialized) {
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

  initializeCephalixObjects() {
    this.objects = this.objects.concat(this.cephalixObjects);
    let url = this.utilsS.hostName() + "/institutes/defaults/";
    let sub1 = this.http.get<string[]>(url, { headers: this.headers }).subscribe(
      (val) => { this.cephalixDefaults = val; },
      (err) => { },
      () => { sub1.unsubscribe() });
    url = this.utilsS.hostName() + "/institutes/ayTemplates/";
    let sub2 = this.http.get<string[]>(url, { headers: this.headers }).subscribe(
      (val) => { this.selects['ayTemplate'] = val; },
      (err) => { },
      () => { sub2.unsubscribe() });
    url = this.utilsS.hostName() + "/institutes/objects/";
    let sub3 = this.http.get<string[]>(url, { headers: this.headers }).subscribe(
      (val) => { this.selects['objects'] = val; },
      (err) => { },
      () => { sub3.unsubscribe() });
  }

  getAllObject(objectType) {
    let url = this.utilsS.hostName() + "/" + objectType + "s/all";
    let sub = this.http.get(url, { headers: this.headers }).subscribe(
      (val) => {
        this.allObjects[objectType].next(val);
	this.selects[objectType + 'Id'] = []
	for (let obj of <any[]>val) {
          this.selects[objectType + 'Id'].push(obj.id);
        }
      },
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
  idToPipe(idName: string) {
    if (idName == 'cephalixCustomerId') {
      return 'customer';
    }
    if (idName == 'cephalixInstituteId') {
      return 'institute';
    }
    return idName.substring(0, idName.length - 2)
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
    console.log("modifyObject");
    console.log(object);
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

  async modifyObjectDialog(object, objectType) {
    let name = "";
    if (objectType == 'user') {
      name = object.uid + " ( " + object.givenName + " " + object.surName + " )";
    } else {
      name = object.name;
    }
    let serverResponse: ServerResponse;
    var a = this.modifyObject(object, objectType).subscribe(
      (val) => {
        serverResponse = val;
        if (serverResponse.code == "OK") {
          this.getAllObject(objectType);
          this.okMessage(this.languageS.trans(objectType + " was modified"));
        } else {
          this.errorMessage(this.languageS.trans(serverResponse.value));
        }
      },
      (err) => {
        console.log(err);
        this.errorMessage(this.languageS.trans("An error was accoured"));
      },
      () => { a.unsubscribe() }
    );
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
  typeOf(key: string, object, action: string) {
    let obj = object[key];
    if (key == 'birthDay' || key == 'validity' || key == 'recDate' || key == 'validFrom' || key == 'validUntil') {
      return "date";
    }
    if (key == 'reminder' || key == 'created') {
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
    if (key == 'name' && object.regCode) {
      return 'string';
    }
    if (action == 'edit' && this.readOnlyAttributes.indexOf(key) != -1) {
      return "stringRO";
    }
    if (key.substring(key.length - 2) == 'Id') {
      return "idPipe";
    }
    return "string";
  }

  convertObject(object) {
    //TODO introduce checks
    let output: any = {};
    for (let key in object) {
      if (key == 'birthDay' || key == 'validity' || key == 'recDate' || key == 'validFrom' || key == 'validUntil' || key == 'created') {
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
