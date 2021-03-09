import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UtilsService } from './utils.service';
import { Category, TaskResponse } from 'src/app/shared/models/data-model';
import { ServerResponse } from 'src/app/shared/models/server-models';
import { AuthenticationService } from './auth.service';
import { GenericObjectService } from './generic-object.service';


export interface CloneCommand {
    deviceIds: number[],
    partitionIds: number[],
    multiCast: boolean,

}

@Injectable()
export class InformationsService {

    infoTypes: string[] = ['announcement', 'task', 'faq', 'contact']
    hostname: string;
    url: string;
    categories: Category[] = [];
    categoryIds: number[] = [];
    constructor(
        private utilsS: UtilsService,
        private http: HttpClient,
        private authService: AuthenticationService,
        private objectService: GenericObjectService
    ) {
        this.hostname = this.utilsS.hostName();
    }

    getInfos(infoType: string) {
        this.url = `${this.hostname}/informations/${infoType}s`;
        console.log(this.url)
        return this.http.get<any[]>(this.url, { headers: this.authService.headers });
    }

    getInfo(infoType: string, id: number) {
        this.url = `${this.hostname}/informations/${infoType}s/${id}`;
        console.log(this.url)
        return this.http.get<any>(this.url, { headers: this.authService.headers });
    }
    getOwnedInfos(infoType: string) {
        this.url = `${this.hostname}/informations/my/${infoType}s`;
        console.log(this.url)
        return this.http.get<any[]>(this.url, { headers: this.authService.headers });
    }
    getCategories() {
        this.url = `${this.hostname}/informations/categories`
        this.http.get<Category[]>(this.url, { headers: this.authService.headers }).subscribe(
            (val) => {
                this.categories  = val;
                this.categoryIds = [];
                for (let cat of val) {
                    this.categoryIds.push(cat.id);
                }
            }
        )
    }

    getCategoryName(id: number) {
        for (let category of this.categories) {
            if (category.id == id) {
                return category.name;
            }
        }
        return "";
    }

    addInfo(infoType: any, info: any) {
        this.url = `${this.hostname}/informations/${infoType}s`;
        console.log(this.url)
        return this.http.post<ServerResponse>(this.url, info, { headers: this.authService.headers })
    }

    
    modifyInfo(infoType: any, info: any) {
        this.url = `${this.hostname}/informations/${infoType}s/${info.id}`;
        console.log(this.url)
        return this.http.patch<ServerResponse>(this.url, info, { headers: this.authService.headers })
    }

    setHaveSeen(infoType: any, id: number){
        this.url = `${this.hostname}/informations/${infoType}s/${id}/seen`;
        this.http.put<ServerResponse>(this.url, null, { headers: this.authService.headers }).subscribe(
            (val) => {
                this.objectService.responseMessage(val);
            },
            (error) => {
                console.log(error)
            }
        )
    }

    getMyResponses(){
        this.url = `${this.hostname}/selfmanagement/taskResponses`;
        console.log(this.url)
        return this.http.get<any[]>(this.url,{ headers: this.authService.headers })
    }

    getResponses(taskId: number){
        this.url = `${this.hostname}/informations/tasks/${taskId}/responses`;
        console.log(this.url)
        return this.http.get<TaskResponse[]>(this.url,{ headers: this.authService.headers })
    }

    rateTaskResponse(taskResponse){
        this.url = `${this.hostname}/informations/taskResponses`;
        console.log(this.url)
        return this.http.post<ServerResponse>(this.url,taskResponse, { headers: this.authService.headers })
    }

    addResponse(task){
        this.url = `${this.hostname}/selfmanagement/taskResponses`;
        console.log(this.url)
        return this.http.post<ServerResponse>(this.url,task, { headers: this.authService.headers })
    }

    modifyResponse(task){
        this.url = `${this.hostname}/selfmanagement/taskResponses`;
        console.log(this.url)
        return this.http.patch<ServerResponse>(this.url,task, { headers: this.authService.headers })
    }

}
