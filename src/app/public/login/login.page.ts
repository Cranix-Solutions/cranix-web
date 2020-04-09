import { Component, OnInit, Testability } from '@angular/core';
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

    constructor(
        private authS: AuthenticationService,
        private formBuilder: FormBuilder,
        private systemS: SystemService,
    ) {
        this.instName = this.systemS.getInstituteName();
    }

    ngOnInit() {
        this.authForm = this.formBuilder.group({
            username: ['', Validators.compose([Validators.required])],
            password: ['', Validators.compose([Validators.required])]
        });
    }

    submit(user: any): void {
        if (this.authForm.valid) {
            this.authS.setUpSession(user,  this.instituteName);
        }
    }

    ngOnDestroy() {
    }
}
