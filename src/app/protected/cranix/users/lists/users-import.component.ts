import { Component, OnInit, ɵSWITCH_RENDERER2_FACTORY__POST_R3__, AfterContentInit } from '@angular/core';
import { GridOptions, GridApi, ColumnApi } from 'ag-grid-community';
import { PopoverController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

//own modules
import { ActionsComponent } from 'src/app/shared/actions/actions.component';
import { DateTimeCellRenderer } from 'src/app/pipes/ag-datetime-renderer';
import { ActionBTNRenderer } from 'src/app/pipes/ag-action-renderer';
import { ObjectsEditComponent } from 'src/app/shared/objects-edit/objects-edit.component';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { UsersService } from 'src/app/services/users.service';
import { LanguageService } from 'src/app/services/language.service';
import { SelectColumnsComponent } from 'src/app/shared/select-columns/select-columns.component';
import { User,  UsersImport } from 'src/app/shared/models/data-model'
import { AuthenticationService } from 'src/app/services/auth.service';

@Component({
  selector: 'cranix-users-import',
  templateUrl: './users-import.component.html'
})
export class UsersImportComponent implements OnInit {
  objectKeys: string[] = [];
  imports: UsersImport[] = [];
  runningImport: UsersImport = null;

  constructor(
    private usersService: UsersService,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public languageS: LanguageService,
    public route: Router
  ) {  }

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
}