import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
//Own modules
import { AuthenticationService } from 'src/app/services/auth.service';
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
    allowSavePassword: boolean = true;
    showPassword: boolean = false;
    totp: boolean = false;
    totppin: string = "";
    user: LoginForm;

    constructor(
        public  authService: AuthenticationService,
        private systemService: SystemService,
    ) {
        this.instName = this.systemService.getInstituteName();
    }

    ngOnInit() {
        this.user = new LoginForm();
    }

    login(): void {
        this.authService.setUpSession(this.user,  this.instituteName);
    }

    checkpin() {
        
    }

    ngOnDestroy() {
    }
}
