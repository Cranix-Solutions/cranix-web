import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

//own modules
import { UtilsService } from './utils.service';
import { AuthenticationService } from './auth.service';;
import { ServerResponse } from 'src/app/shared/models/server-models';
import { CrxCalendar } from 'src/app/shared/models/data-model';

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
    console.log(url)
    return this.http.post<ServerResponse>(url, event, { headers: this.authService.headers })
  }

  modify(event: CrxCalendar) {
    let url = this.hostname + "/calendar"
    console.log(url)
    return this.http.patch<ServerResponse>(url, event, { headers: this.authService.headers })
  }

  delete(event: CrxCalendar) {
    let url = this.hostname + "/calendar/" + event.id
    console.log(url)
    return this.http.delete<ServerResponse>(url, { headers: this.authService.headers })
  }

  get() {
    let url = this.hostname + "/calendar"
    if(this.authService.isAllowed('calendar.manage')) {
      url = this.hostname + "/calendar/all"
    }
    console.log(url)
    return this.http.get<CrxCalendar[]>(url, { headers: this.authService.headers })
  }

  getFiltered(map: any) {
    let url = this.hostname + "/calendar/filter"
    console.log(url)
    return this.http.post<CrxCalendar[]>(url, map, { headers: this.authService.headers })
  }

  getById(id: string) {
    let url = this.hostname + "/calendar/" + id
    console.log(url)
    return this.http.get<CrxCalendar>(url, { headers: this.authService.headers })
  }

  importTimeTable(imp: FormData) {
		let url = this.hostname + `/calendar/import`;
		const headers = new HttpHeaders({
			'Accept': "application/json",
			'Authorization': "Bearer " + this.authService.session.token
		});
		console.log(url)
		return this.http.post<ServerResponse>(url, imp, { headers: headers });
	}
}