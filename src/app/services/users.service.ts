import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

//own modules
import { UtilsService } from './utils.service';
import { AuthenticationService } from './auth.service';
import { ServerResponse } from 'src/app/shared/models/server-models';
import { Group, User, OldImportsUser } from 'src/app/shared/models/data-model';

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
	users: BehaviorSubject<User[]>   = new BehaviorSubject(undefined);
	roles: BehaviorSubject<string[]> = new BehaviorSubject(undefined);

	constructor(
		private http: HttpClient,
		private utilsS: UtilsService,
		private authS: AuthenticationService) {
		this.hostname = this.utilsS.hostName();
		this.utilsS.log(this.users);
		this.utilsS.log(this.roles);
		this.token    = this.authS.getToken();
		this.loadInitialData();
		this.utilsS.log('Constructor Users completed');
	};


	// calls for stored data 
	loadInitialData() {
		this.refreshData("users");
		this.refreshData("role");
	}
	refreshData(ref: string) {
		switch (ref) {
			case "users": {
				this.getUsers()
					.subscribe(res => {
						this.users.next(res);
					}
					);
			}
			case "role": {
				this.getRoles()
					.subscribe(res => {
						this.roles.next(res);
					});
			}
		};
	}

	getSTUsers() {
		return this.users.asObservable();
	}

	getSTRoles() {
		return this.roles.asObservable();
	}

	getSTRolesValue(){
		return this.roles.getValue();
	}

	// PUT Calls

	
	// DELETE Calls

	deleteUserByID(id: number) {
		this.url = this.hostname + "/users/" + id;
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.delete<ServerResponse>(this.url, { headers: headers });
	}

	removeUserFromGroup(uId: number, gId: number){
		this.url = this.hostname + `/users/${uId}/${gId}`;
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.delete<ServerResponse>(this.url, { headers: headers });
	}

	// POSTcalls
	addUserToGroups(ui: number, groups: any[]){
		const body = groups;
		this.url = `${this.hostname}/users/${ui}/groups`;
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		/*let body2 = JSON.stringify(body);
		console.log(body2);*/
		return this.http.post<ServerResponse>(this.url, body, { headers: headers });
	}
	addUser(newUser: User) {
		const body = newUser;
		this.url = this.hostname + "/users/add";
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		/*let body2 = JSON.stringify(body);
		console.log(body2);*/
		return this.http.post<ServerResponse>(this.url, body, { headers: headers });
	};

	modifyUser(newUser: User) {
		const body = newUser;
		this.url = this.hostname + "/users/modify";
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		//let body2 = JSON.stringify(body);
		//console.log(body2);
		return this.http.post<ServerResponse>(this.url, body, { headers: headers });
	};

	importUsers(imp: FormData){
		this.url = this.hostname + `/users/import`;
		//let x = fd.getAll("name")
		//let y = fd.get("name")	'Content-Type': "multipart/form-data",
		//console.log("in service", x,y);,
		const headers = new HttpHeaders({
				'Accept' : "application/json",
				'Authorization' : "Bearer " + this.token
		});
		return this.http.post<ServerResponse>(this.url, imp, { headers: headers});
	  
	}


	// GET Calls
	//
	getUserByID(id: string): Observable<User> {
		this.url = this.hostname + "/users/" + id;

		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.get<User>(this.url, { headers: headers });
	};




	getUsers(): Observable<User[]> {
		//	this.hostname = this.utils.hostName();
		this.url = this.hostname + "/users/all";
		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.get<User[]>(this.url, { headers: headers });
		/*.subscribe(data => {
		this.res = data;
		console.log(this.res);
			//this.res = JSON.parse(data);
	});*/

		//	console.log("Just data: " + this.res);
		//	console.log("JSON parse: " + JSON.parse(this.res));
		//return this.res;
	};
	/* returns getCall you have to subscribe to */

	getRoles() {
		//	this.hostname = this.utils.hostName();
		this.url = this.hostname + "/system/enumerates/role";
		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.get<string[]>(this.url, { headers: headers });
	};

	getAllImports(){
		this.url = this.hostname + "/users/imports";
		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.get<OldImportsUser[]>(this.url, { headers: headers });
	}
	getRunningImport(){
	this.url = `${this.hostname}/users/imports/running`
	console.log(this.url);
		const headers = new HttpHeaders({
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.get<OldImportsUser[]>(this.url, { headers: headers });
	}

	getUsersGroups(uid: number){
		this.url = `${this.hostname}/users/${uid}/groups`
			console.log(this.url);
		const headers = new HttpHeaders({
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.get<Group[]>(this.url, { headers: headers });

	}
}
