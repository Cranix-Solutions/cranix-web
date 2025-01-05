import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
//Own modules
import { AuthenticationService } from 'src/app/services/auth.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { SystemService } from 'src/app/services/system.service';
import { LoginForm } from 'src/app/shared/models/server-models';



@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    instName: Observable<string>;
    instituteName: string = "";
    totp: boolean = false;
    totppin: string = "";
    user: LoginForm;

    constructor(
        public authService: AuthenticationService,
        private systemService: SystemService,
        private objectService: GenericObjectService,
    ) {}

    ngOnInit() {
        this.instName = this.systemService.getInstituteName();
        const params = new URL(window.location.href).searchParams
        if (params.has("token")) {
            this.authService.setupSessionByToken(params.get("token"), this.instituteName)
        } else {
            this.user = new LoginForm();
        }
    }

    login(): void {
        this.authService.setUpSession(this.user, this.instituteName);
    }

    checkPin() {
        let id: string = this.authService.crx2fa.split('#')[1]
        this.authService.checkTotPin(id, this.totppin);
    }

    sendPin() {
        let id: string = this.authService.crx2fa.split('#')[1]
        this.authService.sendPin(id).subscribe({
            next: (val) => { this.objectService.responseMessage(val) },
            error: (error) => { this.objectService.errorMessage(error) }
        })
    }

    ngOnDestroy() {
    }
}
