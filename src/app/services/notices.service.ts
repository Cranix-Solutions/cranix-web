import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilsService } from './utils.service';
import { AuthenticationService } from './auth.service';
import { CrxNotice } from '../shared/models/data-model';
import { ServerResponse } from '../shared/models/server-models';

@Injectable({
    providedIn: 'root'
})

export class NoticesService {

    url: string
    constructor(
        private  authService: AuthenticationService,
		private http: HttpClient,
        private utilsService: UtilsService
    ){
        this.url = this.utilsService.hostName() + "/crxNotices"
    }

    add(notice: CrxNotice){
        if(notice.id == 0) {
            return this.http.post<ServerResponse>(this.url, notice, { headers:  this.authService.headers  });
        } else {
            return this.http.patch<ServerResponse>(this.url, notice, { headers:  this.authService.headers  });
        }
    }

    get(){
        return this.http.get<CrxNotice[]>(this.url, { headers:  this.authService.headers  });
    }

    getByFilter(notice: CrxNotice){
        return this.http.post<CrxNotice[]>(this.url +"/filter", notice, { headers:  this.authService.headers  });
    }


    getById(id: number){
        return this.http.get<CrxNotice>(this.url + `/${id}`, { headers:  this.authService.headers  });
    }

    delete(id: number){
        return this.http.delete<ServerResponse>(this.url + `/${id}`, { headers:  this.authService.headers  });
    }

    patch(notice: CrxNotice){
        return this.http.patch<ServerResponse>(this.url, notice, { headers:  this.authService.headers  });
    }
}