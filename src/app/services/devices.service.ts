import { Observable } from 'rxjs/internal/Observable';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device, InstallStateDev, Printer, DHCP } from '../shared/models/data-model';
import { UtilsService } from './utils.service';
import { ServerResponse } from 'src/app/shared/models/server-models';
import { AuthenticationService } from './auth.service';

@Injectable()
export class DevicesService {

	hostname: string;
	token: string;
	url: string;

	constructor(
		private utils: UtilsService,
		private http: HttpClient,
		private authS: AuthenticationService) {
		this.hostname = this.utils.hostName();
		this.token    = this.authS.getToken();
		//this.token = this.token;
	}


  //StoredData Calls


  // HTTP calls

  // POST Calls

  addDhcp(dId: number, dhcp: DHCP ){
	// let body2 = JSON.stringify(device);
	this.url = this.hostname + `/devices/${dId}/dhcp`;
	const headers = new HttpHeaders({
		'Content-Type': "application/json",
		'Accept' : "application/json",
		'Authorization' : "Bearer " + this.token
	});
	return this.http.post<ServerResponse>(this.url, dhcp , { headers: headers});

}

  addDevice(device: Device[], room: number ){
		const body = device ;
		// let body2 = JSON.stringify(device);
		this.url = this.hostname + "/rooms/" + room + "/devices";
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
		});
		
		return this.http.post<ServerResponse>(this.url, device , { headers: headers});

  }

  modDevice(device: Device){
	const body = device ;
		// let body2 = JSON.stringify(device);
		this.url = this.hostname + "/devices/modify";
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
		});
		
		return this.http.post<ServerResponse>(this.url, device , { headers: headers});
  }
  
  importDevices(fd: FormData){
	this.url = this.hostname + `/devices/import`;
    //let x = fd.getAll("name")
    //let y = fd.get("name")	'Content-Type': "multipart/form-data",
    //console.log("in service", x,y);,
    const headers = new HttpHeaders({
		
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
    });
    return this.http.post<ServerResponse>(this.url,fd, { headers: headers});
  
  }
  // GET Calls

  getDhcp(dId: number){
	// let body2 = JSON.stringify(device);
	this.url = `${this.hostname}/devices/${dId}/dhcp`;
	console.log(this.url);
	const headers = new HttpHeaders({
		'Accept' : "application/json",
		'Authorization' : `Bearer ${this.token}`
	});
	return this.http.get<DHCP[]>(this.url, { headers: headers});
  }

  getSoftwareOnDev(id: number){
	this.url = `${this.hostname}/softwares/devices/${id}`;
console.log(this.url);
const headers = new HttpHeaders({
	'Accept' : "application/json",
	'Authorization' : `Bearer ${this.token}`
});
return this.http.get<InstallStateDev[]>(this.url, { headers: headers});
}

  getAllDevices(){
	this.url = this.hostname + `/devices/all`;
	console.log(this.url);
	const headers = new HttpHeaders({
		'Accept' : "application/json",
		'Authorization' : "Bearer " + this.token
	});
	return this.http.get<Device[]>(this.url, { headers: headers});
  }
  getRoomDevices(id: number):Observable<Device[]>{
		//	this.hostname = this.utils.hostName();
		//      this.token = this.token;
		this.url = this.hostname + `/rooms/${id}/devices`;
		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
		});
		return this.http.get<Device[]>(this.url, { headers: headers});
	};
  getRoomDevicesPlain(id: number){
    this.url = this.hostname + `/rooms/${id}/devices`;
		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
		});
		return this.http.get(this.url, { headers: headers});
	}

	getDevicesByHW(id: number):Observable<Device[]>{
		this.url = this.hostname + `/devices/byHWConf/${id}`;
		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
		});
		return this.http.get<Device[]>(this.url, { headers: headers});
	}

	getDevicesById(id: number){
		this.url = this.hostname + `/devices/${id}`;
		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
		});
		return this.http.get<Device>(this.url, { headers: headers});
	}
	getDefPrinter(id: number){
		this.url = `${this.hostname}/devices/${id}/defaultPrinter`;

		const headers = new HttpHeaders({
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
		});
		return this.http.get<Printer>(this.url, { headers: headers});		
	}
	getAvaiPrinter(id: number){
		this.url = `${this.hostname}/devices/${id}/availablePrinters`;

		const headers = new HttpHeaders({
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
		});
		return this.http.get<Printer[]>(this.url, { headers: headers});		

	}

	getDevSearch(search: string){
		this.url = `${this.hostname}/devices/search/${search}`;

		const headers = new HttpHeaders({
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
		});
		return this.http.get<Device[]>(this.url, { headers: headers});		

	}
	// PUT calls 

	putDefPrinter(dId: number, pId: number){
		this.url = `${this.hostname}/devices/${dId}/defaultPrinter/${pId}`;
		console.log(this.url);
		console.log(this.token);
		const headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Accept' : 'application/json',
			'Authorization' : 'Bearer ' + this.token
		});
		//let body=null;
		// console.log(headers.getAll('Content-Type') + " " + headers.getAll('Accept') + " " + headers.getAll('Authorization'));
		return this.http.put<ServerResponse>(this.url, null,{ headers: headers});
	}
	putAvaiPrinter(dId: number, pId: number){
		this.url = `${this.hostname}/devices/${dId}/availablePrinters/${pId}`;
		console.log(this.url);
		console.log(this.token);
		const headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Accept' : 'application/json',
			'Authorization' : 'Bearer ' + this.token
		});
		//let body=null;
		// console.log(headers.getAll('Content-Type') + " " + headers.getAll('Accept') + " " + headers.getAll('Authorization'));
		return this.http.put<ServerResponse>(this.url, null,{ headers: headers});
	}

	//DELETE Calls

	deleteDevice(id: number){
		this.url = this.hostname + `/devices/${id}`;
		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
		});
		return this.http.delete<ServerResponse>(this.url, { headers: headers});
	}

	deleteDefPrinter(id: number){
		this.url = this.hostname + `/devices/${id}/defaultPrinter`;
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.delete<ServerResponse>(this.url, { headers: headers });

	}
	deleteAvaiPrinter(dId: number, pId: number){
		this.url = this.hostname + `/devices/${dId}/availablePrinters/${pId}`;
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.delete<ServerResponse>(this.url, { headers: headers });

	}

	deleteDHCPrecord(dId: number,paramId: number){
		this.url = this.hostname + `/devices/${dId}/dhcp/${paramId}`;
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.delete<ServerResponse>(this.url, { headers: headers });
	}

}
