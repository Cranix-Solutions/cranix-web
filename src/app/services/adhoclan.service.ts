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
        private authS: AuthenticationService) 
        {
		this.hostname = this.utils.hostName();
		this.token = this.authS.getToken();
		this.headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
    }



   



    //GET calls
    getAllRooms() {
        this.url = `${this.hostname}/adhoclan/rooms`;
        console.log(this.url);
        const headers = new HttpHeaders({
            'Accept': "application/json",
            'Authorization': "Bearer " + this.token
        });
        return this.http.get<AdHocRoom[]>(this.url, { headers: this.headers });
    }

    getRoomById(roomId: number){
        this.url = `${this.hostname}/adhoclan/rooms/${roomId}`;
        console.log(this.url);
        const headers = new HttpHeaders({
            'Accept': "application/json",
            'Authorization': "Bearer " + this.token
        });
        return this.http.get<AdHocRoom>(this.url, { headers:  this.headers  });
    }

    getAvaiGroups(roomId: number){
        this.url = `${this.hostname}/adhoclan/rooms/${roomId}/available/groups`;
        console.log(this.url);
        const headers = new HttpHeaders({
            'Accept': "application/json",
            'Authorization': "Bearer " + this.token
        });
        return this.http.get<Group[]>(this.url, { headers:  this.headers  });
    }

    getAvaiUsers(roomId: number){
        this.url = `${this.hostname}/adhoclan/rooms/${roomId}/available/users`;
        console.log(this.url);
        const headers = new HttpHeaders({
            'Accept': "application/json",
            'Authorization': "Bearer " + this.token
        });
        return this.http.get<User[]>(this.url, { headers:  this.headers  });
    }

    getUsersInRooms(roomId: number){
        this.url = `${this.hostname}/adhoclan/rooms/${roomId}/users`;
        console.log(this.url);
        const headers = new HttpHeaders({
            'Accept': "application/json",
            'Authorization': "Bearer " + this.token
        });
        return this.http.get<User[]>(this.url, { headers: this.headers });
    }
    getGroupsInRooms(roomId: number){
        this.url = `${this.hostname}/adhoclan/rooms/${roomId}/groups`;
        console.log(this.url);
        const headers = new HttpHeaders({
            'Accept': "application/json",
            'Authorization': "Bearer " + this.token
        });
        return this.http.get<Group[]>(this.url, { headers:  this.headers  });
    }
    getMyDevices(){
        this.url = `${this.hostname}/adhoclan/devices`;
        console.log(this.url);
        const headers = new HttpHeaders({
            'Accept': "application/json",
            'Authorization': "Bearer " + this.token
        });
        return this.http.get<Device[]>(this.url, { headers:  this.headers  });
    }

    getDevicesInRoom(id: number){
        this.url = `${this.hostname}/adhoclan/rooms/${id}/devices`;
        console.log(this.url);
        const headers = new HttpHeaders({
            'Accept': "application/json",
            'Authorization': "Bearer " + this.token
        });
        return this.http.get<Device[]>(this.url, { headers:  this.headers  });
    }

    //POST 

    addRoom(newRoom: AdHocRoom) {
        const body = newRoom;
        console.log("This is room as utils sees: ");

        // let body2 = JSON.stringify(body)
        // console.log(body2);
        this.url = this.hostname + "/adhoclan/rooms";
        const headers = new HttpHeaders({
            'Content-Type': "application/json",
            'Accept': "application/json",
            'Authorization': "Bearer " + this.token
        });
        //let body2 = JSON.stringify(body);
        //console.log(body2);
        //
        //
        //
        //console.log(body);
        return this.http.post<ServerResponse>(this.url, body, { headers:  this.headers  });
    };
    modifyAdhocRoom(room: AdHocRoom){
        this.url = this.hostname + `/adhoclan/rooms/${room.id}`;
        const headers = new HttpHeaders({
            'Content-Type': "application/json",
            'Accept': "application/json",
            'Authorization': "Bearer " + this.token
        });
        //let body2 = JSON.stringify(body);
        //console.log(body2);
        //
        //
        //
        //console.log(body);
        return this.http.post<ServerResponse>(this.url, room, { headers:  this.headers  });
    }

    modifyAdhocDev(dev: Device){
        this.url = this.hostname + `/adhoclan/devices/${dev.id}`;
        const headers = new HttpHeaders({
            'Content-Type': "application/json",
            'Accept': "application/json",
            'Authorization': "Bearer " + this.token
        });
        //let body2 = JSON.stringify(body);
        //console.log(body2);
        //
        //
        //
        //console.log(body);
        return this.http.post<ServerResponse>(this.url, dev, { headers:  this.headers  });
    }
    //PUT 

    addAccessToRoom(roomId: number, objectType: string, objectId: number){
        this.url = this.hostname + `/adhoclan/rooms/${roomId}/${objectType}/${objectId}`;
        //console.log(encodeURI(this.url));

        //this.url = encodeURI(this.url);
        //console.log(this.token);
        const headers = new HttpHeaders({
            'Content-Type': "application/json",
            'Accept': "application/json",
            'Authorization': "Bearer " + this.token
        });
        let body = null;
        //console.log(headers.getAll('Content-Type') + " " + headers.getAll('Accept') + " " + headers.getAll('Authorization'));
        return this.http.put<ServerResponse>(this.url, body, { headers:  this.headers  });
    }
    registerOwnDev(roomId: number, macAddress: string, name?: string) {
        this.url = this.hostname + `/adhoclan/rooms/${roomId}/device/${macAddress}/${name}`;
        //console.log(encodeURI(this.url));

        //this.url = encodeURI(this.url);
        //console.log(this.token);
        const headers = new HttpHeaders({
            'Content-Type': "application/json",
            'Accept': "application/json",
            'Authorization': "Bearer " + this.token
        });
        let body = null;
        //console.log(headers.getAll('Content-Type') + " " + headers.getAll('Accept') + " " + headers.getAll('Authorization'));
        return this.http.put<ServerResponse>(this.url, body, { headers:  this.headers  });

    }

    //DELETE 

    removeGroupFromRoom(roomId: number, objectType: string, objectId: number){
        this.url = this.hostname + `/adhoclan/rooms/${roomId}/${objectType}/${objectId}`;
        const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.delete<ServerResponse>(this.url, { headers:  this.headers  });
    }

    deleteAdHocDevice(deviceId: number){
        this.url = this.hostname + `/adhoclan/devices/${deviceId}`;
        const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.delete<ServerResponse>(this.url, { headers:  this.headers  });
    }

    deleteAdhocRoom(roomId: number){
        this.url = this.hostname + `/adhoclan/rooms/${roomId}`;
        const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.delete<ServerResponse>(this.url, { headers:  this.headers  });
    }
}