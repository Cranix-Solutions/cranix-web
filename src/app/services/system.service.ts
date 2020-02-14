import { Injectable, OnInit } from '@angular/core';
// import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders, HttpParams, HttpClientModule } from '@angular/common/http';
import { UtilsService } from './utils.service';
import { AuthenticationService} from './auth.service';

import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SystemService {

    hostname: string;
	token: string;
	url: string;

    constructor(
		private http: HttpClient,
		private utilsS: UtilsService,
		private authS: AuthenticationService) {

		this.hostname = this.utilsS.hostName();
		this.token    = this.authS.getToken();
		
    }
    
    restartJob(jobId: number){
		this.url = this.hostname + `/system/jobs/${jobId}/restart`;
		//console.log(encodeURI(this.url));
	
		//this.url = encodeURI(this.url);
		//console.log(this.token);
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
		});
		let body=null;
		//console.log(headers.getAll('Content-Type') + " " + headers.getAll('Accept') + " " + headers.getAll('Authorization'));
		return this.http.put(this.url, body,{ headers: headers});
	}

	getInstituteName(){
		this.url = this.hostname + `/system/name`;
		//console.log(encodeURI(this.url));
	
		//this.url = encodeURI(this.url);
		//console.log(this.token);
		const headers = new HttpHeaders({
			'Accept' : 'text/plain',
			'Authorization' : "Bearer " + this.token
		});
		//console.log(headers.getAll('Content-Type') + " " + headers.getAll('Accept') + " " + headers.getAll('Authorization'));
		return this.http.get(this.url,{ headers: headers, responseType: 'text'  });
	}

	getRegCode(){
		this.url = this.hostname + `/system/configuration/REG_CODE`;
		//console.log(encodeURI(this.url));
	
		//this.url = encodeURI(this.url);
		//console.log(this.token);
		const headers = new HttpHeaders({
			'Accept' : 'text/plain',
			'Authorization' : "Bearer " + this.token
		});
		//console.log(headers.getAll('Content-Type') + " " + headers.getAll('Accept') + " " + headers.getAll('Authorization'));
		return this.http.get(this.url,{ headers: headers, responseType: 'text'  });
	}

	getInstituteType(){
		this.url = this.hostname + `/system/type`;
		//console.log(encodeURI(this.url));
	
		//this.url = encodeURI(this.url);
		//console.log(this.token);
		const headers = new HttpHeaders({
			'Accept' : 'text/plain',
			'Authorization' : "Bearer " + this.token
		});
		//console.log(headers.getAll('Content-Type') + " " + headers.getAll('Accept') + " " + headers.getAll('Authorization'));
		return this.http.get(this.url,{ headers: headers, responseType: 'text'  });
	}

}