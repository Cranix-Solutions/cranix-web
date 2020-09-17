import { Observable } from 'rxjs/internal/Observable';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device, InstallStateDev, Printer, DHCP } from 'src/app/shared/models/data-model';
import { UtilsService } from './utils.service';
import { ServerResponse, CrxActionMap } from 'src/app/shared/models/server-models';
import { AuthenticationService } from './auth.service';

@Injectable()
export class DevicesService {

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


	addDhcp(dId: number, dhcp: DHCP) {
		this.url = this.hostname + `/devices/${dId}/dhcp`;
		return this.http.post<ServerResponse>(this.url, dhcp, { headers: this.headers });
	}
	importDevices(fd: FormData) {
		this.url = this.hostname + `/devices/import`;
		return this.http.post<ServerResponse>(this.url, fd, { headers: this.headers });
	}

	setPrinters(dId: number, printers: any){
		this.url = this.hostname + `/devices/${dId}/printers`;
		return this.http.post<ServerResponse>(this.url, printers, { headers: this.headers });
	}
	// GET Calls
	getDhcp(dId: number) {
		this.url = `${this.hostname}/devices/${dId}/dhcp`;
		return this.http.get<DHCP[]>(this.url, { headers: this.headers });
	}

	getSoftwareOnDev(id: number) {
		this.url = `${this.hostname}/softwares/devices/${id}`;
		return this.http.get<InstallStateDev[]>(this.url, { headers: this.headers });
	}

	getRoomDevices(id: number) {
		this.url = this.hostname + `/rooms/${id}/devices`;
		return this.http.get<Device[]>(this.url, { headers: this.headers });
	};

	getDevicesByHW(id: number) {
		this.url = this.hostname + `/devices/byHWConf/${id}`;
		return this.http.get<Device[]>(this.url, { headers: this.headers });
	}

	getDevicesById(id: number) {
		this.url = this.hostname + `/devices/${id}`;
		return this.http.get<Device>(this.url, { headers: this.headers });
	}
	getDefaultPrinter(id: number) {
		this.url = `${this.hostname}/devices/${id}/defaultPrinter`;
		return this.http.get<Printer>(this.url, { headers: this.headers });
	}
	getAvailablePrinter(id: number) {
		this.url = `${this.hostname}/devices/${id}/availablePrinters`;
		return this.http.get<Printer[]>(this.url, { headers: this.headers });
	}

	//PUT
	putDefPrinter(dId: number, pId: number) {
		this.url = `${this.hostname}/devices/${dId}/defaultPrinter/${pId}`;
		return this.http.put<ServerResponse>(this.url, null, { headers: this.headers });
	}
	putAvaiPrinter(dId: number, pId: number) {
		this.url = `${this.hostname}/devices/${dId}/availablePrinters/${pId}`;
		return this.http.put<ServerResponse>(this.url, null, { headers: this.headers });
	}

	//DELETE
	deleteDefPrinter(id: number) {
		this.url = this.hostname + `/devices/${id}/defaultPrinter`;
		return this.http.delete<ServerResponse>(this.url, { headers: this.headers });
	}
	deleteAvaiPrinter(dId: number, pId: number) {
		this.url = this.hostname + `/devices/${dId}/availablePrinters/${pId}`;
		return this.http.delete<ServerResponse>(this.url, { headers: this.headers });
	}

	deleteDHCPrecord(dId: number, paramId: number) {
		this.url = this.hostname + `/devices/${dId}/dhcp/${paramId}`;
		return this.http.delete<ServerResponse>(this.url, { headers: this.headers });
	}

	executeAction(actionMap: CrxActionMap) {
		let url = this.hostname + "/devices/applyAction"
		console.log(url)
		console.log(actionMap)
		return this.http.post<ServerResponse[]>(url, actionMap, { headers: this.headers });
	}
}
