import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from './utils.service';
import { Room, AccessStatus, Printer, Hwconf } from 'src/app/shared/models/data-model';
import { ServerResponse } from 'src/app/shared/models/server-models';
import { AuthenticationService } from './auth.service';

@Injectable()
export class RoomsService {
	hostname: string;
	url: string;


	constructor(
		private utils: UtilsService,
		private http: HttpClient,
		private authService: AuthenticationService) {
		this.hostname = this.utils.hostName();
	}

	setPrinters(dId: number, printers: any) {
		this.url = this.hostname + `/rooms/${dId}/printers`;
		return this.http.post<ServerResponse>(this.url, printers, { headers: this.authService.headers });
	}

	getAvailiableIPs(room: number) {
		this.url = this.hostname + "/rooms/" + room + "/availableIPAddresses/0";
		return this.http.get<string[]>(this.url, { headers: this.authService.headers });
	};

	addDevice(device: any, room: number) {
		this.url = this.hostname + "/rooms/" + room + "/devices";
		return this.http.post<ServerResponse[]>(this.url, device, { headers: this.authService.headers });
	}


	setAccessRoom(access: AccessStatus) {
		const body = access;
		this.url = `${this.hostname}/rooms/${access.roomId}/accessStatus`;
		return this.http.post<ServerResponse>(this.url, body, { headers: this.authService.headers });
	}

	setSheduleRoom(access: AccessStatus) {
		const body = access;
		this.url = `${this.hostname}/rooms/${access.roomId}/accessList`;
		return this.http.post<ServerResponse>(this.url, body, { headers: this.authService.headers });

	}
	addAvaiPrintersToRoom(roomId: number, printers: number[]) {
		this.url = `${this.hostname}/rooms/${roomId}/availablePrinters`;
		return this.http.post<ServerResponse>(this.url, printers, { headers: this.authService.headers });
	}
	importRooms(fd: FormData) {
		this.url = this.hostname + `/rooms/import`;
		return this.http.post<ServerResponse>(this.url, fd, { headers: this.authService.headers });
	}
	//GET Calls

	getRoomsToRegister() {
		this.url = `${this.hostname}/rooms/toRegister`;
		return this.http.get<Room[]>(this.url, { headers: this.authService.headers });
	}

	getRoomIPs(id: string) {
		this.url = this.hostname + "/rooms/" + id + "/availableIPAddresses";
		return this.http.get(this.url, { headers: this.authService.headers });
	}

	getAllRooms() {
		this.url = this.hostname + "/rooms/all";
		return this.http.get<Room[]>(this.url, { headers: this.authService.headers });
	}

	getAllRoomTypes() {
		this.url = this.hostname + "/system/enumerates/roomType";
		return this.http.get<string[]>(this.url, { headers: this.authService.headers });
	}

	getAllRoomControls() {
		this.url = this.hostname + "/system/enumerates/roomControl";
		return this.http.get<string[]>(this.url, { headers: this.authService.headers });
	}

	getAvailiableNetworks() {
		this.url = this.hostname + "/system/enumerates/network";
		return this.http.get<string[]>(this.url, { headers: this.authService.headers });
	}

	getRoomById(id: number) {
		this.url = this.hostname + `/rooms/${id}`;
		console.log(this.url);
		return this.http.get<Room>(this.url, { headers: this.authService.headers });
	}

	getControllableRooms() {
		this.url = this.hostname + "/rooms/allWithControl";
		//console.log(this.url);
		return this.http.get<Room[]>(this.url, { headers: this.authService.headers });
	}

	getFirewallRooms() {
		this.url = this.hostname + "/rooms/allWithFirewallControl";
		//console.log(this.url);
		return this.http.get<Room[]>(this.url, { headers: this.authService.headers });
	}
	// requires room ID as input param

	getRoomAccessStatus(room: number) {
		this.url = `${this.hostname}/rooms/${room}/accessStatus`;
		return this.http.get<AccessStatus>(this.url, { headers: this.authService.headers });
	}
	getRoomAccessList(room: number) {
		this.url = `${this.hostname}/rooms/${room}/accessList`;
		return this.http.get<AccessStatus[]>(this.url, { headers: this.authService.headers });
	}

	getAccessTypes() {
		this.url = `${this.hostname}/system/enumerates/accessType`;
		return this.http.get<string[]>(this.url, { headers: this.authService.headers });
	}

	getDefaultPrinter(room: number) {
		this.url = `${this.hostname}/rooms/${room}/defaultPrinter`;
		return this.http.get<Printer>(this.url, { headers: this.authService.headers });
	}

	getAvailablePrinter(room: number) {
		this.url = `${this.hostname}/rooms/${room}/availablePrinters`;
		return this.http.get<Printer[]>(this.url, { headers: this.authService.headers });
	}
	getHWinRoom(id: number) {
		this.url = `${this.hostname}/rooms/${id}/hwConf`;
		return this.http.get<Hwconf>(this.url, { headers: this.authService.headers });

	}


	//DELETE

	deleteDHCPrecord(rId: number, paramId: number) {
		this.url = this.hostname + `/rooms/${rId}/dhcp/${paramId}`;
		return this.http.delete<ServerResponse>(this.url, { headers: this.authService.headers });
	}

	deleteRoomById(id: number) {
		this.url = this.hostname + `/rooms/${id}`;
		return this.http.delete<ServerResponse>(this.url, { headers: this.authService.headers });
	}

	deleteDefaultPrinter(id: number) {
		this.url = this.hostname + `/rooms/${id}/defaultPrinter`;
		return this.http.delete<ServerResponse>(this.url, { headers: this.authService.headers });

	}

	deleteAvaiPrinters(roomId: number, devId: number) {
		this.url = this.hostname + `/rooms/${roomId}/availablePrinters/${devId}`;
		return this.http.delete<ServerResponse>(this.url, { headers: this.authService.headers });
	}

	deleteAccessList(id: number) {
		this.url = this.hostname + `/rooms/accessList/${id}`;
		return this.http.delete<ServerResponse>(this.url, { headers: this.authService.headers });
	}
	//PUT

	putDefaultPrinterToRoom(roomId: number, deviceId: number) {
		this.url = this.hostname + `/rooms/${roomId}/defaultPrinter/${deviceId}`;
		let body = null;
		return this.http.put<ServerResponse>(this.url, body, { headers: this.authService.headers });
	}

	putAvaiPrinterToRoom(roomId: number, printerId: number) {
		this.url = `${this.hostname}/rooms/${roomId}/availablePrinters/${printerId}`;
		return this.http.put<ServerResponse>(this.url, null, { headers: this.authService.headers });
	}
	actionOnRoom(roomId: number, action: string) {
		this.url = this.hostname + `/rooms/${roomId}/actions/${action}`;
		let body = null;
		return this.http.put<ServerResponse>(this.url, body, { headers: this.authService.headers });
	}

}
