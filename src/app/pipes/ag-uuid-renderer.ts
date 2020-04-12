import { ICellRendererAngularComp } from "ag-grid-angular";
import { Injectable, Component, OnDestroy } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
//Own Stuff
import { CephalixService } from 'src/app/services/cephalix.service';

@Injectable()
export class WindowRef {
    constructor() { }

    getNativeWindow() {
        return window;
    }
}
@Component({
    selector: 'uuid-cell',
    template: `<ion-button color="secondary" fill="clear" size="small"  (click)="routeSchool()" matTooltip="{{'Connect the institute in a separate window.' | translate }}">
    <ion-icon name="create-outline" style="height:15px;width:15px"></ion-icon>{{params.data.uuid }}
</ion-button>`
})
export class InstituteUUIDCellRenderer implements ICellRendererAngularComp, OnDestroy {
    public params: any;
    nativeWindow: any

    alive: boolean = true;
    id: number;
    pw: string;
    token: string;
    constructor(
        private win: WindowRef,
        private cephS: CephalixService,
        private toastController: ToastController) {
        this.nativeWindow = win.getNativeWindow();
    }
    // called on init
    agInit(params: any): void {
        this.params = params;
    }

    // called when the cell is refreshed
    public routeSchool() {
        var hostname = window.location.hostname;
        var protocol = window.location.protocol;
        var port = window.location.port;
        let sub = this.cephS.getInstituteToken(this.params.data.id)
            .subscribe(
                async (res) => {
                    this.token = res;
                    console.log("Get token from:" + this.params.data.uuid )
                    console.log(res);
                    if (!res) {
                        const toast = this.toastController.create({
                            position: "middle",
                            message: 'Can not connect  to "' + this.params.data.name + '"',
                            color: "danger",
                            duration: 3000
                        });
                        (await toast).present();
                    } else {
                        sessionStorage.setItem('shortName', this.params.data.uuid);
                        sessionStorage.setItem('institueName', this.params.data.name);
                        sessionStorage.setItem('cephalix_token', this.token);
                        if (port) {
                            this.nativeWindow.open(`${protocol}//${hostname}:${port}`);
                            sessionStorage.removeItem('shortName');
                        } else {
                            this.nativeWindow.open(`${protocol}//${hostname}`);
                            sessionStorage.removeItem('shortName');
                        }
                    }
                },
                (err) => { console.log(err) },
                () => { sub.unsubscribe() }
            )
    }
    refresh(params: any): boolean {
        return true;
    }

    ngOnDestroy() {
        sessionStorage.removeItem('cephalix_token');
        this.alive = false;
    }
}
