import { ICellRendererAngularComp } from "ag-grid-angular";
import { Component, OnDestroy } from '@angular/core';
import { ToastController } from '@ionic/angular';
//Own Stuff
import { CephalixService } from 'src/app/services/cephalix.service';
import { WindowRef } from 'src/app/shared/models/ohters'

@Component({
    selector: 'uuid-cell',
    template: `<div class="uuid-flex">
    <ion-button fill="clear" size="small" (click)="details($event)" matTooltip="{{'modify' | translate }}">
        <ion-icon name="build-sharp"></ion-icon>
    </ion-button>
    <ion-button fill="clear" size="small" (click)="openAction($event)" matTooltip="{{'Apply actions on the selected objects' | translate }}">
        <ion-icon  name="ellipsis-vertical-sharp"></ion-icon>
    </ion-button>
    <ion-button *ngIf="data.ipVPN && data.ipVN != ''" color="secondary" fill="clear" size="small"  (click)="routeSchool($event)" matTooltip="{{'Connect the institute in a separate window.' | translate }}">
        <ion-icon name="create-outline" style="height:15px;width:15px"></ion-icon>
    </ion-button>
    </div>
    `
})
export class InstituteActionCellRenderer implements ICellRendererAngularComp, OnDestroy {
    public params: any;
    public data: any;
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
        this.data = params.data;
    }

    public details(event) {
        event.stopPropagation();
        this.params.context.componentParent.redirectToEdit(this.data);
    }
    public openAction(event) {
        event.stopPropagation();
        this.params.context.componentParent.openActions(event, this.data.id)
    }
    public routeSchool(event) {
        event.stopPropagation();
        var hostname = window.location.hostname;
        var protocol = window.location.protocol;
        var port = window.location.port;
        let sub = this.cephS.getInstituteToken(this.data.id)
            .subscribe(
                async (res) => {
                    this.token = res;
                    console.log("Get token from:" + this.data.uuid)
                    console.log(res);
                    if (!res) {
                        const toast = this.toastController.create({
                            position: "middle",
                            message: 'Can not connect  to "' + this.data.name + '"',
                            color: "danger",
                            duration: 3000
                        });
                        (await toast).present();
                    } else {
                        sessionStorage.setItem('shortName', this.data.uuid);
                        sessionStorage.setItem('instituteName', this.data.name);
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
