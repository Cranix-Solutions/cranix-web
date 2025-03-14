import { Component, OnInit, OnDestroy } from '@angular/core';
import { IdRequest, User } from 'src/app/shared/models/data-model';
import { SelfManagementService } from 'src/app/services/selfmanagement.service';
import { takeWhile } from 'rxjs/internal/operators/takeWhile';
import { TranslateService } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular';
import { SetpasswordComponent } from 'src/app/shared/actions/setpassword/setpassword.component';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { AuthenticationService } from 'src/app/services/auth.service';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
@Component({
  selector: 'cranix-myself',
  templateUrl: './myself.component.html',
  styleUrls: ['./myself.component.scss'],
})
export class MyselfComponent implements OnInit, OnDestroy {

  alive: boolean = true;
  mySelf: User;
  myIdRequest: IdRequest = new IdRequest();
  idRequestUse: boolean = false;
  picture;
  files = []

  constructor(
    private mySelfs: SelfManagementService,
    public translateService: TranslateService,
    public objectService: GenericObjectService,
    public modalController: ModalController,
    public authService: AuthenticationService
  ) {
    if(this.authService.isAllowed('idrequest.use')) {
      this.mySelfs.getMyIdRequest().subscribe(
        (val) => {
          this.idRequestUse = true;
          if(val) {
            this.myIdRequest = val
            this.picture = "data:image/jpg;base64," + val.picture;
          } else {
            this.myIdRequest = new IdRequest();
            this.picture = "data:image/jpg;base64," + this.myIdRequest.picture;
          }
        }
      )
    }
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
            if( res.code == "OK") {
              this.authService.session.mustChange = false;
            }
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

  takePhoto() {
    Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      width: 320,
      quality: 60
    }).then((photo) => {
      this.myIdRequest.picture = photo.base64String;
      this.picture = "data:image/jpg;base64," + photo.base64String
      console.log(photo.dataUrl)
      this.mySelfs.addEditIdRequest(this.myIdRequest).subscribe(
        (val) => { this.objectService.responseMessage(val)}
      )
    })
  }

  findPhoto() {
    Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
      width: 320,
      quality: 60
    }).then((photo) => {
      this.myIdRequest.picture = photo.base64String;
      this.picture = "data:image/jpg;base64," + photo.base64String
      this.mySelfs.addEditIdRequest(this.myIdRequest).subscribe(
        (val) => { this.objectService.responseMessage(val)}
      )
    })
  }

  uploadImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.myIdRequest.picture = e.target.result;
        this.mySelfs.addEditIdRequest(this.myIdRequest).subscribe(
          (val) => { this.objectService.responseMessage(val)}
        )
      };
      reader.onerror = (error) => {
        console.error('Fehler beim Lesen der Datei', error);
      };
      reader.readAsDataURL(file);
    }
  }
}
