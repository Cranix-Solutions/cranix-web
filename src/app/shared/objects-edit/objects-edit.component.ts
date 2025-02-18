import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
//own
import { CephalixService } from 'src/app/services/cephalix.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService } from 'src/app/services/language.service';
import { UsersService } from 'src/app/services/users.service';
import { SystemService } from 'src/app/services/system.service';
import { SupportRequest, SoftwareVersion, SoftwareFullName } from '../models/data-model';
import { AuthenticationService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from 'src/app/services/utils.service';
@Component({
  selector: 'cranix-objects-edit',
  templateUrl: './objects-edit.component.html',
  styleUrls: ['./objects-edit.component.scss'],
})
export class ObjectsEditComponent implements OnInit {
  formData: FormData = new FormData();
  disabled: boolean = false;
  fileToUpload: File = null;
  result: any = {};
  objectId: number;
  objectActionTitle: string = "";
  fixedRole: string;

  patterns = {
    'room': {
      'name': '\\S+'
    },
    'adhocroom': {
      'name': '\\S+'
    }
  }

  @Input() object: any
  @Input() objectType: string
  @Input() objectAction: string
  @Input() objectKeys: string[]
  constructor(
    private utilsS: UtilsService,
    public authService: AuthenticationService,
    private http: HttpClient,
    public cephalixService: CephalixService,
    public objectService: GenericObjectService,
    public languageS: LanguageService,
    private modalController: ModalController,
    private usersService: UsersService,
    private systemService: SystemService,
    public translateService: TranslateService,
    public toastController: ToastController
  ) {

  }
  ngOnInit() {
    this.objectId = this.object.id;
    //User role may be constant:
    if (this.objectType.split("\.").length == 2) {
      let tmp = this.objectType.split("\.")
      this.objectType = tmp[0]
      this.fixedRole = tmp[1]
      this.object.role = this.fixedRole
    }
    if (this.objectAction == 'add') {
      this.objectActionTitle = "Add " + this.objectType;
    } else {
      this.objectActionTitle = "Edit " + this.objectType;
    }
    if (!this.objectKeys) {
      this.objectKeys = Object.getOwnPropertyNames(this.object);
    }
    this.disabled = false;
    if (this.objectAction != 'add' && this.objectType != 'settings') {
      let url = this.utilsS.hostName() + "/" + this.objectType + "s/" + this.object.id;
      let sub = this.http.get(url, { headers: this.authService.headers }).subscribe(
        (val) => {
          for (let key of this.objectKeys) {
            if (this.objectService.typeOf(key, this.object, 'edit') == 'multivalued') {
              let s = val[key]
              this.object[key] = s.join()
            } else if (key == 'validity' || key == 'created' || key == 'validFrom' || key == 'validUntil' || key == 'modified') {
              this.object[key] = new Date(val[key]).toJSON().replace(".000Z","");
             } else {
              this.object[key] = val[key];
            }
          }
          console.log(this.object)
          console.log(this.objectKeys)
        }
      );
    }
  }

  closeWindow() {
    this.modalController.dismiss();
  }

  setNextDefaults() {
    let subs = this.cephalixService.getNextDefaults().subscribe(
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

  onSubmit() {
    if (this.disabled) {
      return;
    }
    for (let key of this.objectKeys) {
      if (this.objectService.typeOf(key, this.object, 'edit') == 'multivalued') {
        let s: string = this.object[key];
	      if(s) { this.object[key] = s.split(",") }
       	else { this.object[key] = [] }
      }
    }
    this.disabled = true;
    this.objectService.requestSent();
    console.log("onSubmit", this.object);
    if (this.objectType == 'settings') {
      return this.modalController.dismiss(this.object);
    }
    switch (this.objectType) {
      case 'userImport': {
        this.userImport(this.object);
        break;
      }
      case 'support': {
        this.object['description'] = this.object.text;
        delete this.object.text;
        this.supportRequest(this.object);
        break;
      }
      case 'software': {
        let sv = new SoftwareVersion();
        let fn = new SoftwareFullName();
        sv.version = this.object.version;
        sv.status = 'C';
        fn.fullName = this.object.name
        this.object['softwareVersions'] = [{ 'version': this.object.version, 'status': 'C' }]
        this.object['softwareFullNames'] = [{ 'fullName': this.object.name }]
        console.log("new software", this.object)
      }
      default: {
        this.defaultAction(this.object);
      }
    }
    for (let key of this.objectKeys) {
      if (this.objectService.typeOf(key, this.object, 'edit') == 'multivalued') {
        this.object[key]  = this.object[key].join(',')
      }
    }
  }

  handleFileInput(event) {
    this.fileToUpload = event.target.files.item(0);
    console.log(this.fileToUpload)
  }
  defaultAction(object) {
    let subs = this.objectService.applyAction(object, this.objectType, this.objectAction).subscribe(
      (val) => {
        this.objectService.responseMessage(val);
        if (val.code == "OK") {
          this.objectService.getAllObject(this.objectType);
          this.modalController.dismiss("succes");
        } else {
          this.disabled = false;
        }
      },
      (error) => {
        this.objectService.errorMessage("A Server Error is accoured:" + error);
        this.disabled = false;
      },
      () => {
        subs.unsubscribe();
      }
    )
  }
  deleteObject() {
    this.objectService.deleteObjectDialog(this.object, this.objectType, '');
    //this.modalController.dismiss("succes");
  }
  supportRequest(object: SupportRequest) {
    let subs = this.systemService.createSupportRequest(object).subscribe(
      (val) => {
        this.objectService.responseMessage(val);
        if (val.code == "OK") {
          this.modalController.dismiss("succes");
        } else {
          this.disabled = false;
        }
      },
      (error) => {
        this.objectService.errorMessage("A Server Error is accoured:" + error.toString());
      },
      () => {
        subs.unsubscribe();
      }
    )
  }
  userImport(object) {
    let formData: FormData = new FormData();
    formData.append('file', this.fileToUpload, this.fileToUpload.name);
    formData.append('role', object.role);
    formData.append('lang', object.lang);
    formData.append('identifier', object.identifier);
    formData.append('test', object.test ? "true" : "false");
    formData.append('password', object.password);
    formData.append('mustChange', object.mustChange ? "true" : "false");
    formData.append('full', object.full ? "true" : "false");
    formData.append('allClasses', object.allClasses ? "true" : "false");
    formData.append('cleanClassDirs', object.cleanClassDirs ? "true" : "false");
    formData.append('resetPassword', object.resetPassword ? "true" : "false");
    formData.append('appendBirthdayToPassword', object.appendBirthdayToPassword ? "true" : "false");
    formData.append('appendClassToPassword', object.appendClassToPassword ? "true" : "false");
    console.log(object.test);
    console.log(object.password);
    console.log(this.formData.get("role"))
    let subs = this.usersService.importUsers(formData).subscribe(
      (val) => {
        this.objectService.responseMessage(val);
        if (val.code == "OK") {
          this.modalController.dismiss("succes");
        } else {
          this.disabled = false;
        }
      },
      (error) => {
        console.log(error)
        this.objectService.errorMessage("A Server Error is accoured:" + error);
        this.disabled = false;
      },
      () => {
        subs.unsubscribe();
      }
    )
  }

  getPattern(key: string){
    if ( this.patterns[this.objectType] && this.patterns[this.objectType][key] ) {
      return this.patterns[this.objectType][key]
    }
    return null;
  }
}


