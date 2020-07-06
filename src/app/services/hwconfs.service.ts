import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { UtilsService } from './utils.service';
import { Device, Hwconf } from 'src/app/shared/models/data-model';
import { ServerResponse } from 'src/app/shared/models/server-models';
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
        url: string;
        token: string;
        headers: HttpHeaders;

        constructor(
                private utilsS: UtilsService,
                private http: HttpClient,
                private authService: AuthenticationService) {
                        this.hostname = this.utilsS.hostName();
                        this.token    = this.authService.getToken();
                        this.headers  = new HttpHeaders({
                                'Content-Type': "application/json",
                                'Accept': "application/json",
                                'Authorization': "Bearer " + this.token
                        });
                        this.authService.log('Constructor Users completed');
        }

	startCloning(clone: CloneCommand,hwconfId: number ){
		this.url = `${this.hostname}/clonetool/${hwconfId}/cloning`;
		return this.http.post<ServerResponse>(this.url, clone, { headers: this.headers });
	};

	//GET Calls

	getMembers(id: number){
		this.url = `${this.hostname}/devices/byHWConf/${id}`;
		console.log(this.url);
		return this.http.get<Device[]>(this.url, { headers: this.headers });
	}
	getHwconfById(id: number){
		this.url = `${this.hostname}/clonetool/${id}`;
		console.log(this.url);
		return this.http.get<Hwconf>(this.url, { headers: this.headers });
	}

	getMultiDevs(){
		this.url = `${this.hostname}/clonetool/multicastDevices`;
		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.get<string>(this.url, { headers: this.headers });
	}
	isMaster(devId: number){
		this.url = `${this.hostname}/clonetool/devices/${devId}/isMaster`;
		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept': "text/plain",
			'Authorization': "Bearer " + this.token
		});
		return this.http.get(this.url, { headers: this.headers });
	}
	//PUT calls

	setMaster(devId: number, value: number){
		this.url = `${this.hostname}/clonetool/devices/${devId}/setMaster/${value}`;
		console.log(this.url);
		return this.http.put<ServerResponse>(this.url, null, {headers: this.headers});
	}
	writeHWToMulti(hwId: number){
		this.url = `${this.hostname}/clonetool/${hwId}/cloning/1`;
		console.log(this.url);
		return this.http.put<ServerResponse>(this.url, null, {headers: this.headers});
	}

	startMultiCast(parId: number, net: string){
		this.url = `${this.hostname}/clonetool/partitions/${parId}/multicast/${net}`;
		console.log(this.url);
		return this.http.put<ServerResponse>(this.url, null, {headers: this.headers});
	}
	//DELETE calls

	deleteHwconfById(hwconfId: number){
		this.url = this.hostname + `/clonetool/${hwconfId}`;
		return this.http.delete<ServerResponse>(this.url, { headers: this.headers });
	}
}
