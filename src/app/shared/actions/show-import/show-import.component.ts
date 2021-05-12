import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AlertController } from '@ionic/angular';
//Own stuff
import { UsersImport } from 'src/app/shared/models/data-model';

@Component({
  selector: 'cranix-show-import',
  templateUrl: './show-import.component.html',
  styleUrls: ['./show-import.component.scss'],
})
export class ShowImportComponent implements OnInit {

  
  @Input() import: UsersImport;
  constructor(
    public alertController: AlertController,
    private modalController: ModalController,
    public translateService: TranslateService
  ) {
  }

  ngOnInit() {}

  closeWindow(){
    this.modalController.dismiss();;
  }
}
