import { Injectable, OnInit } from '@angular/core';
// import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders, HttpParams, HttpClientModule } from '@angular/common/http';
//Own Stuff
import { UtilsService } from './utils.service';
import { AuthenticationService} from './auth.service';
import { SystemConfig, SupportTicket } from 'src/app/shared/models/data-model';
import { ServerResponse } from 'src/app/shared/models/server-models';

@Injectable()
export class SystemService {

	hostname: string;
	url: string;

	constructor(
		private http: HttpClient,
		private utilsS: UtilsService,
		private authService: AuthenticationService) {
		this.initModule();
	}
	initModule() {
		this.hostname = this.utilsS.hostName();
	}

	getStatus(){
		this.url = this.hostname + `/system/status`;
		console.log(this.url);
		return this.http.get(this.url, { headers: this.authService.headers});
	}

	restartJob(jobId: number){
		this.url = this.hostname + `/system/jobs/${jobId}/restart`;
		console.log(this.url);
		return this.http.put(this.url, null,{ headers: this.authService.headers});
	}

	getInstituteName(){
		this.url = this.hostname + `/system/name`;
		console.log(this.url);
		let textHeaders     = new HttpHeaders({
			'Accept' : "text/plain"
		});
		return this.http.get(this.url,{ headers: textHeaders, responseType: 'text'  });
	}

	getRegCode(){
		this.url = this.hostname + `/system/configuration/REG_CODE`;
		console.log(this.url);
		let textHeaders     = new HttpHeaders({
			'Accept' : "text/plain",
			'Authorization' : "Bearer " + this.authService.session.token
		});
		return this.http.get(this.url,{ headers: textHeaders, responseType: 'text'  });
	}

	getInstituteType(){
		this.url = this.hostname + `/system/type`;
		console.log(this.url);
		let textHeaders     = new HttpHeaders({
			'Accept' : "text/plain",
			'Authorization' : "Bearer " + this.authService.session.token
		});
		return this.http.get(this.url,{ headers: textHeaders, responseType: 'text'  });
	}

	update(){
		this.url = this.hostname + `/system/update`;
		console.log(this.url);
		return this.http.put(this.url, null,{ headers: this.authService.headers});
	}

	getSystemConfiguration() {
		this.url = this.hostname + `/system/configuration`;
		console.log(this.url);
		return this.http.get<SystemConfig[]>(this.url,{ headers: this.authService.headers });
	}

	
	setSystemConfigValue(key,value){
		this.url = this.hostname + `/system/configuration`;
		console.log(this.url);
		let tmp = {
			"key": key,
			"value": value
		}
		return this.http.post<ServerResponse>(this.url,tmp, { headers: this.authService.headers });
	}

	createSupportRequest(support){
		this.url = this.hostname + `/support/create`;
		console.log(this.url);
		return this.http.post<ServerResponse>(this.url,support, { headers: this.authService.headers });
	}

	applyServiceState(name,what,value){
		this.url = this.hostname + `/system/services/${name}/${what}/${value}`;
		console.log(this.url);
		return this.http.put<ServerResponse>(this.url,null, { headers: this.authService.headers });
	}
}
