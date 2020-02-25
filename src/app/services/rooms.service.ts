import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UtilsService } from './utils.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Room, AccessStatus, Printer, DHCP, Hwconf } from '../shared/models/data-model';
import { ServerResponse } from '../shared/models/server-models';
import { AuthenticationService } from './auth.service';

@Injectable()
export class RoomsService {
	hostname: string;
	token: string;
	url: string;


	allRooms: BehaviorSubject<Room[]> = new BehaviorSubject(undefined);
	allNetworks: BehaviorSubject<string[]> = new BehaviorSubject(undefined);
	allRoomTypes: BehaviorSubject<string[]> = new BehaviorSubject(undefined);
	allRoomControls: BehaviorSubject<string[]> = new BehaviorSubject(undefined);

	constructor(
	private utils: UtilsService,
	private http: HttpClient,
	private authS: AuthenticationService) {
		this.hostname = this.utils.hostName();
		this.token    = this.authS.getToken();
	}


	//Calls for storage

	/*loadInitialData(){
		Observable.forkJoin(
			this.getAllRooms(),
			this.getAllRoomTypes(),
			this.getAvailiableNetworks(),
			this.getAllRoomControls()
		).subscribe(data => {
			this.allRooms.next(data[0]),
			this.allRoomTypes.next(data[1]),
			this.allNetworks.next(data[2]),
			this.allRoomControls.next(data[3])
			})


	}
	refreshData(ref: string) {
		switch (ref) {
			case "rooms": {
				this.getAllRooms()
					.subscribe(res => {
						this.allRooms.next(res);
					}

					);
			}
		};
	}

	getSTAllRooms(){
		return this.allRooms.asObservable();
	}

	getSTAllRoomsValue(){
		let rooms = this.allRooms.getValue();
		return rooms;
	}
	getSTAllNetworks(){
		return this.allNetworks.asObservable();
	}
	getSTAllRoomTypes(){
		return this.allRoomTypes.asObservable();
	}
	getSTAllRoomControls(){
		return this.allRoomControls.asObservable();
	}*/
	// POSTS Calls
	addRoom(newRoom: Room){
		const body = newRoom;

		// let body2 = JSON.stringify(body)
		// console.log(body2);
		this.url = this.hostname + "/rooms/add";
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
		});
		//let body2 = JSON.stringify(body);
		//console.log(body2);
		//
		//
		//
		//console.log(body);
		return this.http.post<ServerResponse>(this.url, body, { headers: headers});
		};
	modifyRoom(editRoom: Room){
		const body = editRoom;
		this.url = this.hostname + "/rooms/modify";
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
		});

		return this.http.post<ServerResponse>(this.url, body , { headers: headers});
	}

	addDevice(device: any, room: string){
		const body = device ;
		this.url = this.hostname + "/rooms/" + room + "/devices";
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
		});

		return this.http.post<ServerResponse>(this.url, body , { headers: headers});

	}


	addDhcp(rId: any, dhcp: DHCP){
		this.url = this.hostname + `/rooms/${rId}/dhcp`;
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
		});

		return this.http.post<ServerResponse>(this.url, dhcp , { headers: headers});

	}

	setAccessRoom(access: AccessStatus){
		const body = access ;
		this.url = `${this.hostname}/rooms/${access.roomId}/accessStatus`;
		//console.log(this.url);
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
		});

		return this.http.post<ServerResponse>(this.url, body , { headers: headers});
	}

	setSheduleRoom(access: AccessStatus){
		const body = access ;
		this.url = `${this.hostname}/rooms/${access.roomId}/accessList`;
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
		});

		return this.http.post<ServerResponse>(this.url, body , { headers: headers});

	}
	addAvaiPrintersToRoom(roomId: number, printers: number[]){

		this.url = `${this.hostname}/rooms/${roomId}/availablePrinters`;
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
		});

		return this.http.post<ServerResponse>(this.url, printers , { headers: headers});
	}
	importRooms(fd: FormData){
		this.url = this.hostname + `/rooms/import`;
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

		getMYRooms(): Observable<Room[]>{
			this.url = `${this.hostname}/rooms/toRegister`;
			//console.log(this.url);
			const headers = new HttpHeaders({
				'Accept' : "application/json",
				'Authorization' : "Bearer " + this.token
			});
			return this.http.get<Room[]>(this.url, { headers: headers});
		}
		getRoomIPs(id: string){
			this.url = this.hostname + "/rooms/" + id + "/availableIPAddresses";
			//console.log(this.url);
			const headers = new HttpHeaders({
				'Accept' : "application/json",
				'Authorization' : "Bearer " + this.token
			});
			return this.http.get(this.url, { headers: headers});
		}
		getAllRooms(){
			this.url = this.hostname + "/rooms/all";
			//console.log(this.url);
			const headers = new HttpHeaders({
				'Accept' : "application/json",
				'Authorization' : "Bearer " + this.token
			});
			return this.http.get<Room[]>(this.url, { headers: headers});
		}
		getAllRoomTypes(){
			this.url = this.hostname + "/system/enumerates/roomType";
			//console.log(this.url);
			const headers = new HttpHeaders({
				'Accept' : "application/json",
				'Authorization' : "Bearer " + this.token
			});
			return this.http.get<string[]>(this.url, { headers: headers});
		}
		getAllRoomControls(){
			this.url = this.hostname + "/system/enumerates/roomControl";
			//console.log(this.url);
			const headers = new HttpHeaders({
				'Accept' : "application/json",
				'Authorization' : "Bearer " + this.token
			});
			return this.http.get<string[]>(this.url, { headers: headers});
		}
		getAvailiableNetworks(){
			this.url = this.hostname + "/system/enumerates/network";
			//console.log(this.url);
			const headers = new HttpHeaders({
				'Accept' : "application/json",
				'Authorization' : "Bearer " + this.token
			});
			return this.http.get<string[]>(this.url, { headers: headers});
		}
		getRoomById(id: number){
			this.url = this.hostname + `/rooms/${id}`;

		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
		});
		return this.http.get<Room>(this.url, { headers: headers});
		}

		getControllableRooms(){
			this.url = this.hostname + "/rooms/allWithControl";
			//console.log(this.url);
			const headers = new HttpHeaders({
				'Accept' : "application/json",
				'Authorization' : "Bearer " + this.token
			});
			return this.http.get<Room[]>(this.url, { headers: headers});
		}

		getFirewallRooms(){
			this.url = this.hostname + "/rooms/allWithFirewallControl";
			//console.log(this.url);
			const headers = new HttpHeaders({
				'Accept' : "application/json",
				'Authorization' : "Bearer " + this.token
			});
			return this.http.get<Room[]>(this.url, { headers: headers});
		}
		// requires room ID as input param

		getAvailiableIPs(room: number){
			this.url = this.hostname + "/rooms/" + room + "/availableIPAddresses/0";

		//console.log(this.url);
		const headers = new HttpHeaders({
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
		});
		return this.http.get<string[]>(this.url, { headers: headers});
		};

		getRoomAccessStatus(room: number){
			this.url = `${this.hostname}/rooms/${room}/accessStatus`;

		//console.log(this.url);
		const headers = new HttpHeaders({
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
		});
		return this.http.get<AccessStatus>(this.url, { headers: headers});
		}
		getRoomAccessList(room: number){
			this.url = `${this.hostname}/rooms/${room}/accessList`;

		//console.log(this.url);
		const headers = new HttpHeaders({
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
		});
		return this.http.get<AccessStatus[]>(this.url, { headers: headers});
		}

		getAccessTypes(){
			this.url = `${this.hostname}/system/enumerates/accessType`;

		//console.log(this.url);
		const headers = new HttpHeaders({
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
		});
			return this.http.get<string[]>(this.url, { headers: headers});
		}

		getDefaultPrinter(room: number){
			this.url = `${this.hostname}/rooms/${room}/defaultPrinter`;

			const headers = new HttpHeaders({
				'Accept' : "application/json",
				'Authorization' : "Bearer " + this.token
			});
			return this.http.get<Printer>(this.url, { headers: headers});
		}

		getAvailablePrinter(room: number){
			this.url = `${this.hostname}/rooms/${room}/availablePrinters`;

			const headers = new HttpHeaders({
				'Accept' : "application/json",
				'Authorization' : "Bearer " + this.token
			});
			return this.http.get<Printer[]>(this.url, { headers: headers});
		}

		getAllAccess(){
			this.url = `${this.hostname}/rooms/accessStatus`;

			const headers = new HttpHeaders({
				'Accept' : "application/json",
				'Authorization' : "Bearer " + this.token
			});
			return this.http.get<AccessStatus[]>(this.url, { headers: headers});
		}

		getHWinRoom(id: number){
			this.url = `${this.hostname}/rooms/${id}/hwConf`;

			const headers = new HttpHeaders({
				'Accept' : "application/json",
				'Authorization' : "Bearer " + this.token
			});
			return this.http.get<Hwconf>(this.url, { headers: headers});

		}

		getDHCP(id: string){
			this.url = this.hostname + `/rooms/${id}/dhcp`;
			//console.log(this.url);
			const headers = new HttpHeaders({
				'Accept' : "application/json",
				'Authorization' : "Bearer " + this.token
			});
			return this.http.get<DHCP[]>(this.url, { headers: headers});
		}
		//DELETE

		deleteDHCPrecord(rId: number,paramId: number){
			this.url = this.hostname + `/rooms/${rId}/dhcp/${paramId}`;
			const headers = new HttpHeaders({
				'Content-Type': "application/json",
				'Accept': "application/json",
				'Authorization': "Bearer " + this.token
			});
			return this.http.delete<ServerResponse>(this.url, { headers: headers });
		}

		deleteRoomById(id: number){
			this.url = this.hostname + `/rooms/${id}`;
			const headers = new HttpHeaders({
				'Content-Type': "application/json",
				'Accept': "application/json",
				'Authorization': "Bearer " + this.token
			});
			return this.http.delete<ServerResponse>(this.url, { headers: headers });
		}

		deleteDefaultPrinter(id:number){
			this.url = this.hostname + `/rooms/${id}/defaultPrinter`;
			const headers = new HttpHeaders({
				'Content-Type': "application/json",
				'Accept': "application/json",
				'Authorization': "Bearer " + this.token
			});
			return this.http.delete<ServerResponse>(this.url, { headers: headers });

		}

		deleteAvaiPrinters(roomId: number, devId: number){
			this.url = this.hostname + `/rooms/${roomId}/availablePrinters/${devId}`;
			const headers = new HttpHeaders({
				'Content-Type': "application/json",
				'Accept': "application/json",
				'Authorization': "Bearer " + this.token
			});
			return this.http.delete<ServerResponse>(this.url, { headers: headers });

		}

		deleteAccessList(id: number){
			this.url = this.hostname + `/rooms/accessList/${id}`;
			const headers = new HttpHeaders({
				'Content-Type': "application/json",
				'Accept': "application/json",
				'Authorization': "Bearer " + this.token
			});
			return this.http.delete<ServerResponse>(this.url, { headers: headers });
		}
		//PUT

		putDefaultPrinterToRoom(roomId: number, deviceId: number){
			this.url = this.hostname + `/rooms/${roomId}/defaultPrinter/${deviceId}`;
				//console.log(encodeURI(this.url));

				//this.url = encodeURI(this.url);
				//console.log(this.token);
				const headers = new HttpHeaders({
					'Content-Type': "application/json",
					'Accept' : "application/json",
					'Authorization' : "Bearer " + this.token
				});
				let body=null;
				//console.log(headers.getAll('Content-Type') + " " + headers.getAll('Accept') + " " + headers.getAll('Authorization'));
				return this.http.put<ServerResponse>(this.url, body,{ headers: headers});
		}

		putAvaiPrinterToRoom(roomId: number, printerId: number){
		this.url = `${this.hostname}/rooms/${roomId}/availablePrinters/${printerId}`;
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
		});

		return this.http.put<ServerResponse>(this.url, null , { headers: headers});
	}
		actionOnRoom(roomId: number, action: string){
			this.url = this.hostname + `/rooms/${roomId}/actions/${action}`;
				//console.log(encodeURI(this.url));

				//this.url = encodeURI(this.url);
				//console.log(this.token);
				const headers = new HttpHeaders({
					'Content-Type': "application/json",
					'Accept' : "application/json",
					'Authorization' : "Bearer " + this.token
				});
				let body=null;
				//console.log(headers.getAll('Content-Type') + " " + headers.getAll('Accept') + " " + headers.getAll('Authorization'));
				return this.http.put<ServerResponse>(this.url, body,{ headers: headers});
		}

		registerOwnDev(roomId: number, macAddress: string, name?: string){
			this.url = this.hostname + `/rooms/${roomId}/device/${macAddress}/${name}`;
				//console.log(encodeURI(this.url));

				//this.url = encodeURI(this.url);
				//console.log(this.token);
				const headers = new HttpHeaders({
					'Content-Type': "application/json",
					'Accept' : "application/json",
					'Authorization' : "Bearer " + this.token
				});
				let body=null;
				//console.log(headers.getAll('Content-Type') + " " + headers.getAll('Accept') + " " + headers.getAll('Authorization'));
				return this.http.put<ServerResponse>(this.url, body,{ headers: headers});

		}
	}
