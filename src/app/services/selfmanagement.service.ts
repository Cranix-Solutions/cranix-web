import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { AuthenticationService } from './auth.service';
import { UtilsService } from './utils.service';
import { Crx2fa, ServerResponse } from 'src/app/shared/models/server-models';
import { User, Device, Room, IdRequest } from 'src/app/shared/models/data-model';

@Injectable()
export class SelfManagementService {

    hostname: string;
    url: string;

    constructor(
        private utils: UtilsService,
        private authService: AuthenticationService,
        private http: HttpClient) {
        this.hostname = this.utils.hostName();
    }

    //GET 

    getMySelf() {
        this.url = this.hostname + `/selfmanagement/me`;
        console.log(this.url);
        return this.http.get<User>(this.url, { headers: this.authService.headers });
    }

    getVPNhave() {
        this.url = this.hostname + `/selfmanagement/vpn/have`;
        console.log(this.url);
        return this.http.get<boolean>(this.url, { headers: this.authService.headers });
    }

    getSupportedOS() {
        this.url = this.hostname + `/selfmanagement/vpn/OS`;
        console.log(this.url);
        return this.http.get<string[]>(this.url, { headers: this.authService.headers });
    }

    getVPNConfig(os: string) {
        this.url = this.hostname + `/selfmanagement/vpn/config/${os}`;
        console.log(this.url);
        const headers = new HttpHeaders({
            'Authorization': "Bearer " + this.authService.session.token
        });
        console.log('header is:', headers);
        return this.http.get(this.url, { headers: headers, observe: 'response', responseType: 'blob' });
    }

    getVPNInstaller(os: string) {
        this.url = this.hostname + `/selfmanagement/vpn/installer/${os}`;
        console.log(this.url);
        const headers = new HttpHeaders({
            'Authorization': "Bearer " + this.authService.session.token
        });
        return this.http.get(this.url, { headers: headers, observe: 'response', responseType: 'blob' });
    }

    getMyDevices() {
        this.url = this.hostname + `/selfmanagement/devices`;
        console.log(this.url);
        return this.http.get<User>(this.url, { headers: this.authService.headers });
    }
    getMyRooms() {
        this.url = this.hostname + `/selfmanagement/rooms`;
        console.log(this.url);
        return this.http.get<Room[]>(this.url, { headers: this.authService.headers });
    }

    // POST 
    modMySelf(user: User) {
        const url = this.hostname + "/selfmanagement/modify";
        console.log(url);
        return this.http.post<ServerResponse>(url, user, { headers: this.authService.headers });
    }

    addDevice(dev: Device) {
        const url = this.hostname + "/selfmanagement/devices/add";
        console.log(url);
        return this.http.post<ServerResponse>(url, dev, { headers: this.authService.headers });
    }

    removeDevice(devId: number) {
        const url = this.hostname + `/selfmanagement/devices/${devId}`;
        console.log(url);
        return this.http.delete<ServerResponse>(url, { headers: this.authService.headers });
    }

    //CRX2FA stuff
    getCfaTypes() {
        const url = this.hostname + '/2fas/types';
        console.log(url);
        return this.http.get<string[]>(url, { headers: this.authService.headers });
    }
    saveMyCfa(crx2fa: Crx2fa) {
        const url = this.hostname + '/2fas';
        console.log(url);
        if( crx2fa.id ) {
            return this.http.patch<ServerResponse>(url, crx2fa, { headers: this.authService.headers });
        } else {
            return this.http.post<ServerResponse>(url, crx2fa, { headers: this.authService.headers });
        }
    }

    getMyCfas() {
        const url = this.hostname + '/2fas';
        console.log(url);
        return this.http.get<Crx2fa[]>(url, { headers: this.authService.headers });
    }

    deleteCfa(crx2fa: Crx2fa) {
        const url = this.hostname + `/2fas/${crx2fa.id}`;
        console.log(url);
        return this.http.delete<ServerResponse>(url, { headers: this.authService.headers });
    }

    resetCfa(crx2fa: Crx2fa) {
        const url = this.hostname + `/2fas/${crx2fa.id}`;
        console.log(url);
        return this.http.delete<ServerResponse>(url, { headers: this.authService.headers });
    }

    checkOtp(otppin: string) {
        const url = this.hostname + '/2fas/checkpin';
        console.log(url);
        const data = {
            pin: otppin,
            token: this.authService.token
        }
        return this.http.post<ServerResponse>(url, data, { headers: this.authService.anonHeaders });
    }

    addEditIdRequest(idRequests: IdRequest) {
        const url = this.hostname + '/idRequests/my';
        console.log(url);
        return this.http.post<ServerResponse>(url, idRequests, { headers: this.authService.headers });
    }

    getMyIdRequest() {
        const url = this.hostname + '/idRequests/my';
        console.log(url);
        return this.http.get<IdRequest>(url, { headers: this.authService.headers });
    }

    deleteMyIdRequest(id: number) {
        const url = `${this.hostname}/idRequests/${id}`;
        console.log(url);
        return this.http.delete<ServerResponse>(url, { headers: this.authService.headers });
    }
}
