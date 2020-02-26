import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilsService } from './utils.service';
import { AuthenticationService } from './auth.service';
import { Subscription } from 'rxjs';
import { ServerResponse } from 'src/app/shared/models/server-models';

@Injectable({
  providedIn: 'root'
})
export class GenericObjectService {

  selects: any = {};
  initialized: boolean = false;
  enumerates: string[] = [
    'institutetype','groupType','deviceType','roomType','roomControl','network','accessType','role'
  ];
  headers : HttpHeaders;
  private subscriptions: Subscription[] = [];

  constructor(
    private http: HttpClient,
    private utilsS: UtilsService,
    private authS: AuthenticationService)
    {}

    initialize(force: boolean) {
      if (force || !this.initialized) {
        this.headers =  new HttpHeaders({
          'Content-Type': "application/json",
          'Accept': "application/json",
          'Authorization': "Bearer " + this.authS.getToken()
        });
        for( let key of  this.enumerates ){
          let url = this.utilsS.hostName() + "/system/enumerates/" + key;
          this.http.get<string[]>(url, { headers: this.headers }).subscribe(
            (val)=> {
              this.selects[key] = val;
            });
        }
        this.initialized = true;
      }
    }
  applyAction(object, objectType, action) {
    switch (action) {
      case "add": {
        return this.addObject(object, objectType);
      }
      case "modify": {
        return this.modifyObject(object, objectType);
      }
    }
  }

  addObject(object, objectType) {
    const body = object;
    let url = this.utilsS.hostName() + "/" + objectType + "s/add";
    return this.http.post<ServerResponse>(url, body, { headers: this.headers });
  }
  modifyObject(object, objectType) {
    const body = object;
    let url = this.utilsS.hostName() + "/" + objectType + "s/" + object.id;
    return this.http.post<ServerResponse>(url, body, { headers: this.headers })
  }
}
