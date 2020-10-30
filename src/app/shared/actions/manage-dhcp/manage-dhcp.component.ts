import { Component, OnInit, Input } from '@angular/core';
import { DHCPOptions, DHCPStatements } from './dhcp-constants';
import { CrxMConfig } from 'src/app/shared/models/data-model';
import { UtilsService } from 'src/app/services/utils.service';
import { AuthenticationService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ServerResponse } from '../../models/server-models';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'cranix-manage-dhcp',
  templateUrl: './manage-dhcp.component.html',
  styleUrls: ['./manage-dhcp.component.scss'],
})
export class ManageDhcpComponent implements OnInit {

  myDHCP:       CrxMConfig[];
  url:          string;
  selectedDHCP: any;
  newValue:     string = "";
  dhcpOptions:  any[]  = [];
  @Input() object: any;
  @Input() objectType: string;

  constructor(
    private utilsService: UtilsService,
    private authService: AuthenticationService,
    private http: HttpClient,
    private objectService: GenericObjectService,
    public  modalController: ModalController
  ) {
    let id = 0;
    for( let value of DHCPOptions ) {
        this.dhcpOptions.push({"id":id,"type":"dhcpOptions","name":value})
        id++;
    }
    for( let value of DHCPStatements ) {
      this.dhcpOptions.push({"id":id, "type":"dhcpStatement","name":value})
      id++;
  }
   }

  ngOnInit() {
    let hostname = this.utilsService.hostName();
    this.url     = hostname + `/${this.objectType}s/${this.object.id}/dhcp`
    this.getDHCP();
    
  }


  getDHCP() {
    let subs = this.http.get<CrxMConfig[]>(this.url, { headers: this.authService.headers }).subscribe(
      (val) => { this.myDHCP = val },
      (err) => { console.error(err); },
      () => { subs.unsubscribe(); }
    )
  }

  addDHCP() {
    let tmp = new CrxMConfig();
    tmp.keyword    = this.selectedDHCP.type;
    tmp.value      = this.selectedDHCP.name +" " +this.newValue;
    tmp.objectType = this.objectType;
    tmp.objectId   = this.object.id;
    tmp.id = 0;
    console.log(tmp)
    this.objectService.requestSent();
    let subs = this.http.post<ServerResponse>(this.url, tmp, { headers: this.authService.headers }).subscribe(
      (val) => { this.objectService.responseMessage(val) },
      (err) => { console.log(err)},
      () => { 
        this.getDHCP()
        subs.unsubscribe()}
    )
  }


  deletDHCP(id: number) {
    let myUrl = `${this.url}/${id}`;
    this.objectService.requestSent();
    let subs = this.http.delete<ServerResponse>( myUrl, { headers: this.authService.headers }).subscribe(
      (val) => { this.objectService.responseMessage(val)},
      (err) => { console.error(err); },
      () => { 
        this.getDHCP()
        subs.unsubscribe(); }
    )
  }
}
