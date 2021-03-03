import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UtilsService } from './utils.service';
import { Category } from 'src/app/shared/models/data-model';
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
        return this.http.get<any[]>(this.url, { headers: this.authService.headers });
    }

    getInfo(infoType: string, id: number) {
        this.url = `${this.hostname}/informations/${infoType}s/${id}`;
        return this.http.get<any>(this.url, { headers: this.authService.headers });
    }
    getOwnedInfos(infoType: string) {
        this.url = `${this.hostname}/informations/my/${infoType}s`;
        return this.http.get<any[]>(this.url, { headers: this.authService.headers });
    }
    getCategories() {
        this.url = `${this.hostname}/informations/categories`
        this.http.get<Category[]>(this.url, { headers: this.authService.headers }).subscribe(
            (val) => {
                this.categories = val;
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
        return this.http.post<ServerResponse>(this.url, info, { headers: this.authService.headers })
    }

    setHaveSeen(infoType: any, id: number){
        this.url = `${this.hostname}/informations/${infoType}s/seen`;
        this.http.put<ServerResponse>(this.url, null, { headers: this.authService.headers }).subscribe(
            (val) => {
                this.objectService.responseMessage(val);
            },
            (error) => {
                console.log(error)
            }
        )
    }
}
