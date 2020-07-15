import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { CrxActionMap } from '../../models/server-models';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { EductaionService } from 'src/app/services/education.service';

@Component({
  selector: 'cranix-files-upload',
  templateUrl: './files-upload.component.html',
  styleUrls: ['./files-upload.component.scss'],
})
export class FilesUploadComponent implements OnInit {
  public files: FileList;
  studentsOnly: boolean = true;
  cleanUp: boolean = true;
  objectType: string = "user";
  actionMap: CrxActionMap;

  constructor(
    public educationController: EductaionService,
    public modalController: ModalController,
    private navParams: NavParams
  ) {
  }

  ngOnInit() {
    this.actionMap = this.navParams.get('actionMap');
    let type = this.navParams.get('objectType');
    this.objectType = type.replace("education/", "");
   }

  onSubmit(object) {
    for (let i = 0; i < this.files.length; i++) {
      let fd = new FormData();
      fd.append('file', this.files[i], this.files[i].name);
      fd.append('objectIds', this.actionMap.objectIds.join(","));
      if (this.objectType == "group") {
        fd.append('studentsOnly', object.studentsOnly ? "true" : "false");
      }
      if (i == 0) {
        fd.append('cleanUp', object.cleanUp ? "true" : "false");
      } else {
        fd.append('cleanUp', "false");
      }
      console.log(object);
      console.log(this.objectType);
      this.educationController.uploadDataToObjects(fd, this.objectType);
    }
  }
  onFilesAdded(files: FileList) {
    this.files = files;
  }
}
