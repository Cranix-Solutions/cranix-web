import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from './utils.service';
import { AuthenticationService } from './auth.service';
import { ParentTeacherMeeting, Room, PTMTeacherInRoom, PTMEvent } from '../shared/models/data-model';
import { ServerResponse } from '../shared/models/server-models';

@Injectable()
export class PtmsService {
	hostname: string;
	url: string;


	constructor(
		private utils: UtilsService,
		private http: HttpClient,
		private authService: AuthenticationService) {
		this.hostname = this.utils.hostName();
	}

    add(ptm: ParentTeacherMeeting) {
        this.url = this.hostname + "/ptms/";
		return this.http.post<ServerResponse>(this.url, ptm, { headers: this.authService.headers });
    }

    modify(ptm: ParentTeacherMeeting) {
        this.url = this.hostname + "/ptms/";
		return this.http.patch<ServerResponse>(this.url, ptm, { headers: this.authService.headers });
    }

    delete(id: number) {
		this.url = this.hostname + "/ptms/" + id + '/rooms';
		return this.http.delete<ServerResponse>(this.url, { headers: this.authService.headers });
	}
    
    getNextPTM() {
		this.url = this.hostname + "/ptms/";
		return this.http.get<ParentTeacherMeeting>(this.url, { headers: this.authService.headers });
	}

    getFreeRooms(id: number) {
		this.url = this.hostname + "/ptms/" + id + '/rooms';
		return this.http.get<Room[]>(this.url, { headers: this.authService.headers });
	}

    registerRoom(id: number, ptmTiR: PTMTeacherInRoom) {
		this.url = this.hostname + "/ptms/" + id + '/rooms';
		return this.http.post<ServerResponse>(this.url, ptmTiR, { headers: this.authService.headers });
	}
    
    cancelRoomRegistration(id: number) {
		this.url = this.hostname + '/ptms/rooms/' + id
		return this.http.delete<ServerResponse>(this.url, { headers: this.authService.headers });
	}
    
    registerEvent(ptmEvent: PTMEvent){
        this.url = this.hostname + '/ptms/events'
		return this.http.post<ServerResponse>(this.url, ptmEvent, { headers: this.authService.headers });
    }

    cancelEvent(id: number){
        this.url = this.hostname + '/ptms/events/' + id
		return this.http.delete<ServerResponse>(this.url, { headers: this.authService.headers });
    }
}