import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';



@Injectable({
    providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

    constructor(private storage: Storage, private alertCtrl: AlertController) { }

    // Intercepts all HTTP requests!
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let promise = this.storage.get('carnix-token');

        return from(promise)
            .pipe(token => {
                let clonedReq = this.addToken(request, token);
                return next.handle(clonedReq)

            });
    }

    // Adds the token to your headers if it exists
    private addToken(request: HttpRequest<any>, token: any) {
      //  console.log('request is', request);
      //  console.log('header keys', request.headers.keys);
      //  console.log('headers all', request.headers.getAll);
      //  console.log('header content-type', request.headers.get('content-type'))

        if (token) {
            let clone: HttpRequest<any>;
            let type = request.headers.get('content-type');
            let accept = request.headers.get('accept');
            if (!type && !accept){
                console.log('request is', clone)
                return request; 
            }else if (type) {
                clone = request.clone({
                    setHeaders: {
                        'Accept': accept,
                        'Content-Type': type,
                        Authorization: `${token}`
                    }
                });
                return clone;
            } else {
                clone = request.clone({
                    setHeaders: {
                        'Accept': accept,
                        Authorization: `${token}`
                    }
                });
                return clone;
            }

        }

        return request;
    }
}
