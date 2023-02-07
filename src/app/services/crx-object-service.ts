import { TeachingSubject } from 'src/app/shared/models/data-model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from './utils.service';
import { AuthenticationService } from './auth.service';
import { ServerResponse } from '../shared/models/server-models';
import { Storage } from '@ionic/storage-angular';

@Injectable()
export class CrxObjectService {
    selectedTeachingSubject: TeachingSubject;
    subjects: TeachingSubject[];
    hostname: string;

    constructor(
        private authService: AuthenticationService,
        private storage: Storage,
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
}