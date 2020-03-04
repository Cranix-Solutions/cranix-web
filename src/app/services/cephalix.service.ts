import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UtilsService } from './utils.service';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';

import { Institute, Object, Note, OssCare } from 'src/app/shared/models/cephalix-data-model';
import { ServerResponse } from 'src/app/shared/models/server-models';
import { AuthenticationService } from './auth.service';
import { Customer, Ticket, Article } from '../shared/models/cephalix-data-model';


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

	institutes: BehaviorSubject<Institute[]> = new BehaviorSubject(undefined);

	constructor(
		private utilsS: UtilsService,
		private http:   HttpClient,
		private authS:  AuthenticationService)
		{
			this.hostname = this.utilsS.hostName();
			this.token    = this.authS.getToken();
			this.loadInitialData();
	}


	loadInitialData() {
		this.getAllInstitutes()
			.subscribe(data => {
				this.institutes.next(data);
			})
	}

	getSTAllInstitutes() {
		return this.institutes.asObservable();
	}

	// POST calls
	addInstitute(institute: Institute) {
		this.url = this.hostname + "/institutes/add";
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.post<ServerResponse>(this.url, institute, { headers: headers });
	}

	//GET calls
	getInstituteToken(id: number) {
		this.url = this.hostname + `/institutes/${id}/token`;
		const headers = new HttpHeaders({
			'Accept': 'text/plain',
			'Authorization': "Bearer " + this.token
		});
		//console.log(headers.getAll('Content-Type') + " " + headers.getAll('Accept') + " " + headers.getAll('Authorization'));
		return this.http.get(this.url, { headers: headers, responseType: 'text' });
	}
	getAllInstitutes(): Observable<Institute[]> {
		//	this.hostname = this.utils.hostName();
		//  this.token = this.token;
		this.url = this.hostname + `/institutes/all`;
		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.get<Institute[]>(this.url, { headers: headers });
	};
	getAllCustomers(): Observable<Customer[]> {
		//	this.hostname = this.utils.hostName();
		//  this.token = this.token;
		this.url = this.hostname + `/customers/all`;
		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.get<Customer[]>(this.url, { headers: headers });
	};
	getArticklesOfTicket(id: number): Observable<Article[]> {
		this.url = this.hostname + '/tickets/' + id + '/articles';
		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.get<Article[]>(this.url, { headers: headers });
	};
	getAllTickets(): Observable<Ticket[]> {
		this.url = this.hostname + `/tickets/all`;
		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.get<Ticket[]>(this.url, { headers: headers });
	};
	getNextDefault(){
		//	this.hostname = this.utils.hostName();
		//      this.token = this.token;
		this.url = this.hostname + `/institutes/nextDefaults`;
		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.get<Institute>(this.url, { headers: headers });
	}

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

	getObjectsByInstitue(instituteId: number){
		this.url = this.hostname + `/institutes/${instituteId}/objects`;
		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.get<Object[]>(this.url, { headers: headers });
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
	getNotesOfInst(id: number){
			//	this.hostname = this.utils.hostName();
		//      this.token = this.token;
		this.url = this.hostname + `/institutes/${id}/notices`;
		console.log(this.url);
		const headers = new HttpHeaders({
			'Accept': "application/json",
			'Authorization': "Bearer " + this.token
		});
		return this.http.get<Note[]>(this.url, { headers: headers });
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
	addNoteToInst(id: number, note: Note){
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
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
		});
		return this.http.put<ServerResponse>(url,null ,{ headers: headers });
	}
	createConfig(instituteId: number){
		const url = `${this.hostname}/institutes/${instituteId}/writeConfig`;
		const headers = new HttpHeaders({
			'Content-Type': "application/json",
			'Accept' : "application/json",
			'Authorization' : "Bearer " + this.token
		});
		return this.http.put<ServerResponse>(url,null ,{ headers: headers });
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
