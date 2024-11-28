import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from './utils.service';
import { AuthenticationService } from './auth.service';
import { ParentTeacherMeeting, Room, PTMTeacherInRoom, PTMEvent, Parent, ParentRequest, User } from '../shared/models/data-model';
import { ServerResponse } from '../shared/models/server-models';

@Injectable()
export class ParentsService {
	hostname: string;
	url: string;


	constructor(
		private utils: UtilsService,
		private http: HttpClient,
		private authService: AuthenticationService) {
		this.hostname = this.utils.hostName();
	}

    addPtm(ptm: ParentTeacherMeeting) {
        this.url = this.hostname + "/parents/ptms/";
		return this.http.post<ServerResponse>(this.url, ptm, { headers: this.authService.headers });
    }

    modifyPtm(ptm: ParentTeacherMeeting) {
        this.url = this.hostname + "/parents/ptms/";
		return this.http.patch<ServerResponse>(this.url, ptm, { headers: this.authService.headers });
    }

    deletePtm(id: number) {
		this.url = this.hostname + "/parents/ptms/" + id;
		return this.http.delete<ServerResponse>(this.url, { headers: this.authService.headers });
	}

    getNextPTM() {
		this.url = this.hostname + "/parents/ptms/";
		return this.http.get<ParentTeacherMeeting>(this.url, { headers: this.authService.headers });
	}

	getPTMById(id: number) {
		this.url = this.hostname + "/parents/ptms/" + id;
		return this.http.get<ParentTeacherMeeting>(this.url, { headers: this.authService.headers });
	}

    getFreeRooms(id: number) {
		this.url = this.hostname + "/parents/ptms/" + id + '/rooms';
		return this.http.get<Room[]>(this.url, { headers: this.authService.headers });
	}


	getFreeTeachers(id: number): any {
		this.url = this.hostname + "/parents/ptms/" + id + '/teachers';
		return this.http.get<User[]>(this.url, { headers: this.authService.headers });
	}

    registerRoom(id: number, ptmTiR: PTMTeacherInRoom) {
		this.url = this.hostname + "/parents/ptms/" + id + '/rooms';
		return this.http.post<ServerResponse>(this.url, ptmTiR, { headers: this.authService.headers });
	}

    cancelRoomRegistration(id: number) {
		this.url = this.hostname + '/parentsptms/rooms/' + id
		return this.http.delete<ServerResponse>(this.url, { headers: this.authService.headers });
	}

    registerEvent(ptmEvent: PTMEvent){
        this.url = this.hostname + '/parents/ptms/events'
		return this.http.post<ServerResponse>(this.url, ptmEvent, { headers: this.authService.headers });
    }

    cancelEvent(id: number){
        this.url = this.hostname + '/parents/ptms/events/' + id
		return this.http.delete<ServerResponse>(this.url, { headers: this.authService.headers });
    }

	//Functions to handle parents
	getChildren() {
		this.url = this.hostname + "/users/byRole/students";
		return this.http.get<User[]>(this.url, { headers: this.authService.headers });
	}

	getParents() {
		this.url = this.hostname + "/parents/";
		return this.http.get<User[]>(this.url, { headers: this.authService.headers });
	}

	addParent(ptm: User) {
        this.url = this.hostname + "/parents/";
		return this.http.post<ServerResponse>(this.url, ptm, { headers: this.authService.headers });
    }

    modifyParent(ptm: User) {
        this.url = this.hostname + "/parents/";
		return this.http.patch<ServerResponse>(this.url, ptm, { headers: this.authService.headers });
    }

    deleteParent(id: number) {
		this.url = this.hostname + "/parents/" + id;
		return this.http.delete<ServerResponse>(this.url, { headers: this.authService.headers });
	}
	
	//Functions to handle parent requests
	getParentRequests() {
		this.url = this.hostname + "/parents/requests/";
		return this.http.get<ParentRequest[]>(this.url, { headers: this.authService.headers });
	}

	addParentRequest(ptm: ParentRequest) {
        this.url = this.hostname + "/parents/requests/";
		return this.http.post<ServerResponse>(this.url, ptm, { headers: this.authService.headers });
    }

    modifyParentRequest(ptm: ParentRequest) {
        this.url = this.hostname + "/parents/requests/";
		return this.http.patch<ServerResponse>(this.url, ptm, { headers: this.authService.headers });
    }

	deleteParentRequest(id: number) {
		this.url = this.hostname + "/parents/requests/" + id;
		return this.http.delete<ServerResponse>(this.url, { headers: this.authService.headers });
	}
}
