import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'src/app/shared/models/data-model';
import { SelfManagementService } from 'src/app/services/selfmanagement.service';
import { takeWhile } from 'rxjs/internal/operators/takeWhile';
import { TranslateService } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular';
import { SetpasswordComponent } from 'src/app/shared/actions/setpassword/setpassword.component';
import { GenericObjectService } from 'src/app/services/generic-object.service';

@Component({
  selector: 'cranix-myself',
  templateUrl: './myself.component.html',
  styleUrls: ['./myself.component.scss'],
})
export class MyselfComponent implements OnInit, OnDestroy {

  alive: boolean = true;
  mySelf: User;

  constructor(private mySelfs: SelfManagementService,
    public translateService: TranslateService,
    public objectService: GenericObjectService,
    public modalController: ModalController,
  ) {
    this.mySelfs.getMySelf()
      .pipe(takeWhile(() => this.alive))
      .subscribe((res) => {
        console.log('I am: ', res);
        this.mySelf = res;
      })
  }

  ngOnInit() {
  }

  async openChangePW() {
    const modal = await this.modalController.create({
      component: SetpasswordComponent,
      cssClass: 'small-modal',
      animated: true,
      swipeToClose: true,
      showBackdrop: true,
      componentProps: {
        'type': 'ownChange',
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.objectService.requestSent();
        this.mySelf.password = dataReturned.data.password;
        console.log('user after mod:', this.mySelf);
        this.mySelfs.modMySelf(this.mySelf)
          .pipe(takeWhile(() => this.alive))
          .subscribe((res) => {
            console.log('response is:', res);
            this.objectService.responseMessage(res)
          }, (err) => {
            this.objectService.errorMessage(err);
          })
      }
    });
    return await modal.present();
  }
  ngOnDestroy() {
    this.alive = false;
  }

}
