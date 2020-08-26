import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { isDevMode } from '@angular/core';


//Own modules
import { UtilsService } from './utils.service';
import { UserResponse, LoginForm, Settings } from 'src/app/shared/models/server-models';

@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {
    authenticationState = new BehaviorSubject(false);
    hostname: string;
    url: string;
    token: string;
    session: UserResponse;
    settings: Settings = new Settings();

    constructor(
        private http: HttpClient,
        private storage: Storage,
        private plt: Platform,
        private toastController: ToastController,
        private utilsS: UtilsService,
        private router: Router
    ) {
        this.plt.ready().then(() => {
            this.checkSession();
        });
    }

    login(user: LoginForm) {
        console.log("auth.services.login called:")
        this.hostname = this.utilsS.hostName();
        this.url = this.hostname + "/sessions/create";
        const headers = new HttpHeaders({
            'Content-Type': "application/json",
            'Accept': "application/json"
        });
        return this.http.post<UserResponse>(this.url, user, { headers: headers });
    }

    setUpSession(user: LoginForm, instituteName: string) {
        this.session = null;
        this.authenticationState.next(false);
        let subscription = this.login(user).subscribe(
            (val) => {
                // Load settings from the local storage
                this.storage.get('myCranixSettings').then((myCranixSettings) => {
                    if (myCranixSettings && myCranixSettings != "") {
                        console.log("myCranixSettings");
                        console.log(myCranixSettings);
                        let myCranixSettingsHash = JSON.parse(myCranixSettings);
                        console.log(myCranixSettingsHash);
                        for (let key in Object.getOwnPropertyNames(this.settings)) {
                            if (myCranixSettingsHash.hasOwnProperty(key)) {
                                this.settings[key] = myCranixSettingsHash[key];
                            }
                        }
                    }
                });
                console.log('login respons is', val);
                this.session = val;
                this.session['instituteName'] = instituteName;
                this.session['roomId'] = val.roomId;
                this.session['roomName'] = val.roomName;
                this.authenticationState.next(true);
            },
            async (err) => {
                console.log('error is', err);
                if (err.status === 401) {
                    const toast = this.toastController.create({
                        position: "middle",
                        message: 'Passwort falsch!',
                        color: "danger",
                        duration: 3000
                    });
                    (await toast).present();
                }
            },
            () => {
                subscription.unsubscribe();
                console.log("login call completed" + this.session.role);
            }
        );
    }

    public loadSession() {
        this.hostname = this.utilsS.hostName();
        let url = this.hostname + `/sessions`;
        console.log(url);
        let headers = new HttpHeaders({
            'Content-Type': "application/json",
            'Accept': "application/json",
            'Authorization': "Bearer " + this.token
        });
        let sub = this.http.get<UserResponse>(url, { headers: headers }).subscribe(
            (val) => {
                console.log("loadSession");
                this.session = val;
                this.session['instituteName'] = sessionStorage.getItem('instituteName');
                console.log(this.session);
                this.authenticationState.next(true);
            },
            (err) => { console.log(err) },
            () => { sub.unsubscribe() }
        );
    }

    public logout() {
        this.authenticationState.next(false);
        this.session = null;
        this.router.navigate(['/']);
    }

    public isAuthenticated() {
        return this.authenticationState.value;
    }

    /**
     * Check if the session was created.
     */
    public checkSession() {
        if (this.session) {
            this.authenticationState.next(true);
        } else {
            this.authenticationState.next(false);
        }
    }
    /**
     * Delivers the token of the session.
     */
    public getToken() {
        if (this.session) {
            return this.session.token;
        }
        return null;
    }

    /**
     * Delivers the wohle session array.
     */
    public getSession() {
        return this.session;
    }
    /**
     * Delivers the list of the acls assigned to the user
     * @returns The list of the owned acl
     */
    public getMyAcls() {
        if (this.session) {
            return this.session.acls;
        }
        return null;
    }
    /**
     *
     * @param acls Checks if some acls are allowed for the user.
     * @return True or false
     */
    public isOneOfAllowed(acls: string[]) {
        for (let acl of acls) {
            if (acl == 'permitall') {
                return true;
            }
            if (this.session.acls.indexOf(acl) > 0) {
                return true;
            }
        }
        return false
    }

    public isAllowed(acl: string) {
        if (acl == 'permitall') {
            return true;
        }
        return (this.session.acls.indexOf(acl) > 0);
    }

    /**
     * Checks if a route is allowed for the session user
     * @param route The route to check
     * @returns True or false
     */
    public isRouteAllowed(route: string) {
        switch (route) {
            case "/pages/cephalix/customers": { return this.isAllowed('customer.manage') }
            case "/pages/cephalix/institutes": { return this.isAllowed('cephalix.manage') }
            case "/pages/cephalix/institutes/all": { return this.isAllowed('cephalix.manage') }
            case "/pages/cephalix/tickets": { return this.isAllowed('cephalix.ticket') }
            case "/pages/cranix/devices": { return this.isAllowed('device.manage') }
            case "/pages/cranix/devices/all": { return this.isAllowed('device.manage') }
            case "/pages/cranix/groups": { return this.isAllowed('group.manage') }
            case "/pages/cranix/hwconfs": { return this.isAllowed('hwconf.manage') }
            case "/pages/cranix/rooms": { return this.isAllowed('room.manage') }
            case "/pages/cranix/rooms/all": { return this.isAllowed('room.manage') }
            case "/pages/cranix/users": { return this.isAllowed('user.manage') }
            case "/pages/cranix/users/all": { return this.isAllowed('user.manage') }
            case "/pages/cranix/system": { return this.isAllowed('system.status') }
            case "/pages/cranix/softwares": { return this.isAllowed('software.manage') }
            case "/pages/cranix/security": { return this.isOneOfAllowed(['system.firewall', 'system.proxy']) }
            case "/pages/edu/lessons/roomcontrol": { return this.isAllowed('education.rooms') }
            case "/pages/cranix/profile": { return this.isAllowed('permitall') }
            case "/pages/cranix/profile/myself": { return this.isAllowed('permitall') }
            case "/pages/cranix/mygroups": { return this.isAllowed('education.groups') }
            case "/pages/cranix/myusers": { return this.isAllowed('education.users') }
            case "institutes/:id": { return this.isAllowed('cephalix.modify') }
            case "customers/:id": { return this.isAllowed('customer.modify') }
            case "tickets/:id": { return this.isAllowed('cephalix.ticket') }
            case "devices/:id": { return this.isAllowed('device.modify') }
            case "groups/:id": { return this.isAllowed('group.modify') }
            case "hwconfs/:id": { return this.isAllowed('hwconf.modify') }
            case "rooms/:id": { return this.isAllowed('room.modify') }
            case "users/:id": { return this.isAllowed('user.modify') }
        }
        return false;
    }

    public log(arg1, ...args) {
        if (this.settings.debug || isDevMode()) {
            console.log(arguments)
        }
    }
}

