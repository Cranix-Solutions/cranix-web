import { Group, User, Device } from 'src/app/shared/models/data-model';
import {  AdHocRoom } from 'src/app/shared/models/data-model';
import { ServerResponse } from 'src/app/shared/models/server-models';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UtilsService } from './utils.service';
import { AuthenticationService } from './auth.service';



@Injectable()
export class AdHocLanService {

    hostname: string;
    token: string;
    url: string;

    headers: HttpHeaders;



    constructor(private utils: UtilsService,
		 private http: HttpClient,
          private authService: AuthenticationService)
        {
		this.hostname = this.utils.hostName();
    }

    //GET 
    getMyDevices(){
        this.url = `${this.hostname}/adhocrooms/devices`;
        console.log(this.url);
        return this.http.get<Device[]>(this.url, { headers:  this.authService.headers  });
    }
    getMyRooms() {
        this.url = `${this.hostname}/adhocrooms/all`;
        console.log(this.url);
        return this.http.get<AdHocRoom[]>(this.url, { headers: this.authService.headers });
    }

    //DELETE

    deleteAdhocDEV(devId: number){
        this.url = this.hostname + `/adhocrooms/devices/${devId}`;
		return this.http.delete<ServerResponse>(this.url, { headers:  this.authService.headers  });
    }

    //GET calls 
    getAllRooms() {
        this.url = `${this.hostname}/adhoclan/rooms`;
        console.log(this.url);
        return this.http.get<AdHocRoom[]>(this.url, { headers: this.authService.headers });
    }

    getRoomById(roomId: number){
        this.url = `${this.hostname}/adhoclan/rooms/${roomId}`;
        console.log(this.url);
        return this.http.get<AdHocRoom>(this.url, { headers:  this.authService.headers  });
    }

    getAvaiGroups(roomId: number){
        this.url = `${this.hostname}/adhoclan/rooms/${roomId}/available/groups`;
        console.log(this.url);
        return this.http.get<Group[]>(this.url, { headers:  this.authService.headers  });
    }

    getAvaiUsers(roomId: number){
        this.url = `${this.hostname}/adhoclan/rooms/${roomId}/available/users`;
        console.log(this.url);
        return this.http.get<User[]>(this.url, { headers:  this.authService.headers  });
    }

    getUsersInRooms(roomId: number){
        this.url = `${this.hostname}/adhoclan/rooms/${roomId}/users`;
        console.log(this.url);
        return this.http.get<User[]>(this.url, { headers: this.authService.headers });
    }
    getGroupsInRooms(roomId: number){
        this.url = `${this.hostname}/adhoclan/rooms/${roomId}/groups`;
        return this.http.get<Group[]>(this.url, { headers:  this.authService.headers  });
    }
    /*getMyDevices(){
        this.url = `${this.hostname}/adhoclan/devices`;
        console.log(this.url);
        return this.http.get<Device[]>(this.url, { headers:  this.authService.headers  });
    }*/

    getDevicesInRoom(id: number){
        this.url = `${this.hostname}/adhoclan/rooms/${id}/devices`;
        console.log(this.url);
        return this.http.get<Device[]>(this.url, { headers:  this.authService.headers  });
    }

    //POST 

    addRoom(newRoom: AdHocRoom) {
        this.url = this.hostname + "/adhoclan/rooms";
        return this.http.post<ServerResponse>(this.url, newRoom, { headers:  this.authService.headers  });
    };
    modifyAdhocRoom(room: AdHocRoom){
        this.url = this.hostname + `/adhoclan/rooms/${room.id}`;
        return this.http.post<ServerResponse>(this.url, room, { headers:  this.authService.headers  });
    }

    modifyAdhocDev(dev: Device){
        this.url = this.hostname + `/adhoclan/devices/${dev.id}`;
        return this.http.post<ServerResponse>(this.url, dev, { headers:  this.authService.headers  });
    }
    //PUT 

    addAccessToRoom(roomId: number, objectType: string, objectId: number){
        this.url = this.hostname + `/adhoclan/rooms/${roomId}/${objectType}/${objectId}`;
        return this.http.put<ServerResponse>(this.url, null, { headers:  this.authService.headers  });
    }
    registerOwnDev(roomId: number, macAddress: string, name?: string) {
        this.url = this.hostname + `/adhoclan/rooms/${roomId}/device/${macAddress}/${name}`;
        return this.http.put<ServerResponse>(this.url, null, { headers:  this.authService.headers  });

    }

    //DELETE 
    removeGroupFromRoom(roomId: number, objectType: string, objectId: number){
        this.url = this.hostname + `/adhoclan/rooms/${roomId}/${objectType}/${objectId}`;
	return this.http.delete<ServerResponse>(this.url, { headers:  this.authService.headers  });
    }

    deleteAdHocDevice(deviceId: number){
        this.url = this.hostname + `/adhoclan/devices/${deviceId}`;
	return this.http.delete<ServerResponse>(this.url, { headers:  this.authService.headers  });
    }

    deleteAdhocRoom(roomId: number){
        this.url = this.hostname + `/adhoclan/rooms/${roomId}`;
	return this.http.delete<ServerResponse>(this.url, { headers:  this.authService.headers  });
    }
}
