import { Component, OnInit } from '@angular/core';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { AuthenticationService } from 'src/app/services/auth.service';
import { ModalController } from '@ionic/angular';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { ManageAclsComponent } from './manage-acls/manage-acls.component';

@Component({
  selector: 'cranix-system-acls',
  templateUrl: './system-acls.component.html',
  styleUrls: ['./system-acls.component.scss'],
})
export class SystemAclsComponent implements OnInit {
  context;
  groupsApi;
  usersApi;
  groupsColumnApi;
  usersColumnApi;
  groupsData = []
  usersData  = []
  groupColumnDefs = []
  userColumnDefs  =[]
  defaultColDef = {
    resizable: true,
    sortable: true,
    hide: false,
    suppressMenu : true
  }

  constructor(public authService: AuthenticationService,
    private objectService: GenericObjectService,
    public modalCtrl: ModalController,
    private languageS: LanguageService,
    public translateServices: TranslateService) { }

  ngOnInit() {
    this.context = { componentParent: this };
    this.objectService.getObjects('group').subscribe(obj => this.groupsData = obj);
    this.objectService.getObjects('user').subscribe(obj => this.usersData = obj);
    this.groupColumnDefs = [
      {
        headerName: this.languageS.trans('name'),
        field: 'name'
      },{
        headerName: this.languageS.trans('description'),
        field: 'description'
      },{
        headerName: this.languageS.trans('groupType'),
        field: 'groupType'
      }
    ]
    this.userColumnDefs = [
      {
        headerName: this.languageS.trans('uid'),
        field: 'uid'
      },{
        headerName: this.languageS.trans('surName'),
        field: 'surName'
      },{
        headerName: this.languageS.trans('givenName'),
        field: 'givenName'
      },{
        headerName: this.languageS.trans('role'),
        field: 'role'
      }
    ]
  }

  groupRowClickedHandler(event) {
    console.log('Group row was clicked');
    console.log(event);
    event.context['componentParent'].manageAcls('group',event.data)
  }
  userRowClickedHandler(event) {
    console.log('User row was clicked');
    console.log(event);
    event.context['componentParent'].manageAcls('user',event.data)
  }
  async manageAcls(objectType, object) {
    const modal = await this.modalCtrl.create({
      component: ManageAclsComponent,
      animated: true,
      swipeToClose: true,
      showBackdrop: true,componentProps: {
        objectType: objectType,
        object: object
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.authService.log("Object was created or modified", dataReturned.data)
      }
    });
    (await modal).present();
  }
  groupsReady(params){
    this.groupsApi = params.api;
    this.groupsColumnApi = params.columnApi;
    this.groupsApi.sizeColumnsToFit();
    (<HTMLInputElement>document.getElementById("groupsTable")).style.height = Math.trunc(window.innerHeight * 0.65) + "px";
    this.groupsApi.addEventListener('rowClicked', this.groupRowClickedHandler);
  }

  usersReady(params) {
    this.usersApi = params.api;
    this.usersColumnApi = params.columnApi;
    this.usersApi.sizeColumnsToFit();
    (<HTMLInputElement>document.getElementById("usersTable")).style.height = Math.trunc(window.innerHeight * 0.65) + "px";
    this.usersApi.addEventListener('rowClicked', this.userRowClickedHandler);
  }
  groupFilterChanged() {
    this.groupsApi.setQuickFilter((<HTMLInputElement>document.getElementById('groupFilter')).value);
    this.groupsApi.doLayout();
  }
  userFilterChanged() {
    this.usersApi.setQuickFilter((<HTMLInputElement>document.getElementById('userFilter')).value);
    this.usersApi.doLayout();
  }
}
