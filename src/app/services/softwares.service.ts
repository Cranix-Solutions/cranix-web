import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

//own modules
import { UtilsService } from './utils.service';
import { AuthenticationService } from './auth.service';
import { ServerResponse } from 'src/app/shared/models/server-models';
import { Installation, SoftwareStatus, Software } from 'src/app/shared/models/data-model';


@Injectable()
export class SoftwareService {
	hostname: string;
	url: string;
	token: string;
	headers: HttpHeaders;

	constructor(
		private http: HttpClient,
		private utilsS: UtilsService,
		private authS: AuthenticationService) {
		this.hostname = this.utilsS.hostName();
		this.token = this.authS.getToken();
		this.headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		this.utilsS.log('Constructor Users completed');
    };
    
	getSoftwareStatus() {
		this.url = this.hostname + "/softwares/status";
		console.log(this.url);
		return this.http.get<SoftwareStatus[]>(this.url, { headers: this.headers });
	}
	
	getInstallableSoftwares(){
		this.url = this.hostname + "/softwares/allInstallable";
		console.log(this.url);
		return this.http.get<Software[]>(this.url, { headers: this.headers });
	}

	getAvailableSoftwares(){
		this.url = this.hostname + "/softwares/available";
		console.log(this.url);
		return this.http.get<Software[]>(this.url, { headers: this.headers });
	}

	getInstallationsSets(){
		this.url = this.hostname + "/softwares/installation";
		console.log(this.url);
		return this.http.get<Installation[]>(this.url, { headers: this.headers });
	}
	downloadSoftwares(packages: string[]){
		this.url = this.hostname + "/softwares/download";
		console.log(this.url);
		return this.http.post<ServerResponse>(this.url, packages, { headers: this.headers });
	}
}
