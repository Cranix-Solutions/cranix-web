import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

//own modules
import { UtilsService } from './utils.service';
import { AuthenticationService } from './auth.service';
import { ServerResponse } from 'src/app/shared/models/server-models';
import { Group, User } from 'src/app/shared/models/data-model';

@Injectable()
export class GroupsService {
	hostname: string;
	url: string;
	token: string;
	headers: HttpHeaders;
	
	constructor(
		private utilsS: UtilsService,
		private http: HttpClient,
		private authS: AuthenticationService) {		
			this.hostname = this.utilsS.hostName();
			this.token          = this.authS.getToken();
			this.headers     = new HttpHeaders({
				'Content-Type': "application/json",
				'Accept': "application/json",
				'Authorization': "Bearer " + this.token
			});
			this.utilsS.log('Constructor Users completed');
	}

	
	importGroups(fd: FormData){
		this.url = this.hostname + `/groups/import`;
		return this.http.post<ServerResponse>(this.url,fd, { headers: this.headers});
	}

	getAllClasses(){
		this.url = this.hostname + "/groups/byType/class";
		return this.http.get<Group[]>(this.url, { headers: this.headers});
	}

	getMembers(id: number): Observable<User[]>{
		this.url = `${this.hostname}/groups/${id}/members`;
		return this.http.get<User[]>(this.url, { headers: this.headers });
	}

	getAvailiableMembers(id: number): Observable<User[]>{
		this.url = `${this.hostname}/groups/${id}/availableMembers`;
		return this.http.get<User[]>(this.url, { headers: this.headers });
	}

	setGroupMembers(id: number, membersId: number[]) {
		this.url = `${this.hostname}/groups/${id}/members`;
		const body = membersId;
		return this.http.post<ServerResponse>(this.url, body, { headers: this.headers });
	}
	
	// PUT Calls
	putUserToGroup(ui: number, gi: number){
		this.url = `${this.hostname}/groups/${gi}/${ui}`;
		return this.http.put<ServerResponse>(this.url, null,{ headers: this.headers});
	}

	// DELETE Calls
	deletUserFromGroup(ui:number, gi: number){
		this.url = `${this.hostname}/groups/${gi}/${ui}`;
		return this.http.delete<ServerResponse>(this.url, { headers: this.headers });
	}
}
