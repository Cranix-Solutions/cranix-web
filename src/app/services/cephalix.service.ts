import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UtilsService } from './utils.service';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';

import { Customer, Institute, Ticket, Article, Notice, OssCare, SynchronizedObject } from 'src/app/shared/models/cephalix-data-model';
import { ServerResponse } from 'src/app/shared/models/server-models';
import { AuthenticationService } from './auth.service';
import { InstituteStatus } from '../shared/models/cephalix-data-model';


export interface InstallSetSync{
	instituteId: number,
	categoryId: number[]
}

@Injectable()
export class CephalixService {

	hostname: string;
	token: string;
	url: string;
	res: any;
	headers: any;
	selectedInstitutes: Institute[] = [];
	selectedList: string[] = [];
	templateInstitute = new Institute();

	constructor(
		private utilsS: UtilsService,
		private http:   HttpClient,
		private authS:  AuthenticationService)
		{
			this.hostname = this.utilsS.hostName();
			this.token          = this.authS.getToken();
			this.headers     = new HttpHeaders({
				'Content-Type': "application/json",
				'Accept' : "application/json",
				'Authorization' : "Bearer " + this.token
			});
			if( ! authS.isAllowed('customer.manage') ) {
				delete this.templateInstitute.cephalixCustomerId;
			}
	}

	//GET calls
	getInstituteToken(id: number) {
		this.url = this.hostname + `/institutes/${id}/token`;
		const headers = new HttpHeaders({
			'Accept': 'text/plain',
			'Authorization': "Bearer " + this.token
		});
		return this.http.get(this.url, { headers: headers, responseType: 'text' });
	}
	getStatusOfInstitutes(): Observable<InstituteStatus[]> {
		this.url = this.hostname + `/institutes/newestStatus`;
		console.log(this.url);
		return this.http.get<InstituteStatus[]>(this.url, { headers: this.headers });
	};
	getStatusOfInstitute(id: number): Observable<InstituteStatus[]> {
		this.url = this.hostname + `/institutes/${id}/status`;
		console.log(this.url);
		return this.http.get<InstituteStatus[]>(this.url, { headers: this.headers });
	};
	writeConfig(instituteId: number){
		const url = `${this.hostname}/institutes/${instituteId}/writeConfig`;
		return this.http.put<ServerResponse>(url,null ,{ headers: this.headers });
	}
	getNextDefaults(){
		this.url = this.hostname + `/institutes/nextDefaults`;
		console.log(this.url);
		return this.http.get<Institute>(this.url, { headers: this.headers });
	}
	getDefaults(){
		this.url = this.hostname + `/institutes/defaults`;
		console.log(this.url);
		return this.http.get<Institute>(this.url, { headers: this.headers });
	}
	getObjectsToSynchronize(){
		this.url = this.hostname + `/institutes/objects`;
		console.log(this.url);
		return this.http.get<SynchronizedObject[]>(this.url, { headers: this.headers });
	}
	getSynchronizedObjects(instituteId: number){
		this.url = this.hostname + `/institutes/${instituteId}/objects`;
		console.log(this.url);
		return this.http.get<SynchronizedObject[]>(this.url, { headers: this.headers });
	}

	getArticklesOfTicket(id: number): Observable<Article[]> {
		this.url = this.hostname + '/tickets/' + id + '/articles';
		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.get<Article[]>(this.url, { headers: headers });
	};


	getInstituteTypes(): Observable<string[]> {
		this.url = this.hostname + `/system/enumerates/institutetype`;
		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.get<string[]>(this.url, { headers: headers });
	}

	getCategorieTypes() {
		//	this.hostname = this.utils.hostName();
		//      this.token = this.token;
		this.url = this.hostname + `/institutes/objects`;
		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.get<string[]>(this.url, { headers: headers });
	}

	getInstituteById(id: number){
		this.url = this.hostname + `/institutes/${id}`;
		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.get<Institute>(this.url, { headers: headers });
	}


	getAyTemplates(){
		this.url = this.hostname + `/institutes/ayTemplates`;
		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.get<string[]>(this.url, { headers: headers });
	}
	getNoticesOfInst(id: number){
			//	this.hostname = this.utils.hostName();
		//      this.token = this.token;
		this.url = this.hostname + `/institutes/${id}/notices`;
		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.get<Notice[]>(this.url, { headers: headers });
	}
	getOssCaerOfInst(id: number){
			//	this.hostname = this.utils.hostName();
		//      this.token = this.token;
		this.url = this.hostname + `/customers/institutes/${id}/osscare`;
		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.get<OssCare[]>(this.url, { headers: headers });
	}

	//POST
	addNoticeToInst(id: number, note: Notice){
		this.url = this.hostname + `/institutes/${id}/notices`;
		const headers = new HttpHeaders({
				'Accept' : "application/json",
				'Authorization' : "Bearer " + this.token
		});
		return this.http.post<ServerResponse>(this.url,note, { headers: headers});
	}
	syncFileToInstitutes(fd: FormData){
		this.url = this.hostname + `/institutes/copyFile`;
		const headers = new HttpHeaders({
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
		});
		return this.http.post<ServerResponse>(this.url,fd, { headers: headers});
	}
	modifyInstitute(institute: Institute){
		this.url = this.hostname + `/institutes/${institute.id}`;
		const headers = new HttpHeaders({
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
		});
		return this.http.post<ServerResponse>(this.url,institute, { headers: headers});
	}
	setOssCareToInst(id: number, ossCare: OssCare){
		//This call creates or modifies the OssCare of an institute
		this.url = this.hostname + `/customers/institutes/${id}/osscare`;
		const headers = new HttpHeaders({
				'Accept' : "application/json",
				'Authorization' : "Bearer " + this.token
		});
		return this.http.post<ServerResponse>(this.url,ossCare, { headers: headers});
	}

	//PUT
	putInstallSetToSync(instituteId	: number, categoryId: number){
		const url = `${this.hostname}/institutes/${instituteId}/categories/${categoryId}`;
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
		});
		return this.http.put<ServerResponse>(url,null ,{ headers: headers });
	}

	putObjectToSync(instituteId	: number, objectType: string, objectId: number|string){
		const url = `${this.hostname}/institutes/${instituteId}/objects/${objectType.toLocaleLowerCase()}/${objectId}`;
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
		});
		console.log(url);
		return this.http.put<ServerResponse>(url,null ,{ headers: headers });
	}
	puCatToSync(instituteId	: number, categoryId: number|string){
		const url = `${this.hostname}/institutes/${instituteId}/categories/${categoryId}`;
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
		});
		console.log(url);
		return this.http.put<ServerResponse>(url,null ,{ headers: headers });
	}
	updateById(instituteId: number){
		const url = `${this.hostname}/institutes/${instituteId}/update`;
		return this.http.put<ServerResponse>(url,null ,{ headers: this.headers });
	}


	//DELETE
	deleteInstituteById(instituteId: number){
		this.url = this.hostname + `/institutes/${instituteId}`;
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.delete<ServerResponse>(this.url, { headers: headers });
	}
	deleteObjectInstitute(instituteId: number, objectId: number, ojectType: string){
		this.url = this.hostname + `/institutes/${instituteId}/objects/${ojectType.toLocaleLowerCase()}/${objectId}`;
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.delete<ServerResponse>(this.url, { headers: headers });
	}
	deleteNote(id : number){
		this.url = this.hostname + `/institutes/notices/${id}`;
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.delete<ServerResponse>(this.url, { headers: headers });
	}
}
