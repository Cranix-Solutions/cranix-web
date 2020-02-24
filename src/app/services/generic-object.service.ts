import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilsService } from './utils.service';
import { AuthenticationService } from './auth.service';
import { ServerResponse } from 'src/app/shared/models/server-models';
import { timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenericObjectService {

  defaults: any;
  initialized: boolean = false;

  constructor(
    private http: HttpClient,
    private utilsS: UtilsService,
    private authS: AuthenticationService) { }

  applyAction(object, objectType, action) {
    if (action == "add") {
      return this.addObject(object, objectType);
    } else {
      return this.modifyObject(object, objectType);
    }
  }
  addObject(object, objectType) {
    const body = object;
    let url = this.utilsS.hostName() + "/" + objectType + "s/add";
    const headers = new HttpHeaders({
      'Content-Type': "application/json",
      'Accept': "application/json",
      'Authorization': "Bearer " + this.authS.getToken()
    });
    return this.http.post<ServerResponse>(url, body, { headers: headers });
  }
  modifyObject(object, objectType) {
    const body = object;
    let id = object.id;
    let url = this.utilsS.hostName() + "/" + objectType + "s/" + id ;
    const headers = new HttpHeaders({
      'Content-Type': "application/json",
      'Accept': "application/json",
      'Authorization': "Bearer " + this.authS.getToken()
    });
    return this.http.post<ServerResponse>(url, body, { headers: headers })
  }

  initialize() {
    if(this.initialized) {
      return;
    }
  }
}
