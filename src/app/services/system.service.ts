import { Injectable, OnInit } from '@angular/core';
// import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders, HttpParams, HttpClientModule } from '@angular/common/http';
import { UtilsService } from './utils.service';
import { AuthenticationService} from './auth.service';

import { BehaviorSubject } from 'rxjs';
import { Hash } from 'crypto';

@Injectable()
export class SystemService {

	headers: HttpHeaders;
	textHeaders: HttpHeaders;
    hostname: string;
	token: string;
	url: string;

    constructor(
		private http: HttpClient,
		private utilsS: UtilsService,
		private authS: AuthenticationService) {

		this.hostname = this.utilsS.hostName();
		this.token          = this.authS.getToken();
		this.headers     = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
		});
		this.textHeaders     = new HttpHeaders({
			'Accept' : "text/plain",
			'Authorization' : "Bearer " + this.token
		});
		
    }
	
	    
    getStatus(){
		this.url = this.hostname + `/system/status`;
		console.log(this.url);
		return this.http.get<Hash>(this.url, { headers: this.headers});
	}

    restartJob(jobId: number){
		this.url = this.hostname + `/system/jobs/${jobId}/restart`;
		console.log(this.url);
		return this.http.put(this.url, null,{ headers: this.headers});
	}

	getInstituteName(){
		this.url = this.hostname + `/system/name`;
		console.log(this.url);
		return this.http.get(this.url,{ headers: this.textHeaders, responseType: 'text'  });
	}

	getRegCode(){
		this.url = this.hostname + `/system/configuration/REG_CODE`;
		console.log(this.url);
		return this.http.get(this.url,{ headers: this.textHeaders, responseType: 'text'  });
	}

	getInstituteType(){
		this.url = this.hostname + `/system/type`;
		console.log(this.url);
		return this.http.get(this.url,{ headers: this.textHeaders, responseType: 'text'  });
	}

}