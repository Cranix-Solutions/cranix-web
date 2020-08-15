import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

//Own modules
import { AuthenticationService } from 'src/app/services/auth.service';
import { SystemService } from 'src/app/services/system.service';



@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    authForm: FormGroup;
    instName: Observable<string>;
    instituteName: string = "";
    allowSavePassword: boolean = false;

    constructor(
        private authService: AuthenticationService,
        private formBuilder: FormBuilder,
        private systemService: SystemService,
    ) {
        this.instName = this.systemService.getInstituteName();
        //TODO read allowSavePassword from server
    }

    ngOnInit() {
        this.authForm = this.formBuilder.group({
            username: ['', Validators.compose([Validators.required])],
            password: ['', Validators.compose([Validators.required])]
        });
    }

    submit(user: any): void {
        if (this.authForm.valid) {
            this.authService.setUpSession(user,  this.instituteName);
        }
        console.log("settings");
        console.log(this.authService.settings);
    }

    ngOnDestroy() {
    }
}
