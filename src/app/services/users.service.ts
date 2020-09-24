import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

//own modules
import { UtilsService } from './utils.service';
import { AuthenticationService } from './auth.service';
import { ServerResponse } from 'src/app/shared/models/server-models';
import { Group, UsersImport } from 'src/app/shared/models/data-model';

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

	constructor(
		private http: HttpClient,
		private utilsS: UtilsService,
		private authService: AuthenticationService) {
		this.hostname = this.utilsS.hostName();
	};

	removeUserFromGroup(uId: number, gId: number) {
		this.url = this.hostname + `/users/${uId}/${gId}`;
		return this.http.delete<ServerResponse>(this.url, { headers: this.authService.headers });
	}

	addUserToGroups(ui: number, groups: any[]) {
		const body = groups;
		this.url = `${this.hostname}/users/${ui}/groups`;
		return this.http.post<ServerResponse>(this.url, body, { headers: this.authService.headers });
	}

	getUsersGroups(uid: number) {
		this.url = `${this.hostname}/users/${uid}/groups`
		console.log(this.url);
		return this.http.get<Group[]>(this.url, { headers: this.authService.headers });
	}

	getUsersAvailableGroups(uid: number) {
		this.url = `${this.hostname}/users/${uid}/availableGroups`
		console.log(this.url);
		return this.http.get<Group[]>(this.url, { headers: this.authService.headers });
	}

	setUsersGroups(uid: number, groups: number[]) {
		const body = groups;
		this.url = `${this.hostname}/users/${uid}/groups/set`;
		return this.http.post<ServerResponse>(this.url, body, { headers: this.authService.headers });
	};

	importUsers(imp: FormData) {
		this.url = this.hostname + `/users/import`;
		const headers = new HttpHeaders({
			'Accept': "application/json",
			'Authorization': "Bearer " + this.authService.session.token
		});
		console.log(this.url)
		console.log(headers)
		console.log(imp.get('file'))
		return this.http.post<ServerResponse>(this.url, imp, { headers: headers });
	}

	getAllImports() {
		this.url = this.hostname + "/users/imports";
		console.log(this.url);
		return this.http.get<UsersImport[]>(this.url, { headers: this.authService.headers });
	}

	getRunningImport() {
		this.url = `${this.hostname}/users/imports/running`
		console.log(this.url);
		return this.http.get<UsersImport>(this.url, { headers: this.authService.headers });
	}

	stopRunningImport() {
		this.url = `${this.hostname}/users/imports/running`
		console.log(this.url);
		return this.http.delete<ServerResponse>(this.url, { headers: this.authService.headers });
	}

	restartUserImport(userImport: string) {
		this.url = `${this.hostname}/users/imports/${userImport}`;
		return this.http.put<ServerResponse>(this.url, null, { headers: this.authService.headers });
	};

	deleteUserImport(userImport: string) {
		this.url = `${this.hostname}/users/imports/${userImport}`;
		return this.http.delete<ServerResponse>(this.url, { headers: this.authService.headers });
	};

	getImportAs(userImport: string, resultType: string){
		this.url = `${this.hostname}/users/imports/${userImport}/${resultType}`;
		return this.http.get(this.url, { headers: this.authService.headers, observe : 'response', responseType: 'blob' });
	}

}
