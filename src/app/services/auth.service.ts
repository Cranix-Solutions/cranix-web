import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { isDevMode } from '@angular/core';


//Own modules
import { UtilsService } from './utils.service';
import { UserResponse, LoginForm, Settings, ServerResponse, Crx2faSession } from 'src/app/shared/models/server-models';
import { LanguageService } from './language.service';
import { TeachingSubject } from '../shared/models/data-model';

@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {
    authenticationState = new BehaviorSubject(false);
    use2fa: boolean = false;
    crx2fa: string = "";
    selectedTeachingSubject: TeachingSubject
    hostname: string;
    url: string;
    //Token will be used only for CEPHALIX connections to overhand the CRANIX session
    token: string;
    session: UserResponse;
    headers: HttpHeaders;
    formHeaders: HttpHeaders;
    textHeaders: HttpHeaders;
    anyHeaders: HttpHeaders;
    longTimeHeader: HttpHeaders;
    settings: Settings = new Settings();
    requestedPath: string;
    minLgWidth = 769;
    minLgHeight = 600;
    //rowColors: string[] = ["#135d54", "#E2F3E5", "#AFC2B2"]
    rowColors: string[] = ["#D2E3D5", "#E2F3E5", "#AFC2B2"]
    need2fa: boolean = false
    pinFalse: boolean = false;
    passwrodFalse: boolean = false;
    anonHeaders = new HttpHeaders({
        'Content-Type': "application/json",
        'Accept': "application/json"
    });

    constructor(
        private http: HttpClient,
        private storage: Storage,
        private plt: Platform,
        private toastController: ToastController,
        private utilsS: UtilsService,
        private languageService: LanguageService,
        private router: Router
    ) {
        this.plt.ready().then(() => {
            this.checkSession();
        });
    }

    login(user: LoginForm) {
        console.log("auth.services.login called:", user)
        this.hostname = this.utilsS.hostName();
        this.url = this.hostname + "/sessions/create";
        return this.http.post<UserResponse>(this.url, user, { headers: this.anonHeaders });
    }

    loadSettings() {
        console.log(this.settings)
        this.readSelectedTeachingSubject()
        this.storage.get('myCranixSettings').then((myCranixSettings) => {
            if (myCranixSettings && myCranixSettings != "") {
                console.log("myCranixSettings");
                let myCranixSettingsHash = JSON.parse(myCranixSettings);
                console.log(myCranixSettingsHash);
                for (let key of Object.getOwnPropertyNames(this.settings)) {
                    if (myCranixSettingsHash.hasOwnProperty(key)) {
                        if (typeof this.settings[key] == "number") {
                            this.settings[key] = Number(myCranixSettingsHash[key]);
                        } else {
                            this.settings[key] = myCranixSettingsHash[key];
                        }
                    }
                }
                console.log(this.settings);
            }
        });
        this.languageService.setCustomLanguage();
    }

    readSelectedTeachingSubject() {
        this.storage.get('selectedTeachingSubject').then((val2) => {
            if (val2 && val2 != "") {
                this.selectedTeachingSubject = JSON.parse(val2)
            }
            console.log("readSelectedTeachingSubject:", this.selectedTeachingSubject)
        })
    }

    saveSelectedSubject() {
        this.storage.set('selectedTeachingSubject', JSON.stringify(this.selectedTeachingSubject))
    }

    setUpHeaders(){
        this.headers = new HttpHeaders({
            'Content-Type': "application/json",
            'Accept': "application/json",
            'Authorization': "Bearer " + this.session.token
        });
        this.formHeaders = new HttpHeaders({
            'Accept': "application/json",
            'Authorization': "Bearer " + this.session.token
        });
        this.anyHeaders = new HttpHeaders({
            'Accept': "*/*",
            'Authorization': "Bearer " + this.session.token
        });
        this.textHeaders = new HttpHeaders({
            'Accept': "text/plain",
            'Authorization': "Bearer " + this.session.token
        });
        this.longTimeHeader = new HttpHeaders({
            'Accept': "*/*",
            'Authorization': "Bearer " + this.session.token,
            'timeout': `${600000}`
        });
    }
    setupSessionByToken(token: string, instituteName: string){
        this.http.get<UserResponse>(this.hostname + "sessions/byToken/" + token).subscribe(
            (val) => {
                if(!val) {
                    //e
                } else {
                    this.session = val
                    this.session['instituteName'] = instituteName;
                    this.setUpHeaders();
                    this.loadSettings();
                    this.authenticationState.next(true);
                }
            }
        )
    }
    setUpSession(user: LoginForm, instituteName: string) {
        this.session = null;
        this.authenticationState.next(false);
        user.crx2faSessionId = this.utilsS.getCookie("crx2faSessionId");
        let subscription = this.login(user).subscribe({
            next: (val) => {
                console.log('login respons is', val);
                this.session = val;
                this.session['instituteName'] = instituteName;
                this.setUpHeaders();
                this.loadSettings();
                if (this.isAllowed("2fa.use")) {
                    if (this.session.crx2faSession) {
                        this.authenticationState.next(true);
                    } else if (this.session.crx2fas && this.session.crx2fas.length > 0) {
                        this.crx2fa = this.session.crx2fas[0];
                        this.use2fa = true;
                    } else {
                        this.session.mustSetup2fa = true;
                        this.session.acls = ["2fa.use"]
                        this.authenticationState.next(true);
                    }
                } else {
                    this.authenticationState.next(true);
                }
            },
            error: async (err) => {
                console.log('error is', err);
                // From ionic 7
                this.passwrodFalse = true;
                const toast = this.toastController.create({
                    position: "middle",
                    message: 'Passwort falsch!',
                    color: "danger",
                    duration: 3000
                });
                (await toast).present();

            },
            complete: () => {
                subscription.unsubscribe();
                console.log("login call completed" + this.session.role);
            }
        });
    }

    sendPin(id: string) {
        let url = this.hostname + `/2fas/sendpin`;
        let headers = new HttpHeaders({
            'Content-Type': "application/json",
            'Accept': "application/json"
        });
        let data = { crx2faId: id, token: this.session.token }
        console.log("sendPin", data);
        return this.http.post<ServerResponse>(url, data, { headers: headers })
    }

    checkTotPin(id: string, otPin: string) {
        let url = this.hostname + `/2fas/checkpin`;
        let headers = new HttpHeaders({
            'Content-Type': "application/json",
            'Accept': "application/json"
        });
        let data = { crx2faId: id, pin: otPin, token: this.session.token }
        this.http.post<Crx2faSession>(url, data, { headers: headers }).subscribe({
            next: (val) => {
                this.utilsS.setCookie("crx2faSessionId",val.id.toString(),val.validHours)
                console.log(val)
                this.authenticationState.next(true)
            },
            error: async (err) => {
                // ionic 7
                this.pinFalse = true;
                const toast = this.toastController.create({
                    position: "middle",
                    message: 'Pin falsch!',
                    color: "danger",
                    duration: 3000
                });
                (await toast).present();
            }
        })
    }

    public loadSession() {
        console.log('loadSession', sessionStorage.getItem('shortName'))
        this.hostname = this.utilsS.hostName();
        let url = this.hostname + `/sessions`;
        console.log(url);
        this.headers = new HttpHeaders({
            'Content-Type': "application/json",
            'Accept': "application/json",
            'Authorization': "Bearer " + this.token
        });
        this.formHeaders = new HttpHeaders({
            'Accept': "application/json",
            'Authorization': "Bearer " + this.token
        });
        this.textHeaders = new HttpHeaders({
            'Accept': "text/plain",
            'Authorization': "Bearer " + this.token
        });
        let sub = this.http.get(url, { headers: this.headers }).subscribe({
            next: (val) => {
                console.log("loadSession");
                console.log(val);
                this.session = <UserResponse>val;
                this.session['instituteName'] = sessionStorage.getItem('instituteName');
                console.log(this.session);
                this.loadSettings();
                this.authenticationState.next(true);
            },
            error: (err) => { console.log(err) },
            complete: () => { sub.unsubscribe() }
        });
    }

    public logout() {
        if (!sessionStorage.getItem('shortName')) {
            console.log('logout', this.session.token)
            this.http.delete(this.hostname + `/sessions/${this.session.token}`, { headers: this.headers }).subscribe({
                next: (val) => {
                    this.authenticationState.next(false);
                    this.router.navigate(['/'])
                },
                error: (err) => { this.router.navigate(['/']) },
                complete: () => { this.router.navigate(['/']) }
            });
        }
        this.authenticationState.next(false);
        this.session = null;
        this.use2fa = false;
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
            if (this.session.acls.indexOf(acl) > -1) {
                return true;
            }
        }
        return false
    }

    public isAllowed(acl: string) {
        if (!this.session || !this.session.acls) {
            return false
        }
        return (this.session.acls.indexOf(acl) > -1);
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
            //TODO may be it can be configured
            case "/pages/cranix/informations": { return this.isAllowed('permitall') }
            case "/pages/cranix/hwconfs": { return this.isAllowed('hwconf.manage') }
            case "/pages/cranix/rooms": { return this.isAllowed('room.manage') }
            case "/pages/cranix/rooms/all": { return this.isAllowed('room.manage') }
            case "/pages/cranix/users": { return this.isAllowed('user.manage') }
            case "/pages/cranix/users/all": { return this.isAllowed('user.manage') }
            case "/pages/cranix/system": { return this.isAllowed('system.status') }
            case "/pages/cranix/softwares": { return this.isAllowed('software.manage') }
            case "/pages/cranix/security": { return this.isOneOfAllowed(['system.firewall', 'system.proxy']) }
            //TODO education.challenges
            case "/pages/edu/lessons": { return this.isAllowed('permitall') }
            case "/pages/edu/lessons/tests": { return this.isAllowed('permitall') }
            case "/pages/edu/lessons/challenges": { return this.isAllowed('challenge.manage') }
            case "/pages/edu/lessons/roomcontrol": { return this.isAllowed('education.rooms') }
            case "/pages/cranix/profile": { return this.isOneOfAllowed(['permitall','2fa.use']) }
            case "/pages/cranix/profile/myself": { return this.isAllowed('permitall') }
            case "/pages/cranix/profile/mydevice": { return this.isAllowed('permitall') }
            case "/pages/cranix/profile/crx2fa": { return this.isAllowed('2fa.use') }
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
            // TODO
            case "/pages/cranix/calendar": { return true }
        }
        return false;
    }

    public log(arg1, ...args) {
        if (this.settings.debug || isDevMode()) {
            console.log(arguments)
        }
    }

    public isMD() {
        return window.innerWidth < this.minLgWidth || window.innerHeight < this.minLgHeight;
    }

    public getSize() {
        return window.innerWidth + "x" + window.innerHeight
    }

    async showInfo() {
        const toast = this.toastController.create({
            position: "middle",
            message: 'Copyright 2024 Helmuth and Peter Varkoly, Nuremberg Germany<br>' +
                'VERSION-PLACE-HOLDER',
            color: "success",
            duration: 5000
        });
        (await toast).present();
    }
}
