import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

//own modules
import { UtilsService } from './utils.service';
import { AuthenticationService } from './auth.service';
import { ServerResponse } from 'src/app/shared/models/server-models';
import { Category, Device, Hwconf, Room, SoftwareStatus, Software, License } from 'src/app/shared/models/data-model';


@Injectable()
export class SoftwareService {
	hostname: string;
	url: string;
	selectedInstallationSet: Category;
	availableSoftwares: Software[];

	constructor(
		private http: HttpClient,
		private utilsS: UtilsService,
		private authService: AuthenticationService) {
		this.hostname = this.utilsS.hostName();
		this.authService.log('Constructor Users completed');
	};

	getSoftwareStatus() {
		this.url = this.hostname + "/softwares/status";
		console.log(this.url);
		return this.http.get<SoftwareStatus[]>(this.url, { headers: this.authService.headers });
	}

	getInstallableSoftwares() {
		this.url = this.hostname + "/softwares/allInstallable";
		console.log(this.url);
		return this.http.get<Software[]>(this.url, { headers: this.authService.headers });
	}

	getAvailableSoftwares() {
		this.url = this.hostname + "/softwares/available";
		console.log(this.url);
		return this.http.get<Software[]>(this.url, { headers: this.authService.headers });
	}

	getInstallationsSets() {
		this.url = this.hostname + "/softwares/installations";
		console.log(this.url);
		return this.http.get<Category[]>(this.url, { headers: this.authService.headers });
	}
	getSoftwareLicense(softwareId: number) {
		this.url = this.hostname + `/softwares/${softwareId}/license`;
		console.log(this.url);
		return this.http.get<License[]>(this.url, { headers: this.authService.headers });
	}
	deleteSoftwareLicense(licenseId: number) {
		this.url = this.hostname + `/softwares/licenses/${licenseId}`;
		console.log(this.url);
		return this.http.delete<ServerResponse>(this.url, { headers: this.authService.headers });
	}
	addSoftwareLicense(softwareId: number, form) {
		this.url = this.hostname + `/softwares/${softwareId}/license`;
		console.log(this.url);
		return this.http.post<ServerResponse>(this.url, form, { headers: this.authService.formHeaders });
	}
	modifySoftwareLicense(licenseId: number, form) {
		this.url = this.hostname + `/softwares/licenses/${licenseId}`;
		console.log(this.url);
		return this.http.post<ServerResponse>(this.url, form, { headers: this.authService.formHeaders });
	}
	downloadSoftwares(packages: string[]) {
		this.url = this.hostname + "/softwares/download";
		console.log(this.url);
		return this.http.post<ServerResponse>(this.url, packages, { headers: this.authService.headers });
	}

	addModifyInstallationsSets(installationSet: Category) {
		if( installationSet.id ) {
			this.url = this.hostname + "/softwares/installations/" +installationSet.id  ;
		} else {
			this.url = this.hostname + "/softwares/installations";
		}
		console.log(this.url);
		return this.http.post<ServerResponse>(this.url, installationSet, { headers: this.authService.headers });
	}

	getDevicesInSet(id: number) {
		this.url = `${this.hostname}/softwares/installations/${id}/devices`;
		console.log(this.url);
		return this.http.get<Device[]>(this.url, { headers: this.authService.headers });
	}

	getRoomsInSet(id: number) {
		this.url = `${this.hostname}/softwares/installations/${id}/rooms`;
		console.log(this.url);
		return this.http.get<Room[]>(this.url, { headers: this.authService.headers });
	}

	getSoftwareInSet(id: number) {
		this.url = `${this.hostname}/softwares/installations/${id}/softwares`;
		console.log(this.url);
		return this.http.get<Software[]>(this.url, { headers: this.authService.headers });
	}
	getHWConfsInSet(id: number) {
		this.url = `${this.hostname}/softwares/installations/${id}/hwconfs`;
		console.log(this.url);
		return this.http.get<Hwconf[]>(this.url, { headers: this.authService.headers });
	}

	readInstallableSoftwares() {
		let sub = this.getInstallableSoftwares().subscribe(
			(obj) => {
				this.availableSoftwares = obj
			},
			(err) => { console.log(err) },
			() => { sub.unsubscribe() }
		);
	}
}
