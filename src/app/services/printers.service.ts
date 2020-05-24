import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device, Printer } from 'src/app/shared/models/data-model';
import { UtilsService } from './utils.service';
import { ServerResponse } from 'src/app/shared/models/server-models';
import { AuthenticationService } from './auth.service';

@Injectable()
export class PrintersService {

	hostname: string;
	headers: HttpHeaders;
	token: string;
	url: string;


	constructor(
		private utils: UtilsService,
		private http: HttpClient,
		private authS: AuthenticationService) {
		this.hostname = this.utils.hostName();
		this.token = this.authS.getToken();
		this.headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
	}
	add(imp: FormData) {
		this.url = this.hostname + `/printers/add`;
		const headers = new HttpHeaders({
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		console.log(this.url)
		console.log(headers)
		//console.log(imp.get('file'))
		return this.http.post<ServerResponse>(this.url, imp, { headers: headers });
	}

	getDrivers() {
		this.url = this.hostname + '/printers/availableDrivers';
		return this.http.get<any>(this.url, { headers: this.headers });
	}

	reset(id: number) {
		this.url = this.hostname + `/printers/${id}/reset`;
		return this.http.put<ServerResponse>(this.url, null, { headers: this.headers });
	}
	toggle(id: number, what: string, yesno: boolean) {
		this.url = this.hostname + `/printers/${id}/`;
		switch (what) {
			case 'acceptingJobs': {
				if (yesno) {
					this.url = this.url + 'disable';
				} else {
					this.url = this.url + 'enable';
				}
				break;
			}
			case  'windowsDriver': {
				this.url = this.url + 'activateWindowsDriver';
			}
		}
		return this.http.put<ServerResponse>(this.url, null, { headers: this.headers });
	}
}
