import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular'
import { AuthenticationService } from 'src/app/services/auth.service';
import { NoticesService } from 'src/app/services/notices.service';
import { CrxNotice } from '../models/data-model';
import { LanguageService } from 'src/app/services/language.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { CrxObjectService } from 'src/app/services/crx-object-service';
@Component({
    selector: 'cranix-notices',
    templateUrl: './cranix-notices.component.html',
    styleUrl: './cranix-notices.component.css'
})
export class CranixNoticesComponent implements OnInit {

    issue: string;
    isDisabled: boolean = false;
    isNoticeOpen: boolean = false;
    labels = {};
    notices: CrxNotice[] = []
    allNotices: CrxNotice[] = []
    selectedNotice: CrxNotice = new CrxNotice()
    selectedIssue: string = "";
    @Input() objectType: string
    @Input() selectedObject: any
    constructor(
        public authService: AuthenticationService,
        private languageS: LanguageService,
        private noticeService: NoticesService,
        private objectService: GenericObjectService,
        public crxObjectService: CrxObjectService,
        private modalController: ModalController,
        private alerController: AlertController,
    ) { }

    ngOnInit() {
        console.log("Constructor CranixNoticesComponent")
        console.log(this.objectType)
        console.log(this.selectedObject)
        this.readData()
    }

    readData() {
        let tmp = []
        let notice = new CrxNotice();
        notice.objectType = this.objectType
        notice.objectId = this.selectedObject.id
        this.noticeService.getByFilter(notice).subscribe(
            (val) => {
                for (let notice of val) {
                    console.log(notice)
                    if (notice.issueType == 'PTMEvent') {
                        this.labels[notice.id] = this.languageS.trans('PTM')
                    } else if (notice.issueType == 'subject') {
                        this.labels[notice.id] = this.crxObjectService.getSubjectById(notice.issueId).name
                    } else {
                        this.labels[notice.id] = this.languageS.trans('Notice')
                    }
                    this.allNotices.push(notice)
                    tmp.push(notice)
                }
                console.log(this.labels)
            }
        )
        this.notices = tmp;
    }

    openNotice(notice: CrxNotice) {
        if (notice) {
            this.selectedNotice = notice;
        } else {
            this.selectedNotice = new CrxNotice();
            this.selectedNotice.objectType = this.objectType
            this.selectedNotice.objectId = this.selectedObject.id
        }
        this.selectedIssue = this.selectedNotice.issueType + "#" + this.selectedNotice.issueId
        this.isNoticeOpen = true
    }

    saveNotice() {
        this.isDisabled = true;
        let tmp = this.selectedIssue.split("#")
        if (tmp.length == 2) {
            this.selectedNotice.issueType = tmp[0]
            this.selectedNotice.issueId = Number(tmp[1])
        }
        console.log(this.selectedNotice)
        this.noticeService.add(this.selectedNotice).subscribe(
            (val) => {
                this.objectService.responseMessage(val)
                if (val.code == "OK") {
                    this.readData()
                    this.isNoticeOpen = false;
                    this.isDisabled = false
                }
            }
        )
    }

    closeNotice() {
        this.isNoticeOpen = false;
        this.selectedNotice = new CrxNotice()
    }

    closeNotices() {
        this.modalController.dismiss()
    }

    async deleteNotice(notice: CrxNotice) {
        const alert = await this.alerController.create({
            header: this.languageS.trans('Confirm!'),
            subHeader: this.languageS.trans('Do you realy want to delete?'),
            message: notice.title,
            buttons: [
                {
                    text: this.languageS.trans('Cancel'),
                    role: 'cancel',
                }, {
                    text: 'OK',
                    handler: () => {
                        this.objectService.requestSent();
                        var a = this.noticeService.delete(notice.id).subscribe({
                            next: (val) => {
                                this.objectService.responseMessage(val);
                                this.readData()
                            },
                            error: (err) => {
                                this.objectService.errorMessage(this.languageS.trans("An error was accoured"));
                            },
                            complete: () => { a.unsubscribe() }
                        })
                    }
                }
            ]
        });
        await alert.present();
    }
}