//import { Category } from './../data-model';
//import { AccessStatus } from '../data-model';
//import { ServerResponse } from 'app/main/shared/data-model';
//import { Observable } from 'rxjs/Observable';
//import { Device, Room, User, Group } from '../data-model';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractControl } from '@angular/forms';
//import { ServerResponse } from 'http';
import { AccessStatus, Room, Device, User, Group, Category, PositivList, SmartRoom, SmartRoomStatus, EduRoom } from '../shared/models/data-model';
import { ServerResponse } from 'src/app/shared/models/server-models';
import { AuthenticationService } from './auth.service';
import { GenericObjectService } from './generic-object.service';
import { LanguageService } from './language.service';

@Injectable()
export class EductaionService {

	sendigData = new BehaviorSubject(false);
	hostname: string;
	url: string;
	res: any;
	selectedRoomId: number;
	//TODO make it configurable
	screenShotTimeDealy: number = 5000;
	uploadState = new BehaviorSubject(false);

	constructor(
		public objectService: GenericObjectService,
		private utils: UtilsService,
		private http: HttpClient,
		private languageService: LanguageService,
		private authService: AuthenticationService) {
		this.hostname = this.utils.hostName();
	}


	// miscellaneous
	setWorkstationPassword(rId: number, pw: any) {
		this.url = `${this.hostname}/education/rooms/${rId}/actionWithMap/setPassword`;
		return this.http.post<ServerResponse>(this.url, pw, { headers: this.authService.headers });

	}

	// powerFunction 
	applyPower(type: string, id: number, action: string) {
		if (type == "room") {
			return this.actionOnRoom(id, action)
		} else {
			return this.actionOnDevice(id, action)
		}
	}
	actionOnRoom(roomId: number, action: string) {
		this.url = `${this.hostname}/education/rooms/${roomId}/${action}`;
		return this.http.put<ServerResponse>(this.url, null, { headers: this.authService.headers });
	}

	actionOnDevice(deviceId: number, action: string) {
		this.url = `${this.hostname}/education/devices/${deviceId}/${action}`;
		return this.http.put<ServerResponse>(this.url, null, { headers: this.authService.headers });
	}


	// Calls on positiv list
	//POST
	addPositivList(list: PositivList) {
		this.url = `${this.hostname}/education/proxy/positiveLists`;
		return this.http.post<ServerResponse>(this.url, list, { headers: this.authService.headers });
	}

	//GET 
	getMyPositivLists() {
		this.url = `${this.hostname}/education/proxy/myPositiveLists`;
		console.log(this.url);
		return this.http.get<PositivList[]>(this.url, { headers: this.authService.headers });
	}
	getPositivLists() {
		this.url = `${this.hostname}/education/proxy/positiveLists`;
		return this.http.get<PositivList[]>(this.url, { headers: this.authService.headers });
	}

	deletePositivList(listId: number) {
		this.url = this.hostname + `/education/proxy/positiveLists/${listId}`;
		return this.http.delete<ServerResponse>(this.url, { headers: this.authService.headers });
	}
	activatePositivListInRoom(roomId: number, listIds: number[]) {
		this.url = this.hostname + `/education/proxy/rooms/${roomId}`;
		return this.http.post<ServerResponse>(this.url, listIds, { headers: this.authService.headers });
	}
	deactivatePositivListInRoom(roomId: number) {
		this.url = this.hostname + `/education/proxy/rooms/${roomId}`;
		return this.http.delete<ServerResponse>(this.url, { headers: this.authService.headers });
	}
	//Calls on Rooms 

	setAccessStatus(status: AccessStatus) {
		this.url = `${this.hostname}/education/rooms/${status.roomId}/accessStatus`;
		return this.http.post<ServerResponse>(this.url, status, { headers: this.authService.headers });
	}
	// GET Calls on Rooms

	/**
	 * gets the rooms user may control
	 */

	getMyRooms() {
		this.url = `${this.hostname}/education/myRooms`;
		console.log(this.url);
		return this.http.get<Room[]>(this.url, { headers: this.authService.headers });
	}

	/**
	 * get the rooms user created 
	 */
	getMySmartRooms() {
		this.url = `${this.hostname}/education/rooms`;
		console.log(this.url);
		return this.http.get<SmartRoom[]>(this.url, { headers: this.authService.headers });
	}

	getRoomStatus(roomId: number) {
		this.url = `${this.hostname}/education/rooms/${roomId}`;
		console.log(this.url);
		return this.http.get<SmartRoomStatus[]>(this.url, { headers: this.authService.headers });
	}
	getRoomById(roomId: number) {
		this.url = `${this.hostname}/education/rooms/${roomId}/details`;
		return this.http.get<EduRoom>(this.url, { headers: this.authService.headers });
	}


	//POST on devices 

	placeDeviceById(devId: number, device: Device) {
		this.url = `${this.hostname}/education/devices/${devId}`;
		return this.http.post<ServerResponse>(this.url, device, { headers: this.authService.headers });
	}
	//GET 

	uploadDataToObjects(fd: FormData, objectType: string) {
		this.uploadState.next(true);
		this.url = `${this.hostname}/education/${objectType}s/upload`;
		console.log(this.url);
		let subs = this.http.post<ServerResponse[]>(this.url, fd, { headers: this.authService.formHeaders }).subscribe(
			(val) => {
				let response = this.languageService.trans("List of the results:");
				for (let resp of val) {
					response = response + "<br>" + this.languageService.transResponse(resp);
				}
				this.objectService.okMessage(response)
			},
			(err) => {
				console.log(err)
				this.objectService.errorMessage("ERROR")
			},
			() => {
				this.uploadState.next(false);
				subs.unsubscribe()
			}
		)
	}


	uploadDataToObjectsSimple(fd: FormData, objectType: string) {
		this.url = `${this.hostname}/education/${objectType}s/upload`;
		console.log(this.url);
		console.log(this.authService.formHeaders);
		return this.http.post<ServerResponse[]>(this.url, fd, { headers: this.authService.formHeaders });
	}

	async collectDataFromObjects(fd: FormData, objectType: string) {
		this.url = `${this.hostname}/education/${objectType}s/collect`;
		console.log(this.url);
		this.objectService.requestSent();
		let sub = await this.http.post<ServerResponse[]>(this.url, fd, { headers: this.authService.formHeaders }).subscribe(
			(val) => {
				let response = this.languageService.trans("List of the results:");
				for (let resp of val) {
					response = response + "<br>" + this.languageService.transResponse(resp);
				}
				this.objectService.okMessage(response)
			},
			(err) => { this.objectService.errorMessage("ERROR") },
			() => { sub.unsubscribe() }
		)
	}

}
