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
import { AccessStatus, Room, Device, User, Group, Category, PositivList, SmartRoom, SmartRoomStatus, EduRoom, GuestUsers } from '../shared/models/data-model';
import { ServerResponse } from 'src/app/shared/models/server-models';
import { AuthenticationService } from './auth.service';
import { GenericObjectService } from './generic-object.service';
import { LanguageService } from './language.service';
import { interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Injectable()
export class EductaionService {

	sendigData = new BehaviorSubject(false);
	hostname: string;
	url: string;
	res: any;
	//TODO make it configurable
	screenShotTimeDealy: number = 5000;
	uploadState = new BehaviorSubject<boolean>(false);
	myRooms: Room[];
	selectedRoom: Room;
	screenShots = {};
	disableChange: boolean = false;
	alive: boolean = true;
	dropLists: string[] = [];
	room: EduRoom;
	rooms: Room[];
	rows: Device[][];

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
		this.http.get<Room[]>(this.url, { headers: this.authService.headers }).subscribe(
			(val) => { this.myRooms = val }
		)
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
		this.url = `${this.hostname}/education/${objectType}s/upload`;
		console.log(this.url);
		let subs = this.http.post<ServerResponse[]>(this.url, fd, { headers: this.authService.formHeaders }).subscribe({
			next: (val) => {
				let response = this.languageService.trans("List of the results:");
				for (let resp of val) {
					response = response + "<br>" + this.languageService.transResponse(resp);
				}
				this.objectService.okMessage(response)
			},
			error: (err) => {
				console.log(err)
				this.objectService.errorMessage("ERROR")
			},
			complete: () => {
				this.uploadState.next(false);
				subs.unsubscribe()
			}
		})
	}


	uploadDataToObjectsSimple(fd: FormData, objectType: string) {
		this.url = `${this.hostname}/education/${objectType}s/upload`;
		console.log(this.url);
		return this.http.post<ServerResponse[]>(this.url, fd, { headers: this.authService.formHeaders });
	}

	async collectDataFromObjects(fd: FormData, objectType: string) {
		this.url = `${this.hostname}/education/${objectType}s/collect`;
		console.log(this.url);
		this.objectService.requestSent();
		let sub = await this.http.post<ServerResponse[]>(this.url, fd, { headers: this.authService.formHeaders }).subscribe({
			next: (val) => {
				let response = this.languageService.trans("List of the results:");
				for (let resp of val) {
					response = response + "<br>" + this.languageService.transResponse(resp);
				}
				this.objectService.okMessage(response)
			},
			error: (err) => { this.objectService.errorMessage("ERROR") },
			complete: () => { sub.unsubscribe() }
		})
	}

	//Hanling of guest users.
	getGuestAccounts() {
		this.url = `${this.hostname}/education/guestUsers`;
		console.log(this.url)
		return this.http.get<GuestUsers[]>(this.url, { headers: this.authService.headers });
	}


	addGuestUsers(guest: GuestUsers) {
		this.url = `${this.hostname}/education/guestUsers`;
		console.log(this.url);
		return this.http.post<ServerResponse>(this.url, guest, { headers: this.authService.headers })
	}

	deleteGuestUsers(id: number) {
		this.url = `${this.hostname}/education/guestUsers/${id}`;
		console.log(this.url);
		return this.http.delete<ServerResponse>(this.url, { headers: this.authService.headers })
	}

	//Functions to room control
	getDevice(r, p) {
		return this.room.devices.find(e => e.row === r && e.place === p);
	}

	orderRoom() {
		this.rows = [...Array(this.room.rows)].map(e => Array(this.room.places));
		console.log(this.room.rows, this.room.places, this.selectedRoom.rows, this.selectedRoom.places);
		this.dropLists = [];
		for (let i = 0; i < this.room.rows; i++) {
			for (let j = 0; j < this.room.places; j++) {
				this.rows[i][j] = this.getDevice(i + 1, j + 1)
				this.dropLists.push(i.toString() + '-' + j.toString())
			}
		}
	}

	statusTimer() {
		interval(5000).pipe(takeWhile(() => this.alive)).subscribe((func => {
			this.getEduRoomStatus(false);
		}))
	}

	getEduRoomStatus(order: boolean) {
		if (this.disableChange) {
			return
		}
		this.getRoomById(this.selectedRoom.id)
			.pipe(takeWhile(() => this.alive))
			.subscribe(res => {
				this.room = res
				if(order) {
					this.orderRoom()
				}
			});

	}

	destroyEduRoom(){
		this.alive = null;
		this.dropLists = null;
		this.rows = null;
		this.selectedRoom = null;
	}
}
