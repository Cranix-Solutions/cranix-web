import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { CrxActionMap } from '../../models/server-models';
import { EductaionService } from 'src/app/services/education.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';

@Component({
  selector: 'cranix-files-upload',
  templateUrl: './files-upload.component.html',
  styleUrls: ['./files-upload.component.scss'],
})
export class FilesUploadComponent implements OnInit {
  public files: FileList;
  studentsOnly: boolean = true;
  cleanUp: boolean = false;
  objectType: string = "user";
  actionMap: CrxActionMap;

  constructor(
    public educationController: EductaionService,
    public modalController: ModalController,
    private navParams: NavParams,
    private objectService: GenericObjectService
  ) {
  }

  ngOnInit() {
    this.actionMap = this.navParams.get('actionMap');
    let type = this.navParams.get('objectType');
    this.objectType = type.replace("education/", "");
  }

  onSubmit(object) {
    let i = 0;
    this.educationController.uploadState.next(false)
    this.objectService.requestSent();
    console.log(this.actionMap)
    let subs = this.educationController.uploadState.subscribe(state => {
      if (!state) {
        let fd = new FormData();
        fd.append('file', this.files[i], this.files[i].name);
        fd.append('objectIds', this.actionMap.objectIds.join(","));
        if (this.objectType == "group") {
          fd.append('studentsOnly', this.studentsOnly ? "true" : "false");
        }
        if (i == 0) {
          console.log("cleanUp",this.cleanUp ? "true" : "false")
          fd.append('cleanUp', this.cleanUp ? "true" : "false");
        } else {
          fd.append('cleanUp', "false");
        }
        this.educationController.uploadDataToObjects(fd, this.objectType);
        i++;
        console.log(i, this.files.length)
        if (i == this.files.length) {
          console.log("logout")
          this.modalController.dismiss();
          subs.unsubscribe();
          return;
        }
      }
    });
  }
  onFilesAdded(files: FileList) {
    this.files = files;
  }
}
