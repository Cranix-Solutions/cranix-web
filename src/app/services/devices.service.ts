import { Observable } from 'rxjs/internal/Observable';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device, InstallStateDev, Printer } from 'src/app/shared/models/data-model';
import { UtilsService } from './utils.service';
import { ServerResponse, CrxActionMap } from 'src/app/shared/models/server-models';
import { AuthenticationService } from './auth.service';

@Injectable()
export class DevicesService {

	hostname: string;
	url: string;

	constructor(
		private utils: UtilsService,
		private http: HttpClient,
		private authService: AuthenticationService) {
		this.hostname = this.utils.hostName();
	}

	importDevices(fd: FormData) {
		this.url = this.hostname + `/devices/import`;
		return this.http.post<ServerResponse>(this.url, fd, { headers: this.authService.headers });
	}

	setPrinters(dId: number, printers: any) {
		this.url = this.hostname + `/devices/${dId}/printers`;
		return this.http.post<ServerResponse>(this.url, printers, { headers: this.authService.headers });
	}

	getSoftwareOnDev(id: number) {
		this.url = `${this.hostname}/softwares/devices/${id}`;
		return this.http.get<InstallStateDev[]>(this.url, { headers: this.authService.headers });
	}

	getRoomDevices(id: number) {
		this.url = this.hostname + `/rooms/${id}/devices`;
		return this.http.get<Device[]>(this.url, { headers: this.authService.headers });
	};

	getDevicesByHW(id: number) {
		this.url = this.hostname + `/devices/byHWConf/${id}`;
		return this.http.get<Device[]>(this.url, { headers: this.authService.headers });
	}

	getDevicesById(id: number) {
		this.url = this.hostname + `/devices/${id}`;
		return this.http.get<Device>(this.url, { headers: this.authService.headers });
	}
	getDefaultPrinter(id: number) {
		this.url = `${this.hostname}/devices/${id}/defaultPrinter`;
		return this.http.get<Printer>(this.url, { headers: this.authService.headers });
	}
	getAvailablePrinter(id: number) {
		this.url = `${this.hostname}/devices/${id}/availablePrinters`;
		return this.http.get<Printer[]>(this.url, { headers: this.authService.headers });
	}

	//PUT
	putDefPrinter(dId: number, pId: number) {
		this.url = `${this.hostname}/devices/${dId}/defaultPrinter/${pId}`;
		return this.http.put<ServerResponse>(this.url, null, { headers: this.authService.headers });
	}
	putAvaiPrinter(dId: number, pId: number) {
		this.url = `${this.hostname}/devices/${dId}/availablePrinters/${pId}`;
		return this.http.put<ServerResponse>(this.url, null, { headers: this.authService.headers });
	}

	//DELETE
	deleteDefPrinter(id: number) {
		this.url = this.hostname + `/devices/${id}/defaultPrinter`;
		return this.http.delete<ServerResponse>(this.url, { headers: this.authService.headers });
	}
	deleteAvaiPrinter(dId: number, pId: number) {
		this.url = this.hostname + `/devices/${dId}/availablePrinters/${pId}`;
		return this.http.delete<ServerResponse>(this.url, { headers: this.authService.headers });
	}
	executeAction(actionMap: CrxActionMap) {
		let url = this.hostname + "/devices/applyAction"
		console.log(url)
		console.log(actionMap)
		return this.http.post<ServerResponse[]>(url, actionMap, { headers: this.authService.headers });
	}
}
