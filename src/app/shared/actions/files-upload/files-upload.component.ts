import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { sprintf } from "sprintf-js";
import { CrxActionMap } from '../../models/server-models';
import { EductaionService } from 'src/app/services/education.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'cranix-files-upload',
  templateUrl: './files-upload.component.html',
  styleUrls: ['./files-upload.component.scss'],
})
export class FilesUploadComponent implements OnInit {
  public files: any[];
  public target1: string;
  public target: string = "";
  studentsOnly: boolean = true;
  cleanUp: boolean = false;

  @Input() actionMap: CrxActionMap;
  @Input() objectType: string;
  constructor(
    public educationController: EductaionService,
    public modalController: ModalController,
    private objectService: GenericObjectService,
    private languageService: LanguageService
  ) {
  }

  ngOnInit() {
    this.objectType = this.objectType.replace("education/", "");
    switch (this.objectType) {
      case 'user': {
        this.target1 = sprintf(this.languageService.trans('to %s users'), this.actionMap.objectIds.length)
        break
      }
      case 'group': {
        if( this.actionMap.objectIds.length == 1) {
          this.target1 = this.languageService.trans('to the group:')
        } else {
          this.target1 = this.languageService.trans('to the groups:')
        }
        for (let id of this.actionMap.objectIds) {
          let group = this.objectService.getObjectById('group', id)
          this.target = this.target + " " + group.name
        }
      }
    }
  }

  onSubmit() {
    let i = 0;
    this.educationController.uploadState.next(false)
    this.objectService.requestSent();
    let subs = this.educationController.uploadState.subscribe(state => {
      console.log(this.actionMap)
      if (!state) {
        let fd = new FormData();
        fd.append('file', this.files[i], this.files[i].name);
        fd.append('objectIds', this.actionMap.objectIds.join(","));
        if (this.objectType == "group") {
          fd.append('studentsOnly', this.studentsOnly ? "true" : "false");
        }
        if (i == 0) {
          fd.append('cleanUp', this.cleanUp ? "true" : "false");
        } else {
          fd.append('cleanUp', "false");
        }
        this.educationController.uploadDataToObjects(fd, this.objectType);
        i++;
        if (i == this.files.length) {
          this.modalController.dismiss();
          subs.unsubscribe();
          return;
        }
      }
    });
  }
  onFilesAdded(event) {
    this.files = event.target.files;
  }
}
