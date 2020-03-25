import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

//own modules
import { UtilsService } from './utils.service';
import { AuthenticationService } from './auth.service';
import { ServerResponse } from 'src/app/shared/models/server-models';
import { Group, User, OldImportsUser } from 'src/app/shared/models/data-model';

@Injectable()
export class GroupsService {

	hostname: string;
	token: string;
	url: string;
	res: any;
	
	groups: BehaviorSubject<Group[]> = new BehaviorSubject(undefined);
 	groupTypes: BehaviorSubject<{}> = new BehaviorSubject(undefined);
	
	constructor(
		private utils: UtilsService,
		private http: HttpClient,
		private authS: AuthenticationService) {
		this.hostname = this.utils.hostName();
		this.token    = this.authS.getToken();
	}

	// Calls for ST data 

	loadInitialData() {
		this.getGroups()
			.subscribe(res => {
				this.groups.next(res);
			}

			);
		this.getGroupTypes()
			.subscribe(res => {
				this.groupTypes.next(res);
			});

	}

	

	getSTGroups() {

		return this.groups.asObservable();
	}
	getSTGroupTypes(){
		return this.groupTypes.asObservable();
	}

	//POST Calls
	//
	addGroup(newGroup: Group){
		const body = newGroup;
		this.url = this.hostname + "/groups/add";
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
		});
		//let body2 = JSON.stringify(body);
		//                //        console.log(body2);
		return this.http.post<ServerResponse>(this.url, body , { headers: headers});
	};

	modifyGroup(group: Group){
		const body = group;
		this.url = `${this.hostname}/groups/modify`;
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		//let body2 = JSON.stringify(body);
		//console.log(body2);
		return this.http.post<ServerResponse>(this.url, body, { headers: headers });
	}

	importGroups(fd: FormData){
		this.url = this.hostname + `/groups/import`;
		//let x = fd.getAll("name")
		//let y = fd.get("name")	'Content-Type': "multipart/form-data",
		//console.log("in service", x,y);,
		const headers = new HttpHeaders({
			
				'Accept' : "application/json",
				'Authorization' : "Bearer " + this.token
		});
		return this.http.post<ServerResponse>(this.url,fd, { headers: headers});
	}

	//GET Calls
	
	getGroupTypes(){
                this.url = this.hostname + "/system/enumerates/groupType";
                console.log(this.url);
                const headers = new HttpHeaders({
			'Accept' : "application/json",
                        'Authorization' : "Bearer " + this.token
		});
		return this.http.get<string[]>(this.url, { headers: headers});
	};

	getGroups(): Observable<Group[]>{
		this.url = this.hostname + "/groups/all";
		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
		});
		return this.http.get<Group[]>(this.url, { headers: headers});
	};

	getAllClasses(){
		this.url = this.hostname + "/groups/byType/class";
		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
		});
		return this.http.get<Group[]>(this.url, { headers: headers});
	}
	getGroupById(id: number): Observable<Group>{
		this.url = `${this.hostname}/groups/${id}`;

		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});

		return this.http.get<Group>(this.url, { headers: headers });
	}

	getMembers(id: number): Observable<User[]>{
		this.url = `${this.hostname}/groups/${id}/members`;

		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});

		return this.http.get<User[]>(this.url, { headers: headers });
	}

	getAvailiableMembers(id: number): Observable<User[]>{
		this.url = `${this.hostname}/groups/${id}/availableMembers`;

		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});

		return this.http.get<User[]>(this.url, { headers: headers });
	}

	setGroupMembers(id: number, membersId: number[]) {
		this.url = `${this.hostname}/groups/${id}/members`;
		const body = membersId;
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		//let body2 = JSON.stringify(body);
		//console.log(body2);
		return this.http.post<ServerResponse>(this.url, body, { headers: headers });
	}
	
	// PUT Calls

	putUserToGroup(ui: number, gi: number){
		this.url = `${this.hostname}/groups/${gi}/${ui}`;
		console.log(this.url);
		console.log(this.token);
		const headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Accept' : 'application/json',
			'Authorization' : 'Bearer ' + this.token
		});
		let body=null;
		// console.log(headers.getAll('Content-Type') + " " + headers.getAll('Accept') + " " + headers.getAll('Authorization'));
		return this.http.put<ServerResponse>(this.url, body,{ headers: headers});
	}

	// DELETE Calls

	deletUserFromGroup(ui:number, gi: number){
		this.url = `${this.hostname}/groups/${gi}/${ui}`;
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.delete<ServerResponse>(this.url, { headers: headers });
	}

	deleteGroupById(gid: number){
		this.url = `${this.hostname}/groups/${gid}`;
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.delete<ServerResponse>(this.url, { headers: headers });
	}
}
