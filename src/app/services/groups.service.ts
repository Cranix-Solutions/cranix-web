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

	constructor(
		private utilsS: UtilsService,
		private http: HttpClient,
		private authService: AuthenticationService) {
			this.hostname = this.utilsS.hostName();
	}


	importGroups(fd: FormData){
		this.url = this.hostname + `/groups/import`;
		return this.http.post<ServerResponse>(this.url,fd, { headers: this.authService.headers});
	}

	getAllClasses(){
		this.url = this.hostname + "/groups/byType/class";
		return this.http.get<Group[]>(this.url, { headers: this.authService.headers});
	}

	getMembers(id: number): Observable<User[]>{
		if( this.authService.isAllowed("group.manage")) {
			this.url = `${this.hostname}/groups/${id}/members`;
		} else {
			this.url = `${this.hostname}/education/groups/${id}/members`;
		}
		return this.http.get<User[]>(this.url, { headers: this.authService.headers });
	}

	getAvailiableMembers(id: number): Observable<User[]>{
		if( this.authService.isAllowed("group.manage")) {
			this.url = `${this.hostname}/groups/${id}/availableMembers`;
		} else {
			this.url = `${this.hostname}/education/groups/${id}/availableMembers`;
		}
		return this.http.get<User[]>(this.url, { headers: this.authService.headers });
	}

	setGroupMembers(id: number, membersId: number[]) {
		if( this.authService.isAllowed("group.modify")) {
			this.url = `${this.hostname}/groups/${id}/members`;
		} else {
			this.url = `${this.hostname}/education/groups/${id}/members`;
		}
		const body = membersId;
		return this.http.post<ServerResponse>(this.url, body, { headers: this.authService.headers });
	}

	// PUT Calls
	putUserToGroup(ui: number, gi: number){
		this.url = `${this.hostname}/groups/${gi}/${ui}`;
		return this.http.put<ServerResponse>(this.url, null,{ headers: this.authService.headers});
	}

	// DELETE Calls
	deletUserFromGroup(ui:number, gi: number){
		this.url = `${this.hostname}/groups/${gi}/${ui}`;
		return this.http.delete<ServerResponse>(this.url, { headers: this.authService.headers });
	}
}
