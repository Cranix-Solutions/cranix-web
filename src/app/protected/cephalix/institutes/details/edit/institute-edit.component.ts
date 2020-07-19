import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';

//Own stuff
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { CephalixService } from 'src/app/services/cephalix.service';
import { LanguageService } from 'src/app/services/language.service';
import { Institute } from 'src/app/shared/models/cephalix-data-model';
import { AuthenticationService } from 'src/app/services/auth.service';

@Component({
  selector: 'cranix-institute-edit',
  templateUrl: './institute-edit.component.html',
  styleUrls: ['./institute-edit.component.scss'],
})
export class InstituteEditComponent implements OnInit {
  editForm;
  object: Institute = null;
  objectKeys: string[] = [];
  isourl: string ="";
  constructor(
    public authService: AuthenticationService,
    public cephalixService: CephalixService,
    private languageService: LanguageService,
    public translateService: TranslateService,
    public formBuilder: FormBuilder,
    public objectService: GenericObjectService
  ) {
    this.object = this.objectService.selectedObject;
    if(objectService.cephalixDefaults.createIsoBy && objectService.cephalixDefaults.createIsoBy == 'regCode' ) {
      this.isourl = this.object.regCode;
    } else {
      this.isourl = this.object.uuid;
    }
    let institute = new Institute();
    if( ! this.authService.isAllowed("customer.manage") ){
      delete institute.cephalixCustomerId;
    }
    this.objectKeys = Object.getOwnPropertyNames(institute);
    console.log("InstituteEditComponent:" + this.object.id);
  }
  ngOnInit() {
    this.editForm = this.formBuilder.group(this.objectService.convertObject(this.object));
  }
  public ngAfterViewInit() {
    while (document.getElementsByTagName('mat-tooltip-component').length > 0) { document.getElementsByTagName('mat-tooltip-component')[0].remove(); }
  }
  onSubmit(form) {
    form['id'] = this.object.id;
    this.objectService.modifyObjectDialog(form, "institute");
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
      },
      (err) => { console.log(err) },
      () => { subs.unsubscribe() }
    )
  }

  writeConfig() {
    this.objectService.requestSent();
    let subs = this.cephalixService.writeConfig(this.object.id).subscribe(
      (serverResponse) => {
          this.objectService.responseMessage(serverResponse);
      },
      (err) => { console.log(err) },
      () => { subs.unsubscribe() }
    )
  }
  delete(ev: Event){
     this.objectService.deleteObjectDialog(this.object,'institute');
  }  
}
