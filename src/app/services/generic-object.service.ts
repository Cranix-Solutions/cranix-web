import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
// own modules
import { ServerResponse } from 'src/app/shared/models/server-models';
import { Package } from 'src/app/shared/models/data-model';
import { UtilsService } from './utils.service';
import { AuthenticationService } from './auth.service';
import { LanguageService } from './language.service';
@Injectable({
  providedIn: 'root'
})
export class GenericObjectService {
  allObjects: any = {};
  selectedObject: any = null;
  selectedRoom: any = null;
  selectedGroup: any = null;
  packagesAvailable: Package[] = [];

  /**
   * The base objects which need to be loaded by the initialisations
   */
  objects: string[] = [
    'user', 'group', 'room', 'device', 'hwconf', 'printer','adhocroom','education/user','education/group'
  ]
  /**
   * Default.ini for cephalix
   */
  cephalixDefaults: any = {};

  selects: any = {
    'action': ['wol', 'reboot', 'shutdown', 'logout'],
    'agGridThema': [ 'ag-theme-material','ag-theme-alpine', 'ag-theme-balham'],
    'devCount': [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096],
    'identifier': ['sn-gn-bd', 'uuid', 'uid'],
    'lang': ['DE', 'EN'],
    'status': ['N', 'A', 'D'],
    'supporttype': ['Error', 'FeatureRequest', 'Feedback', 'ProductOrder']
  }
  initialized: boolean = false;
  enumerates: string[] = [
    'instituteType', 'groupType', 'deviceType', 'roomType', 'roomControl', 'network', 'accessType', 'role', 'noticeType'
  ];

  multivalued: string[] = [
    'softwareVersions','softwareFullNames'
  ]

  /**
   * Attributes which can not be modified
   */
  readOnlyAttributes: string[] = [
    'id',
    'accessType',
    'classes',
    'devCount',
    'fsQuotaUsed',
    'ip',
    'msQuotaUsed',
    'name',
    'network',
    'ownerName',
    'recDate',
    'role',
    'sourceAvailable',
    'startIp',
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
    'identifier': "*",
    'instituteType': '*',
    'importFile': "*",
    'name': '*',
    'regCode': '*',
    'role': '*',
    'surName': '*'
  };

  constructor(
    public alertController: AlertController,
    public authService: AuthenticationService,
    private http: HttpClient,
    private languageS: LanguageService,
    private utilsS: UtilsService,
    private modalCtrl: ModalController,
    public toastController: ToastController) {
  }

  initialize(force: boolean) {
    if (this.authService.isAllowed('cephalix.manage')) {
      this.initializeCephalixObjects();
    }
    if (this.authService.isAllowed('customer.manage')) {
      this.objects.push('customer');
    }
    if (this.authService.isAllowed('cephalix.ticket')) {
      this.objects.push('ticket');
    }
    for (let key of this.objects) {
      this.allObjects[key] = new BehaviorSubject([]);
    }
    let subs: any = {};
    if(force || !this.initialized) {
      this.authService.log("initialize all abjects")
      for (let key of this.objects) {
        this.getAllObject(key);
      }
      for (let key of this.enumerates) {
        let url = this.utilsS.hostName() + "/system/enumerates/" + key;
        subs[key] = this.http.get<string[]>(url, { headers: this.authService.headers }).subscribe(
          (val) => { this.selects[key] = val; },
          (err) => { },
          () => { subs[key].unsubscribe() });
      }
      if (this.authService.isAllowed('software.download')) {
        this.getSoftwaresToDowload();
      }
      this.initialized = true;
    }
  }

