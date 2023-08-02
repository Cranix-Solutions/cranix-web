import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device, Printer } from 'src/app/shared/models/data-model';
import { UtilsService } from './utils.service';
import { ServerResponse } from 'src/app/shared/models/server-models';
import { AuthenticationService } from './auth.service';

@Injectable()
export class PrintersService {

	hostname: string;
	url:      string;

	constructor(
		private utils: UtilsService,
		private http: HttpClient,
		private authService: AuthenticationService) {
		this.hostname = this.utils.hostName();
	}
	add(imp: FormData) {
		this.url = this.hostname + `/printers/add`;
		return this.http.post<ServerResponse>(this.url, imp, { headers: this.authService.formHeaders });
	}
	addQueue(imp: FormData) {
		this.url = this.hostname + `/printers/addQueue`;
		return this.http.post<ServerResponse>(this.url, imp, { headers: this.authService.formHeaders });
	}
	setDriver(id: number, imp: FormData) {
		this.url = this.hostname + `/printers/${id}/setDriver`;
		return this.http.post<ServerResponse>(this.url, imp, { headers: this.authService.formHeaders });
	}

	getDrivers() {
		this.url = this.hostname + '/printers/availableDrivers';
		return this.http.get<any>(this.url, { headers: this.authService.headers });
	}

	getPrinterDevices() {
		this.url = this.hostname + '/printers/allDevices';
		return this.http.get<Device[]>(this.url, { headers: this.authService.headers });
	}

	reset(id: number) {
		this.url = this.hostname + `/printers/${id}/reset`;
		return this.http.put<ServerResponse>(this.url, null, { headers: this.authService.headers });
	}
	toggle(id: number, what: string, yesno: boolean) {
		this.url = this.hostname + `/printers/${id}/`;
		switch (what) {
			case 'acceptingJobs': {
				if (yesno) {
					this.url = this.url + 'enable';
				} else {
					this.url = this.url + 'disable';
				}
				break;
			}
			case  'windowsDriver': {
				this.url = this.url + 'activateWindowsDriver';
			}
		}
		//console.log(`PrintersService ${id} ${what} ${yesno} ${this.url}`)
		return this.http.put<ServerResponse>(this.url, null, { headers: this.authService.headers });
	}
}
