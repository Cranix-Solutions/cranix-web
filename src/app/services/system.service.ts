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
	public addonKeys = {};
	public selectedAddon = "";

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
		return this.http.get(this.url, { headers: this.authService.textHeaders, responseType: 'text' });
	}

	getRegCode() {
		this.url = this.hostname + `/system/configuration/REG_CODE`;
		console.log(this.url);
		return this.http.get(this.url, { headers: this.authService.textHeaders, responseType: 'text' });
	}

	getInstituteType() {
		this.url = this.hostname + `/system/type`;
		console.log(this.url);
		return this.http.get(this.url, { headers: this.authService.textHeaders, responseType: 'text' });
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

	getSystemConfigValue(key) {
		this.url = this.hostname + `/system/configuration/${key}`;
		console.log(this.url);
		return this.http.get(this.url, { headers: this.authService.textHeaders, responseType: 'text' });
	}

	createSupportRequest(support) {
		this.url = this.hostname + `/support/create`;
		console.log(this.url);
		return this.http.post<ServerResponse>(this.url, support, { headers: this.authService.headers });
	}

	getServiceStatus() {
		this.url = this.hostname + '/system/services';
		console.log(this.url);
		return this.http.get<ServiceStatus[]>(this.url, { headers: this.authService.headers });
	}

	applyServiceState(name, what, value) {
		this.url = this.hostname + `/system/services/${name}/${what}/${value}`;
		console.log(this.url);
		this.objectService.requestSent();
		let sub = this.http.put<ServerResponse>(this.url, null, { headers: this.authService.headers }).subscribe({
			next: (val) => {
				this.objectService.responseMessage(val);
			},
			error: (err) => {
				this.objectService.errorMessage(this.languageS.trans("An error was accoured"));
			},
			complete: () => { sub.unsubscribe() }
		});
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
		this.http.get<string[]>(this.url, { headers: this.authService.headers }).subscribe({
			next: (addons) => {
				this.addons = addons;
				for (let addon of this.addons) {
					this.http.get<string[]>(this.url + `/${addon}/listActions`, { headers: this.authService.headers }).subscribe(
						(actions) => { this.addonActions[addon] = actions }
					);
					this.http.get<string[]>(this.url + `/${addon}/listKeys`, { headers: this.authService.headers }).subscribe({
						next: (keys) => { this.addonKeys[addon] = keys },
						error: (err) => { console.log('get Actions', err) },
						complete: () => { this.selectedAddon = this.addons[0] }
					});
				}
			},
			error: (err) => { console.log('get addons', err) }
		})
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

	getFile(path: string) {
		this.url = this.hostname + "/system/file";
		console.log(this.url);
		let formData: FormData = new FormData();
		formData.append('path', path);
		return this.http.post(this.url, formData, { headers: this.authService.anyHeaders, responseType: 'text' });
	}
}
