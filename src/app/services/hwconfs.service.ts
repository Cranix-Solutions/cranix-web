import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { UtilsService } from './utils.service';
import { Hwconf } from '../shared/models/data-model';
import { ServerResponse } from '../shared/models/server-models';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from './auth.service';


export interface CloneCommand {
	deviceIds: number[],
	partitionIds: number [],
	multiCast: boolean,

}

@Injectable()
export class HwconfsService {

	hostname: string;
	token: string;
	url: string;
	res: any;
	loaded = false;

	hwConfigs: BehaviorSubject<Hwconf[]> = new BehaviorSubject(undefined);
	deviceTypes: BehaviorSubject<string[]> = new BehaviorSubject(undefined);

	constructor(
		private utils: UtilsService,
		private http: HttpClient,
		private authS: AuthenticationService) {
		this.hostname = this.utils.hostName();
		this.token    = this.authS.getToken();
	}



	//StoredData functions

	loadInitialData() {
		/*Observable.forkJoin(

			this.getDeviceTypes(),
			this.getAllHwconfs(),
		)
			.subscribe((data) => {
				console.log("hw initial load:", data);
				this.deviceTypes.next(data[0]);
				this.hwConfigs.next(data[1]);
				this.loaded = true;

			}, err => {
				console.log("hwconfig Failed to load data");
			}, () => {

			})*/
		this.getDeviceTypes()
			.subscribe((dev) => {
				console.log('devTypes', dev);

				this.deviceTypes.next(dev);
			});
		this.getAllHwconfs()
			.subscribe((hws) => {
				console.log('hws' , hws);
				this.hwConfigs.next(hws);
				this.loaded = true;
				console.log("loaded after Initiald load", this.loaded);
			});
		/*Observable.forkJoin(

			this.getDeviceTypes(),
			this.getAllHwconfs(),
		)
			.subscribe((data) => {
				console.log("hw initial load:", data);
				this.deviceTypes.next(data[0]);
				this.hwConfigs.next(data[1]);
				this.loaded = true;

			}, err => {
				console.log("hwconfig Failed to load data");
			}, () => {

			})*/
	}

	refreshData(ref: string) {
		switch (ref) {
			case "hwconfigs": {
				this.getAllHwconfs()
					.subscribe(res => {
						this.hwConfigs.next(res);
					}

					);
					break;
			}
		};
	}

	getSTDeviceTypes() {
		return this.deviceTypes.asObservable();
	}
	getSTHwconfs() {

		return this.hwConfigs.asObservable();
		//return this.hwConfigs.asObservable().first();
	}
	getSTHwconfsArray(){
		return this.hwConfigs.getValue();
	}
	//POST Calls

	addHwconf(newHwconf: Hwconf) {
		const body = newHwconf;
		this.url = this.hostname + "/clonetool/hwconf";
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		//let body2 = JSON.stringify(body);
		//        console.log(body2);
		return this.http.post<ServerResponse>(this.url, body, { headers: headers });
	};

	modifyHwconf(editHwconf: Hwconf){
		const body = editHwconf;
		this.url = `${this.hostname}/clonetool/${editHwconf.id}`;
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		//let body2 = JSON.stringify(body);
		//        console.log(body2);
		return this.http.post<ServerResponse>(this.url, body, { headers: headers });
	};

	startCloning(clone: CloneCommand,hwconfId: number ){
		//const body = editHwconf;
		this.url = `${this.hostname}/clonetool/${hwconfId}/cloning`;
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		//let body2 = JSON.stringify(body);
		//        console.log(body2);
		return this.http.post<ServerResponse>(this.url, clone, { headers: headers });
	};

	//GET Calls

	getDeviceTypes(): Observable<string[]> {
		this.url = this.hostname + "/system/enumerates/deviceType";
		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.get<string[]>(this.url, { headers: headers });

	}
	getAllHwconfs(): Observable<Hwconf[]> {
		this.url = this.hostname + "/clonetool/all";
		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.get<Hwconf[]>(this.url, { headers: headers });
	}

	getHwconfById(id: number){
		this.url = `${this.hostname}/clonetool/${id}`;
		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.get<Hwconf>(this.url, { headers: headers });
	}

	getMultiDevs(){
		this.url = `${this.hostname}/clonetool/multicastDevices`;
		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.get<string>(this.url, { headers: headers });
	}
	isMaster(devId: number){
		this.url = `${this.hostname}/clonetool/devices/${devId}/isMaster`;
		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept': "text/plain",
			'Authorization': "Bearer " + this.token
		});
		return this.http.get(this.url, { headers: headers });
	}
	//PUT calls

	setMaster(devId: number, value: number){
		this.url = `${this.hostname}/clonetool/devices/${devId}/setMaster/${value}`;
		console.log(this.url);
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept': "application/json",
			'Authorization' : `Bearer ${this.token}`
		})
		return this.http.put<ServerResponse>(this.url, null, {headers: headers});
	}
	writeHWToMulti(hwId: number){
		this.url = `${this.hostname}/clonetool/${hwId}/cloning/1`;
		console.log(this.url);
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept': "application/json",
			'Authorization' : `Bearer ${this.token}`
		})
		return this.http.put<ServerResponse>(this.url, null, {headers: headers});
	}

	startMultiCast(parId: number, net: string){
		this.url = `${this.hostname}/clonetool/partitions/${parId}/multicast/${net}`;
		console.log(this.url);
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept': "application/json",
			'Authorization' : `Bearer ${this.token}`
		})
		return this.http.put<ServerResponse>(this.url, null, {headers: headers});
	}
	//DELETE calls

	deleteHwconfById(hwconfId: number){
		this.url = this.hostname + `/clonetool/${hwconfId}`;
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.delete<ServerResponse>(this.url, { headers: headers });
	}
}
