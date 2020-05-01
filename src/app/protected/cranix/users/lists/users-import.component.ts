import { Component, OnInit, ɵSWITCH_RENDERER2_FACTORY__POST_R3__, AfterContentInit } from '@angular/core';
import { GridOptions, GridApi, ColumnApi } from 'ag-grid-community';
import { PopoverController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

//own modules
import { ShowImportComponent } from 'src/app/shared/actions/show-import/show-import.component';
import { UsersService } from 'src/app/services/users.service';
import { LanguageService } from 'src/app/services/language.service';
import { User, UsersImport } from 'src/app/shared/models/data-model';
import { ObjectsEditComponent } from 'src/app/shared/objects-edit/objects-edit.component';
import { GenericObjectService } from 'src/app/services/generic-object.service';

@Component({
  selector: 'cranix-users-import',
  templateUrl: './users-import.component.html'
})
export class UsersImportComponent implements OnInit {
  objectKeys: string[] = [];
  imports: UsersImport[] = [];
  runningImport: UsersImport = null;

  constructor(
    public objectService: GenericObjectService,
    private usersService: UsersService,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public languageS: LanguageService,
    public route: Router
  ) { }

  ngOnInit() {
    let subs = this.usersService.getAllImports().subscribe(
      (val) => { this.imports = val },
      (err) => { console.log(err) },
      () => { subs.unsubscribe() }
    )
    let subs1 = this.usersService.getRunningImport().subscribe(
      (val) => { this.runningImport = val },
      (err) => { console.log(err) },
      () => { subs1.unsubscribe() }
    )
  }

  async stopImport() {
    //TODO
  }

  async startImport() {
    let userImport = new UsersImport();
    userImport.importFile = "";
    delete userImport.result;
    const modal = await this.modalCtrl.create({
      component: ObjectsEditComponent,
      componentProps: {
        objectType: "userImport",
        objectAction: "add",
        object: userImport
      },
      animated: true,
      swipeToClose: true,
      showBackdrop: true
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        console.log("Object was created or modified", dataReturned.data)
      }
    });
    (await modal).present();
  }

  async showImport(ev: Event, userImport: UsersImport) {
    const popover = await this.modalCtrl.create({
      component: ShowImportComponent,
      componentProps: {
        import: userImport
      },
      animated: true,
      showBackdrop: true
    });
    (await popover).present();
  }

  onResize(ev: Event) {
  }
  restartImport(startTime: string) {
    //TODO
  }
  downloadImport(startTime: string, type: string) {
    //TODO
  }
  deleteImport(startTime: string) {
    //TODO
  }

}
