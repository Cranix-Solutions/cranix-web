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

  onSubmit() {
      let fd = new FormData();
      fd.append('projectName', this.projectName);
      fd.append('objectIds', this.actionMap.objectIds.join(","));
      fd.append('studentsOnly', this.studentsOnly ? "true" : "false");
      fd.append('sortInDirs', this.sortInDirs ? "true" : "false");
      fd.append('cleanUpExport', this.cleanUpExport ? "true" : "false");
      this.educationController.collectDataFromObjects(fd, this.objectType);
      this.modalController.dismiss();
    }
}
