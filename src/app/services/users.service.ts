import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

//own modules
import { UtilsService } from './utils.service';
import { AuthenticationService } from './auth.service';
import { ServerResponse } from '../shared/models/server-models';
import { Group, UsersImport } from '../shared/models/data-model';

interface UserList {
	id: number;
	givenName: string;
	role: string;
	sureName: string;
	uid: string;
	uuid: string;
	birthDay: number;
	fsQuotaUsed: number;
	fsQuota: number;
	msQuotaUsed: number;
	msQuota: number;
	creatorId: number;
	password: string;

}

@Injectable()
export class UsersService {
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

	removeUserFromGroup(uId: number, gId: number) {
		this.url = this.hostname + `/users/${uId}/${gId}`;
		return this.http.delete<ServerResponse>(this.url, { headers: this.headers });
	}

	addUserToGroups(ui: number, groups: any[]) {
		const body = groups;
		this.url = `${this.hostname}/users/${ui}/groups`;
		return this.http.post<ServerResponse>(this.url, body, { headers: this.headers });
	}

	getAllImports() {
		this.url = this.hostname + "/users/imports";
		console.log(this.url);
		return this.http.get<UsersImport[]>(this.url, { headers: this.headers });
	}

	getRunningImport() {
		this.url = `${this.hostname}/users/imports/running`
		console.log(this.url);
		return this.http.get<UsersImport>(this.url, { headers: this.headers });
	}

	getUsersGroups(uid: number) {
		this.url = `${this.hostname}/users/${uid}/groups`
		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.get<Group[]>(this.url, { headers: headers });
	}

	getUsersAvailableGroups(uid: number) {
		this.url = `${this.hostname}/users/${uid}/availableGroups`
		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.get<Group[]>(this.url, { headers: headers });
	}

	setUsersGroups(uid: number, groups: number[]) {
		const body = groups;
		this.url = `${this.hostname}/users/${uid}/groups/set`;
		return this.http.post<ServerResponse>(this.url, body, { headers: this.headers });
	};

	importUsers(imp: FormData) {
		this.url = this.hostname + `/users/import`;
		const headers = new HttpHeaders({
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.post<ServerResponse>(this.url, imp, { headers: headers });
	}

}
