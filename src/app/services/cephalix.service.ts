import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UtilsService } from './utils.service';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';

import { Customer, Institute, Ticket, Article, Notice, CrxCare, SynchronizedObject } from 'src/app/shared/models/cephalix-data-model';
import { ServerResponse, CrxActionMap } from 'src/app/shared/models/server-models';
import { AuthenticationService } from './auth.service';
import { InstituteStatus } from 'src/app/shared/models/cephalix-data-model';


export interface InstallSetSync{
	instituteId: number,
	categoryId: number[]
}

@Injectable()
export class CephalixService {

	hostname: string;
	url: string;
	res: any;
	headers: any;
	selectedInstitutes: Institute[] = [];
	selectedList: string[] = [];
	templateInstitute = new Institute();

	constructor(
		private utilsS: UtilsService,
		private http:   HttpClient,
		private authService:  AuthenticationService)
		{
			this.hostname = this.utilsS.hostName();
			if( ! authService.isAllowed('customer.manage') ) {
				delete this.templateInstitute.cephalixCustomerId;
			}
	}

	//GET calls
	getInstituteToken(id: number) {
		this.url = this.hostname + `/institutes/${id}/token`;
		const headers = new HttpHeaders({
			'Accept': 'text/plain',
			'Authorization': "Bearer " + this.authService.session.token
		});
		return this.http.get(this.url, { headers: headers, responseType: 'text' });
	}
	getStatusOfInstitutes(): Observable<InstituteStatus[]> {
		this.url = this.hostname + `/institutes/newestStatus`;
		console.log(this.url);
		return this.http.get<InstituteStatus[]>(this.url, { headers: this.authService.headers });
	};
	getStatusOfInstitute(id: number): Observable<InstituteStatus[]> {
		this.url = this.hostname + `/institutes/${id}/status`;
		console.log(this.url);
		return this.http.get<InstituteStatus[]>(this.url, { headers: this.authService.headers });
	};
	writeConfig(instituteId: number){
		const url = `${this.hostname}/institutes/${instituteId}/writeConfig`;
		return this.http.put<ServerResponse>(url,null ,{ headers: this.authService.headers });
	}
	getNextDefaults(){
		this.url = this.hostname + `/institutes/nextDefaults`;
		console.log(this.url);
		return this.http.get<Institute>(this.url, { headers: this.authService.headers });
	}
	getDefaults(){
		this.url = this.hostname + `/institutes/defaults`;
		console.log(this.url);
		return this.http.get<Institute>(this.url, { headers: this.authService.headers });
	}
	getObjectsToSynchronize(){
		this.url = this.hostname + `/institutes/objects`;
		console.log(this.url);
		return this.http.get<SynchronizedObject[]>(this.url, { headers: this.authService.headers });
	}
	getSynchronizedObjects(instituteId: number){
		this.url = this.hostname + `/institutes/${instituteId}/objects`;
		console.log(this.url);
		return this.http.get<SynchronizedObject[]>(this.url, { headers: this.authService.headers });
	}

	getArticklesOfTicket(id: number): Observable<Article[]> {
		this.url = this.hostname + '/tickets/' + id + '/articles';
		console.log(this.url);
		return this.http.get<Article[]>(this.url, { headers: this.authService.headers });
	};


	getInstituteTypes(): Observable<string[]> {
		this.url = this.hostname + `/system/enumerates/institutetype`;
		console.log(this.url);
		return this.http.get<string[]>(this.url, { headers: this.authService.headers });
	}

	getCategorieTypes() {
		this.url = this.hostname + `/institutes/objects`;
		console.log(this.url);
		return this.http.get<string[]>(this.url, { headers: this.authService.headers });
	}

	getInstituteById(id: number){
		this.url = this.hostname + `/institutes/${id}`;
		console.log(this.url);
		return this.http.get<Institute>(this.url, { headers: this.authService.headers });
	}


	getAyTemplates(){
		this.url = this.hostname + `/institutes/ayTemplates`;
		console.log(this.url);
		return this.http.get<string[]>(this.url, { headers: this.authService.headers });
	}
	getNoticesOfInst(id: number){
		this.url = this.hostname + `/institutes/${id}/notices`;
		console.log(this.url);
		return this.http.get<Notice[]>(this.url, { headers: this.authService.headers });
	}
	getCrxCaerOfInst(id: number){
		this.url = this.hostname + `/customers/institutes/${id}/osscare`;
		console.log(this.url);
		return this.http.get<CrxCare[]>(this.url, { headers: this.authService.headers });
	}

	//POST
	applyAction(actionMap: CrxActionMap ){
		this.url = this.hostname + `/institutes/applyAction`;
		console.log(this.url);
		return this.http.post<ServerResponse>(this.url,actionMap, { headers: this.authService.headers});
	}
	addNoticeToInst(id: number, note: Notice){
		this.url = this.hostname + `/institutes/${id}/notices`;
		return this.http.post<ServerResponse>(this.url,note, { headers: this.authService.headers});
	}
	syncFileToInstitutes(fd: FormData){
		this.url = this.hostname + `/institutes/copyFile`;
		return this.http.post<ServerResponse>(this.url,fd, { headers: this.authService.headers});
	}
	setCrxCareToInst(id: number, ossCare: CrxCare){
		this.url = this.hostname + `/customers/institutes/${id}/osscare`;
		return this.http.post<ServerResponse>(this.url,ossCare, { headers: this.authService.headers});
	}

	//PUT
	putInstallSetToSync(instituteId	: number, categoryId: number){
		const url = `${this.hostname}/institutes/${instituteId}/categories/${categoryId}`;
		return this.http.put<ServerResponse>(url,null ,{ headers: this.authService.headers });
	}

	putObjectToInstitute(instituteId	: number, objectType: string, objectId: number|string){
		const url = `${this.hostname}/institutes/${instituteId}/objects/${objectType.toLocaleLowerCase()}/${objectId}`;
		console.log(url);
		return this.http.put<ServerResponse>(url,null ,{ headers: this.authService.headers });
	}
	deleteObjectFromInstitute(instituteId: number, ojectType: string, objectId: number ){
		this.url = this.hostname + `/institutes/${instituteId}/objects/${ojectType.toLocaleLowerCase()}/${objectId}`;
		return this.http.delete<ServerResponse>(this.url, { headers: this.authService.headers });
	}

	puCatToSync(instituteId	: number, categoryId: number|string){
		const url = `${this.hostname}/institutes/${instituteId}/categories/${categoryId}`;
		console.log(url);
		return this.http.put<ServerResponse>(url,null ,{ headers: this.authService.headers });
	}
	updateById(instituteId: number){
		const url = `${this.hostname}/institutes/${instituteId}/update`;
		return this.http.put<ServerResponse>(url,null ,{ headers: this.authService.headers });
	}


	//DELETE

	deleteNote(id : number){
		this.url = this.hostname + `/institutes/notices/${id}`;
		return this.http.delete<ServerResponse>(this.url, { headers: this.authService.headers });
	}
}
