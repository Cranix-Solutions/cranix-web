import { Injectable, OnInit } from '@angular/core';
// import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders, HttpParams, HttpClientModule } from '@angular/common/http';
//Own Stuff
import { UtilsService } from './utils.service';
import { AuthenticationService} from './auth.service';
import { ServerResponse } from 'src/app/shared/models/server-models';
import { IncomingRules, OutgoingRule, RemoteAccessRule  } from '../shared/models/secutiry-model';

@Injectable()
export class SecurityService {

	headers: HttpHeaders;
	textHeaders: HttpHeaders;
	hostname: string;
	token: string;
    url: string;

	constructor(
		private http: HttpClient,
		private utilsS: UtilsService,
		private authService: AuthenticationService) {
		this.hostname = this.utilsS.hostName();
		this.token          = this.authService.getToken();
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
    getProxyBasic() {
		this.url = this.hostname + `/system/proxy/basic`;
		console.log(this.url);
        return this.http.get<any[]>(this.url,{ headers: this.headers });
    }

    getIncomingRules() {
		this.url = this.hostname + `/system/firewall/incomingRules`;
		console.log(this.url);
        return this.http.get<IncomingRules>(this.url,{ headers: this.headers });
    }

    getOutgoingRules() {
		this.url = this.hostname + `/system/firewall/outgoingRules`;
		console.log(this.url);
		return this.http.get<OutgoingRule[]>(this.url,{ headers: this.headers });
    }
    
    getRemoteAccessRules( ) {
        this.url = this.hostname + `/system/firewall/remoteAccessRules`;
		console.log(this.url);
		return this.http.get<RemoteAccessRule[]>(this.url,{ headers: this.headers });
    }
}
