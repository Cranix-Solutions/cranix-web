import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//own modules
import { UtilsService } from './utils.service';
import { AuthenticationService } from './auth.service';;
import { ServerResponse } from 'src/app/shared/models/server-models';
import { CrxCalendar } from '../shared/models/data-model';

@Injectable({
  providedIn: 'root'
})
export class CrxCalendarService {

  hostname: string;
  modified: boolean = false;

  constructor(
    private http: HttpClient,
    private utilsS: UtilsService,
    private authService: AuthenticationService) {
    this.hostname = this.utilsS.hostName();
  }

  add(event: CrxCalendar) {
    let url = this.hostname + "/calendar"
    return this.http.post<ServerResponse>(url, event, { headers: this.authService.headers })
  }

  modify(event: CrxCalendar) {
    let url = this.hostname + "/calendar"
    return this.http.patch<ServerResponse>(url, event, { headers: this.authService.headers })
  }

  delete(event: CrxCalendar) {
    let url = this.hostname + "/calendar/" + event.id
    return this.http.delete<ServerResponse>(url, { headers: this.authService.headers })
  }

  get() {
    let url = this.hostname + "/calendar/"
    return this.http.get<CrxCalendar[]>(url, { headers: this.authService.headers })
  }

  getById(id: string) {
    let url = this.hostname + "/calendar/" + id
    return this.http.get<CrxCalendar>(url, { headers: this.authService.headers })
  }
}