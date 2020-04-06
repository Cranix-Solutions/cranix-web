import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
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

  import: UsersImport;
 
  constructor(
    public alertController: AlertController,
    private navParams: NavParams,
    private popoverController: PopoverController,
    public translateService: TranslateService
  ) {
    this.import = this.navParams.get('import');
  }

  ngOnInit() {}

}
