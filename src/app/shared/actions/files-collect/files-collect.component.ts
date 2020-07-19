import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { CrxActionMap } from '../../models/server-models';
import { EductaionService } from 'src/app/services/education.service';

@Component({
  selector: 'cranix-files-collect',
  templateUrl: './files-collect.component.html',
  styleUrls: ['./files-collect.component.scss'],
})
export class FilesCollectComponent implements OnInit {

  projectName: string = "";
  sortInDirs: boolean = true;
  studentsOnly: boolean = true;
  cleanUpExport: boolean = true;
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
      let fd = new FormData();
      fd.append('projectName', object.projectName);
      fd.append('objectIds', this.actionMap.objectIds.join(","));
      if (this.objectType == "group") {
        fd.append('studentsOnly', object.studentsOnly ? "true" : "false");
      }
      fd.append('sortInDirs', object.sortInDirs ? "true" : "false");
      fd.append('cleanUpExport', object.cleanUpExport ? "true" : "false");
      this.educationController.collectDataFromObjects(fd, this.objectType);
    }
}
