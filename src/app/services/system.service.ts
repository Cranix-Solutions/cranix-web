import { Injectable, OnInit } from '@angular/core';
// import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders, HttpParams, HttpClientModule } from '@angular/common/http';
//Own Stuff
import { UtilsService } from './utils.service';
import { AuthenticationService } from './auth.service';
import { SystemConfig } from 'src/app/shared/models/data-model';
import { ServerResponse, Acl, ServiceStatus } from 'src/app/shared/models/server-models';
import { GenericObjectService } from './generic-object.service';
import { LanguageService } from './language.service';

@Injectable()
export class SystemService {

	hostname: string;
	url: string;
	public addons: string[] = [];
	public addonActions = {};
	public addonKeys    = {};
	public selectedAddon= "";

	constructor(
		private http: HttpClient,
		private utilsS: UtilsService,
		public languageS: LanguageService,
		private authService: AuthenticationService,
		private objectService: GenericObjectService) {
		this.initModule();
	}
	initModule() {
		this.hostname = this.utilsS.hostName();
	}

	getStatus() {
		this.url = this.hostname + `/system/status`;
		console.log(this.url);
		return this.http.get(this.url, { headers: this.authService.headers });
	}

	restartJob(jobId: number) {
		this.url = this.hostname + `/system/jobs/${jobId}/restart`;
		console.log(this.url);
		return this.http.put(this.url, null, { headers: this.authService.headers });
	}

	getInstituteName() {
		this.url = this.hostname + `/system/name`;
		console.log(this.url);
		let textHeaders = new HttpHeaders({
			'Accept': "text/plain"
		});
		return this.http.get(this.url, { headers: textHeaders, responseType: 'text' });
	}

	getRegCode() {
		this.url = this.hostname + `/system/configuration/REG_CODE`;
		console.log(this.url);
		let textHeaders = new HttpHeaders({
			'Accept': "text/plain",
			'Authorization': "Bearer " + this.authService.session.token
		});
		return this.http.get(this.url, { headers: textHeaders, responseType: 'text' });
	}

	getInstituteType() {
		this.url = this.hostname + `/system/type`;
		console.log(this.url);
		let textHeaders = new HttpHeaders({
			'Accept': "text/plain",
			'Authorization': "Bearer " + this.authService.session.token
		});
		return this.http.get(this.url, { headers: textHeaders, responseType: 'text' });
	}

	update() {
		this.url = this.hostname + `/system/update`;
		console.log(this.url);
		return this.http.put(this.url, null, { headers: this.authService.headers });
	}

	getSystemConfiguration() {
		this.url = this.hostname + `/system/configuration`;
		console.log(this.url);
		return this.http.get<SystemConfig[]>(this.url, { headers: this.authService.headers });
	}

	setSystemConfigValue(key, value) {
		this.url = this.hostname + `/system/configuration`;
		console.log(this.url);
		let tmp = {
			"key": key,
			"value": value
		}
		return this.http.post<ServerResponse>(this.url, tmp, { headers: this.authService.headers });
	}

	getSystemConfigValue(key, value) {
		this.url = this.hostname + `/system/configuration`;
		console.log(this.url);
		return this.http.get<string>(this.url, { headers: this.authService.textHeaders });
	}

	createSupportRequest(support) {
		this.url = this.hostname + `/support/create`;
		console.log(this.url);
		return this.http.post<ServerResponse>(this.url, support, { headers: this.authService.headers });
	}

	getServiceStatus() {
		this.url = this.hostname + '/system/services';
		console.log(this.url);
		return this.http.get<ServiceStatus[]>(this.url, { headers: this.authService.headers } );
	}

	applyServiceState(name, what, value) {
		this.url = this.hostname + `/system/services/${name}/${what}/${value}`;
		console.log(this.url);
		this.objectService.requestSent();
		let sub = this.http.put<ServerResponse>(this.url, null, { headers: this.authService.headers }).subscribe(
			(val) => {
				this.objectService.responseMessage(val);
			},
			(err) => {
				this.objectService.errorMessage(this.languageS.trans("An error was accoured"));
			},
			() => { sub.unsubscribe() }
		);
	}

	getAclsOfObject(objectType, id) {
		this.url = this.hostname + `/system/acls/${objectType}s/${id}`;
		console.log(this.url);
		return this.http.get<Acl[]>(this.url, { headers: this.authService.headers });
	}

	getAvailableAclsOfObject(objectType, id) {
		this.url = this.hostname + `/system/acls/${objectType}s/${id}/available`;
		console.log(this.url);
		return this.http.get<Acl[]>(this.url, { headers: this.authService.headers });
	}

	setAclOfObject(objectType, id, acl) {
		this.url = this.hostname + `/system/acls/${objectType}s/${id}`;
		console.log(this.url);
		return this.http.post<ServerResponse>(this.url, acl, { headers: this.authService.headers });
	}

	getAddons() {
		this.url = this.hostname + '/system/addon'
		this.http.get<string[]>(this.url, {headers: this.authService.headers}).subscribe(
			(addons) => {
				this.addons = addons;
				for( let addon of this.addons) {
					this.http.get<string[]>(this.url + `/${addon}/listActions`, {headers: this.authService.headers}).subscribe(
						(actions) => { this.addonActions[addon] = actions },
						(err) => { console.log('get Actions',err) }
					);
					this.http.get<string[]>(this.url + `/${addon}/listKeys`, {headers: this.authService.headers}).subscribe(
						(keys) => { this.addonKeys[addon] = keys },
						(err) => { console.log('get Actions',err) },
						() => { this.selectedAddon = this.addons[0]}
					);
				}
			},
			(err) => { console.log('get addons',err)}
		)
	}

	applyAction(action) {
		this.url = this.hostname + '/system/addon/' + this.selectedAddon + '/' + action;
		console.log(this.url);
		return this.http.put<ServerResponse>(this.url, null, { headers: this.authService.headers });
	}

	getKey(key) {
		this.url = this.hostname + '/system/addon/' + this.selectedAddon + '/' + key;
		console.log(this.url);
		return this.http.get<string[]>(this.url, { headers: this.authService.headers });
	}
}
