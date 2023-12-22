import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
//Own modules
import { AuthenticationService } from 'src/app/services/auth.service';
import { SystemService } from 'src/app/services/system.service';



@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    instName: Observable<string>;
    instituteName: string = "";
    showPassword: boolean = false;
    user = { username: "", password : ""}
    totpPin: string;

    constructor(
        public  authService: AuthenticationService,
        private systemService: SystemService,
    ) {
        this.instName = this.systemService.getInstituteName();
    }

    ngOnInit() {
        this.user = { username: "", password : ""}
        this.totpPin = ""
    }

    submit(): void {
        if(this.authService.isAllowed('crx2fa.use')) {

        } else {
            this.authService.setUpSession(this.user,  this.instituteName);
        }
    }

    ngOnDestroy() {
        this.ngOnInit()
    }
}
