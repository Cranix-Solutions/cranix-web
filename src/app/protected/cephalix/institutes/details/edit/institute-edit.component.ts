import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';

//Own stuff
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { CephalixService } from 'src/app/services/cephalix.service';
import { LanguageService } from 'src/app/services/language.service';
import { Institute } from 'src/app/shared/models/cephalix-data-model';

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
    this.objectKeys = Object.getOwnPropertyNames(new Institute());
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
    let subs = this.cephalixService.writeConfig(this.object.id).subscribe(
      (serverResponse) => {
        if (serverResponse.code == "OK") {
          this.objectService.okMessage(this.languageService.trans( "Configuration was written successfully"));
        } else {
          this.objectService.errorMessage(serverResponse.value);
        }
      },
      (err) => { console.log(err) },
      () => { subs.unsubscribe() }
    )
  }
  delete(ev: Event){
     this.objectService.deleteObjectDialog(this.object,'institute');
  }  
}
