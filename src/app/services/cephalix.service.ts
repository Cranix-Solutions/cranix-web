import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UtilsService } from './utils.service';
import { Observable } from 'rxjs/internal/Observable';

import { Institute, Ticket, Article, Notice, CephalixCare, SynchronizedObject, DynDns, Repository } from 'src/app/shared/models/cephalix-data-model';
import { ServerResponse, CrxActionMap } from 'src/app/shared/models/server-models';
import { AuthenticationService } from './auth.service';
import { InstituteStatus } from 'src/app/shared/models/cephalix-data-model';
import { User } from '../shared/models/data-model';
import { GenericObjectService } from './generic-object.service';


export interface InstallSetSync {
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
	loadingStatus: boolean = false;

	constructor(
		private utilsS: UtilsService,
		private http: HttpClient,
		private authService: AuthenticationService,
		private objectService: GenericObjectService) {
		this.hostname = this.utilsS.hostName();
		if (!authService.isAllowed('customer.manage')) {
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
	reloadStatusOfInstitutes() {
		this.url = this.hostname + `/institutes/refreshStatus`;
		console.log(this.url);
		this.objectService.requestSent()
		this.loadingStatus = true;
		this.http.put<ServerResponse>(this.url, null, { headers: this.authService.longTimeHeader }).subscribe({
			next: (val) => { this.objectService.responseMessage(val); this.loadingStatus = false; },
			error: (err) => { this.objectService.errorMessage('Timeout Error'); this.loadingStatus = false; },
			complete: () => { this.loadingStatus = false; }
		});
	}
	writeConfig(instituteId: number) {
		const url = `${this.hostname}/institutes/${instituteId}/writeConfig`;
		return this.http.put<ServerResponse>(url, null, { headers: this.authService.headers }).subscribe(
			(serverResponse) => {
				this.objectService.responseMessage(serverResponse);
			}
		);
	}
	getNextDefaults() {
		this.url = this.hostname + `/institutes/nextDefaults`;
		console.log(this.url);
		return this.http.get<Institute>(this.url, { headers: this.authService.headers });
	}
	getDefaults() {
		this.url = this.hostname + `/institutes/defaults`;
		console.log(this.url);
		return this.http.get<Institute>(this.url, { headers: this.authService.headers });
	}
	getObjectsToSynchronize() {
		this.url = this.hostname + `/institutes/objects`;
		console.log(this.url);
		return this.http.get<SynchronizedObject[]>(this.url, { headers: this.authService.headers });
	}
	getSynchronizedObjects(instituteId: number) {
		this.url = this.hostname + `/institutes/${instituteId}/sync`;
		console.log(this.url);
		return this.http.get<SynchronizedObject[]>(this.url, { headers: this.authService.headers });
	}
	stopSynching(mappingId: number, direction: string) {
		this.url = this.hostname + `/institutes/syncing/${mappingId}/${direction}`;
		console.log(this.url);
		return this.http.delete<ServerResponse>(this.url, { headers: this.authService.headers })
	}
	getObjectsFromInstitute(instituteId: number, objectType: string) {
		this.url = this.hostname + `/institutes/${instituteId}/objects/${objectType}`;
		return this.http.get<any[]>(this.url, { headers: this.authService.headers });
	}
	getTicketById(id: number): Observable<Ticket> {
		this.url = this.hostname + `/tickets/${id}`;
		console.log(this.url);
		return this.http.get<Ticket>(this.url, { headers: this.authService.headers });
	};

	modifyTicket(ticket: Ticket) {
		this.url = this.hostname + `/tickets`;
		console.log(this.url);
		return this.http.patch<ServerResponse>(this.url, ticket, { headers: this.authService.headers });
	};

	getArticklesOfTicket(ticketId: number): Observable<Article[]> {
		this.url = this.hostname + '/tickets/' + ticketId + '/articles';
		console.log(this.url);
		return this.http.get<Article[]>(this.url, { headers: this.authService.headers });
	};

	addArticleToTicket(article: Article, ticketId: number) {
		this.url = this.hostname + '/tickets/' + ticketId + '/articles';
		console.log(this.url);
		return this.http.post<ServerResponse>(this.url, article, { headers: this.authService.headers });
	}

	setInstituteForTicket(ticketId: number, instituteId: number) {
		this.url = this.hostname + `/tickets/${ticketId}/institutes/${instituteId}`;
		console.log(this.url);
		return this.http.put<ServerResponse>(this.url, null, { headers: this.authService.headers });
	}
	getInstituteTypes(): Observable<string[]> {
		this.url = this.hostname + `/system/enumerates/institutetype`;
		console.log(this.url);
		return this.http.get<string[]>(this.url, { headers: this.authService.headers });
	}

	getCategorieTypes() {
		this.url = this.hostname + `/institutes/sync`;
		console.log(this.url);
		return this.http.get<string[]>(this.url, { headers: this.authService.headers });
	}

	getInstituteById(id: number) {
		this.url = this.hostname + `/institutes/${id}`;
		console.log(this.url);
		return this.http.get<Institute>(this.url, { headers: this.authService.headers });
	}

	getAyTemplates() {
		this.url = this.hostname + `/institutes/ayTemplates`;
		console.log(this.url);
		return this.http.get<string[]>(this.url, { headers: this.authService.headers });
	}

	addNoticeToInst(id: number, note: Notice) {
		this.url = this.hostname + `/institutes/${id}/notices`;
		return this.http.post<ServerResponse>(this.url, note, { headers: this.authService.headers });
	}
	getNoticesOfInst(id: number) {
		this.url = this.hostname + `/institutes/${id}/notices`;
		console.log(this.url);
		return this.http.get<Notice[]>(this.url, { headers: this.authService.headers });
	}
	deleteNotice(id: number) {
		this.url = this.hostname + `/institutes/notices/${id}`;
		console.log(this.url);
		return this.http.delete<ServerResponse>(this.url, { headers: this.authService.headers });
	}

	applyAction(actionMap: CrxActionMap) {
		this.url = this.hostname + `/institutes/applyAction`;
		console.log(this.url);
		return this.http.post<ServerResponse>(this.url, actionMap, { headers: this.authService.headers });
	}

	syncFileToInstitutes(fd: FormData) {
		this.url = this.hostname + `/institutes/copyFile`;
		return this.http.post<ServerResponse>(this.url, fd, { headers: this.authService.headers });
	}

	getHWconfFromInstitute(instituteId: number, hwconfid: number, hwconf) {
		this.url = this.hostname + `/institutes/${instituteId}/objects/hwconf/${hwconfid}`;
		return this.http.post<ServerResponse>(this.url, hwconf, { headers: this.authService.headers });
	}
	syncHWconfFromInstitute(instituteId: number, mapping) {
		this.url = this.hostname + `/institutes/${instituteId}/objects/hwconf`;
		return this.http.post<ServerResponse>(this.url, mapping, { headers: this.authService.headers });
	}
	//PUT
	putInstallSetToSync(instituteId: number, categoryId: number) {
		const url = `${this.hostname}/institutes/${instituteId}/categories/${categoryId}`;
		return this.http.put<ServerResponse>(url, null, { headers: this.authService.headers });
	}

	putObjectToInstitute(instituteId: number, objectType: string, objectId: number | string) {
		const url = `${this.hostname}/institutes/${instituteId}/sync/${objectType.toLocaleLowerCase()}/${objectId}`;
		console.log(url);
		return this.http.put<ServerResponse>(url, null, { headers: this.authService.headers });
	}

	deleteObjectFromInstitute(instituteId: number, ojectType: string, objectId: number) {
		this.url = this.hostname + `/institutes/${instituteId}/sync/${ojectType.toLocaleLowerCase()}/${objectId}`;
		return this.http.delete<ServerResponse>(this.url, { headers: this.authService.headers });
	}

	puCatToSync(instituteId: number, categoryId: number | string) {
		const url = `${this.hostname}/institutes/${instituteId}/categories/${categoryId}`;
		console.log(url);
		return this.http.put<ServerResponse>(url, null, { headers: this.authService.headers });
	}

	updateById(instituteId: number) {
		const url = `${this.hostname}/institutes/${instituteId}/update`;
		return this.http.put<ServerResponse>(url, null, { headers: this.authService.headers });
	}

	addUserToInstitute(userId, instituteId: number) {
		this.url = this.hostname + `/institutes/${instituteId}/users/${userId}`;
		console.log(this.url)
		return this.http.put<ServerResponse>(this.url, null, { headers: this.authService.headers }).subscribe(
			val => this.objectService.responseMessage(val)
		);
	}

	setSeenOnArticle(articleId: number) {
		this.url = this.hostname + `/tickets/articles/${articleId}`;
		console.log(this.url)
		return this.http.put<ServerResponse>(this.url, null, { headers: this.authService.headers });
	}

	deleteArticle(articleId: number) {
		this.url = this.hostname + `/tickets/articles/${articleId}`;
		console.log(this.url)
		return this.http.delete<ServerResponse>(this.url, { headers: this.authService.headers });
	}

	deleteUserFromInstitute(userId, instituteId: number) {
		this.url = this.hostname + `/institutes/${instituteId}/users/${userId}`;
		console.log(this.url)
		return this.http.delete<ServerResponse>(this.url, { headers: this.authService.headers }).subscribe(
			val => this.objectService.responseMessage(val)
		);
	}
	getUsersFromInstitute(instituteId: number) {
		this.url = this.hostname + `/institutes/${instituteId}/users`;
		return this.http.get<User[]>(this.url, { headers: this.authService.headers });
	}
	getInstitutesFromUser(userId: number) {
		this.url = this.hostname + `/institutes/users/${userId}`;
		return this.http.get<Institute[]>(this.url, { headers: this.authService.headers });
	}

	getDynDns(instituteId: number) {
		this.url = this.hostname + `/institutes/${instituteId}/dyndns`
		return this.http.get<DynDns>(this.url, { headers: this.authService.headers });
	}

	setDynDns(instituteId: number, dyndns: DynDns) {
		this.url = this.hostname + `/institutes/${instituteId}/dyndns`
		return this.http.post<ServerResponse>(this.url, dyndns, { headers: this.authService.headers }).subscribe(
			(val) => { this.objectService.responseMessage(val) }
		);
	}

	getCare(instituteId: number) {
		this.url = this.hostname + `/institutes/${instituteId}/care`
		return this.http.get<CephalixCare>(this.url, { headers: this.authService.headers });
	}

	setCare(instituteId: number, cephalixCare: CephalixCare) {
		this.url = this.hostname + `/institutes/${instituteId}/care`
		return this.http.post<ServerResponse>(this.url, cephalixCare, { headers: this.authService.headers }).subscribe(
			(val) => { this.objectService.responseMessage(val) }
		);
	}


	/**
	 * AddOn handling
	 */
	getAllAddons() {
		this.url = this.hostname + `/institutes/addons`
		return this.http.get<Repository[]>(this.url, { headers: this.authService.headers });
	}

	getAddonsOfInstitute(instituteId: number) {
		this.url = this.hostname + `/institutes/${instituteId}/addons`
		return this.http.get<Repository[]>(this.url, { headers: this.authService.headers });
	}

	addAddonToInstitute(instituteId: number, addonId: number) {
		this.url = this.hostname + `/institutes/${instituteId}/addons/${addonId}`
		this.http.put<ServerResponse>(this.url, null, { headers: this.authService.headers }).subscribe(
			(val) => { this.objectService.responseMessage(val) }
		)
	}
	removeAddonFromInstitute(instituteId: number, addonId: number) {
		this.url = this.hostname + `/institutes/${instituteId}/addons/${addonId}`
		this.http.delete<ServerResponse>(this.url, { headers: this.authService.headers }).subscribe(
			(val) => { this.objectService.responseMessage(val) }
		)
	}
	/*
	* Customer calls
	*/
	addInstituteToCustomer(instituteId: number, customerId: number) {
		this.url = this.hostname + `/customers/${customerId}/institutes/${instituteId}`
		this.http.put<ServerResponse>(this.url, null, { headers: this.authService.headers }).subscribe(
			(val) => { this.objectService.responseMessage(val) }
		)
	}

	deleteInstituteFromCustomer(instituteId: number, customerId: number) {
		this.url = this.hostname + `/customers/${customerId}/institutes/${instituteId}`
		this.http.delete<ServerResponse>(this.url, { headers: this.authService.headers }).subscribe(
			(val) => { this.objectService.responseMessage(val) }
		)
	}
}
