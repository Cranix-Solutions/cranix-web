import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router, RouteReuseStrategy } from '@angular/router';

//Own modules
import { UtilsService } from './utils.service';
import { UserResponse,LoginForm } from 'src/app/shared/models/server-models';

@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {
    authenticationState = new BehaviorSubject(false);
    hostname: string;
    url: string;
    token: string;
    session: UserResponse;
    subscription: any;

    constructor(
        private http: HttpClient,
        private storage: Storage,
        private plt: Platform,
        private toastController: ToastController,
        private utils: UtilsService,
        private router: Router 
        ) {
        this.plt.ready().then(() => {
            this.checkSession();
        });
    }

    login(user: LoginForm) {
        console.log("auth.services.login called:")
        this.hostname = this.utils.hostName();
        this.url = this.hostname + "/sessions/create";
        const headers = new HttpHeaders({
            'Content-Type': "application/json",
            'Accept': "application/json"
        });
        return this.http.post<UserResponse>(this.url, user, { headers: headers });
    }

    setUpSession(user: LoginForm) {
        this.session = null;
        this.authenticationState.next(false);
        this.subscription = this.login(user)
            .subscribe(
                (val) => {
                    console.log('login respons is', val);
                    this.session = val;
                    this.authenticationState.next(true);
               },
               async (err) => {
                console.log('error is', err);
                if (err.status === 401) {
                    const toast = this.toastController.create({
                        position: "middle",
                        message: 'Passwort falsch!',
                        cssClass: "bar-assertive",
                        duration: 3000
                    });
                    (await toast).present(); 
                }
                }, () => {
                    console.log("login call completed" + this.session.role);
                  /*  if(this.session.mac) {
                        this.router.navigate(['register']);
                    } else if(this.session.role == 'sysadmins') {
                        this.router.navigate(['users']);
                    } else {
                        this.router.navigate(['myself']);
                    }*/
                }
            );
    }

    logout() {
        this.authenticationState.next(false);
        this.session = null;
        this.router.navigate(['/']);
    }

    isAuthenticated() {
        return this.authenticationState.value;
    }

    /**
     * Check if the session was created. 
     */
    checkSession() {
        if(this.session) {
            this.authenticationState.next(true);
        } else {
            this.authenticationState.next(false);
        }
    }
    /**
     * Delivers the token of the session.
     */
    getToken() {
        if( this.session ) {
            return this.session.token;
        }
        return null;
    }

    /**
     * Delivers the wohle session array.
     */
    getSession(){
        return this.session;
    }
    /**
     * Delivers the list of the acls assigned to the user
     * @returns The list of the owned acl
     */
    getMyAcls() {
        if( this.session ) {
            return this.session.acls;
        }
        return null;
    }
    /**
     * 
     * @param acls Checks if some acls are allowed for the user.
     * @return True or false
     */
    isAllowed(acls) {
        for(let acl of acls){
            if(acl == 'permitall'){
                return true;
            }
            if(this.session.acls.indexOf(acl) > 0) {
                return true;
            }
        }
        false
    }
}

