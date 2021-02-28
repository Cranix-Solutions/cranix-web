import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { UtilsService } from './utils.service';
import { Device, Hwconf, Announcenement, FAQ, Contact, Category } from 'src/app/shared/models/data-model';
import { ServerResponse } from 'src/app/shared/models/server-models';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from './auth.service';
import { GenericObjectService } from './generic-object.service';


export interface CloneCommand {
    deviceIds: number[],
    partitionIds: number[],
    multiCast: boolean,

}

@Injectable()
export class InformationsService {
   
    infoTypes: string[] = ['announcement','faq','contact']
    hostname: string;
    url:      string;
    categories:  Category[] = [];
    categoryIds: number[]   = [];
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
    getOwnedInfos(infoType: string) {
        this.url = `${this.hostname}/informations/my/${infoType}s`;
        return this.http.get<any[]>(this.url, { headers: this.authService.headers });
    }
    getCategories(){
        this.url = `${this.hostname}/informations/categories`
        this.http.get<Category[]>(this.url, { headers: this.authService.headers }).subscribe(
            (val) => {
                this.categories = val;
                for( let cat of val ) {
                    this.categoryIds.push(cat.id);
                }
            }
        )
    }

    getCategoryName(id: number){
        for(let category of this.categories) {
            if( category.id == id ) {
                return category.name;
            }
        }
        return "";
    }

    addInfo(infoType: any, info: any) {
        this.url = `${this.hostname}/informations/${infoType}s`;
        return this.http.post<ServerResponse>(this.url, info, { headers: this.authService.headers })
    }
}
