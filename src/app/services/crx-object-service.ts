import { CrxConfig, TeachingSubject } from 'src/app/shared/models/data-model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from './utils.service';
import { AuthenticationService } from './auth.service';
import { ServerResponse } from '../shared/models/server-models';

@Injectable()
export class CrxObjectService {
    subjects: TeachingSubject[];
    hostname: string;

    constructor(
        private authService: AuthenticationService,
        private http: HttpClient,
        private utils: UtilsService,
    ) {
        this.hostname = this.utils.hostName();
    }

    getSubjects() {
        console.log('CrxObjectService getSubjects called')
        let url = this.hostname + "/objects/subjects"
        this.http.get<TeachingSubject[]>(url, { headers: this.authService.headers }).subscribe(
            (val1) => {
                this.subjects = val1
                console.log(val1)
            }
        )
    }

    addSubject(subject: TeachingSubject) {
        let url = this.hostname + "/objects/subjects"
        return this.http.post<ServerResponse>(url, subject, { headers: this.authService.headers })
    }

    modifySubject(subject: TeachingSubject) {
        let url = this.hostname + "/objects/subjects"
        return this.http.patch<ServerResponse>(url, subject, { headers: this.authService.headers })
    }

    getSubjectById(id: number){
        for(let object of this.subjects){
            if(object.id = id){
                return object
            }
        }
    }

    /*
    * Manage CrxConfig and CrxConfig objects.
    * Boths will be represented by CrxConfig class.
    * The only differnce is that CrxConfigs can deliver more values for one key.
    */
    addConfig(config: CrxConfig) {
        let url = this.hostname + "/objects/config"
        return this.http.post<ServerResponse>(url, config, { headers: this.authService.headers })
    }
    addMConfig(config: CrxConfig) {
        let url = this.hostname + "/objects/mconfig"
        return this.http.post<ServerResponse>(url, config, { headers: this.authService.headers })
    }
    deleteConfig(config: CrxConfig) {
        let url = this.hostname + "/objects/config/" + config.id
        return this.http.delete<ServerResponse>(url, { headers: this.authService.headers })
    }
    deleteMConfig(config: CrxConfig) {
        let url = this.hostname + "/objects/mconfig" + config.id
        return this.http.delete<ServerResponse>(url, { headers: this.authService.headers })
    }
    getConfig(type: string, id: number, key: string){
        let url = this.hostname + `/objects/config/${type}/${id}/${key}`
        return this.http.get<CrxConfig>(url, { headers: this.authService.headers })
    }
    getMConfig(type: string, id: number, key: string){
        let url = this.hostname + `/objects/mconfig/${type}/${id}/${key}`
        return this.http.get<CrxConfig[]>(url, { headers: this.authService.headers })
    }
}