  initializeCephalixObjects() {
    this.objects.push('institute');
    let url = this.utilsS.hostName() + "/institutes/defaults/";
    let sub1 = this.http.get<string[]>(url, { headers: this.authService.headers }).subscribe(
      (val) => { this.cephalixDefaults = val; },
      (err) => { },
      () => { sub1.unsubscribe() });
    url = this.utilsS.hostName() + "/institutes/ayTemplates/";
    let sub2 = this.http.get<string[]>(url, { headers: this.authService.headers }).subscribe(
      (val) => { this.selects['ayTemplate'] = val; },
      (err) => { },
      () => { sub2.unsubscribe() });
    url = this.utilsS.hostName() + "/institutes/objects/";
    let sub3 = this.http.get<string[]>(url, { headers: this.authService.headers }).subscribe(
      (val) => { this.selects['objects'] = val; },
      (err) => { },
      () => { sub3.unsubscribe() });
  }
  getSoftwaresToDowload() {
    let url = this.utilsS.hostName() + "/softwares/available";
    let sub = this.http.get<Package[]>(url, { headers: this.authService.headers }).subscribe(
      (val) => {
        this.packagesAvailable = val;
      },
      (err) => {
        console.log('getSoftwaresToDowload');
        console.log(err)
      },
      () => { sub.unsubscribe() });
  }
  /**
   * Loads the object of type 'objectType' from the server
   * @param objectType
   */
  getAllObject(objectType) {
    let url = this.utilsS.hostName() + "/" + objectType + "s/all";
    let sub = this.http.get(url, { headers: this.authService.headers }).subscribe(
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

  getObjectById(objectType, objectId) {
    for (let obj of this.allObjects[objectType].getValue()) {
      if (obj.id === objectId) {
        return obj;
      }
    }
    return null;
  }

  idToName(objectType, objectId) {
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
  idToFulName(objectId) {
    for (let obj of this.allObjects['user'].getValue()) {
      if (obj.id === objectId) {
        return obj.surName + ", " + obj.givenName;
      }
    }
    return objectId;
  }
  /**
   * Converts the id name to the object name:
   *  roomId -> room
   *  roomIds -> room
   * @param idName
   */
  idToPipe(idName: string) {
    if (idName == 'cephalixCustomerId') {
      return 'customer';
    }
    if (idName == 'cephalixInstituteId') {
      return 'institute';
    }
    if (idName.substring(idName.length - 2) == 'Id' )
    {
      return idName.substring(0, idName.length - 2)
    }
    if( idName.substring(idName.length - 3) == 'Ids' )  {
      return idName.substring(0, idName.length - 3)
    }
  }

  addObject(object, objectType) {
    const body = object;
    let url = this.utilsS.hostName() + "/" + objectType + "s/add";
    return this.http.post<ServerResponse>(url, body, { headers: this.authService.headers });
  }
  modifyObject(object, objectType) {
    const body = object;
    let url = this.utilsS.hostName() + "/" + objectType + "s/" + object.id;
    return this.http.post<ServerResponse>(url, body, { headers: this.authService.headers })
  }
  deleteObject(object, objectType) {
    let url = this.utilsS.hostName() + "/" + objectType + "s/" + object.id;
    return this.http.delete<ServerResponse>(url, { headers: this.authService.headers })
  }

  async deleteObjectDialog(object, objectType) {
    let name = "";
    if (objectType == 'user') {
      name = object.uid + " ( " + object.givenName + " " + object.surName + " )";
    } else {
      name = object.name;
    }
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
                this.responseMessage(val);
                if (val.code == "OK") {
                  this.getAllObject(objectType);
                  this.modalCtrl.dismiss("success");
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
    var a = this.modifyObject(object, objectType).subscribe(
      (val) => {
        this.responseMessage(val);
        if (val.code == "OK") {
          this.getAllObject(objectType);
        }
      },
      (err) => {
        console.log("ERROR: modifyObjectDialog")
        console.log(object)
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
      duration: this.authService.settings.errorMessageDuration * 1000,
      buttons: [
        {
          text: "",
          role: "cancel",
          icon: "close",
          handler: () => {
            toast.dismiss();
          }
        }
      ]
    });
    (await toast).present();
  }

  responseMessage(resp: ServerResponse) {
    if (resp.code == 'OK') {
      return this.okMessage(this.languageS.transResponse(resp));
    } else {
      return this.errorMessage(this.languageS.transResponse(resp));
    }
  }

  async okMessage(message: string) {
    const toast = await this.toastController.create({
      position: "middle",
      message: message,
      cssClass: "bar-assertive",
      color: "success",
      duration: this.authService.settings.okMessageDuration * 1000,
      buttons: [
        {
          text: "",
          role: "cancel",
          icon: "close",
          handler: () => {
            toast.dismiss();
          }
        }
      ]
    });
    (await toast).present();
  }
  async warningMessage(message) {
    const toast = await this.toastController.create({
      position: "middle",
      message: message,
      cssClass: "bar-assertive",
      color: "warning",
      duration: this.authService.settings.warningMessageDuration * 1000,
      buttons: [
        {
          text: "",
          role: "cancel",
          icon: "close",
          handler: () => {
            toast.dismiss();
          }
        }
      ]
    });
    (await toast).present();
  }
  selectObject() {
    return this.warningMessage(this.languageS.trans('Please select at last one object!'));
  }
  requestSent() {
    return this.warningMessage(this.languageS.trans('Request was sent. Please be patient!'));
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
    if (key == 'text' || key == 'domains' ) {
      return "text";
    }
    if (typeof obj === 'boolean' && obj) {
      return "booleanTrue";
    }
    if (typeof obj === 'boolean') {
      return "booleanFalse";
    }
    if ( action == 'modify' && this.hiddenAttributes.indexOf(key) != -1) {
      return "hidden";
    }
    if (key == 'name' && object.regCode) {
      return 'string';
    }
    if (action == 'modify' && this.readOnlyAttributes.indexOf(key) != -1) {
      return "stringRO";
    }
    if (key.substring(key.length - 2) == 'Id' ) {
      return "idPipe";
    }
    if( key.substring(key.length - 3) == 'Ids' )  {
      return "idsPipe";
    }
    if (key.substring(key.length - 4) == 'File') {
      return 'file';
    }
    if( this.multivalued.indexOf(key) != -1 ) {
      return 'multivalued';
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
      } else {
        output[key] = object[key];
      }
    }
    return output;
  }
}
