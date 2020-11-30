import { Component, OnInit, Input } from '@angular/core';
import { SoftwareService } from 'src/app/services/softwares.service';
import { AuthenticationService } from 'src/app/services/auth.service';
import { License, Software } from 'src/app/shared/models/data-model';
import { ModalController } from '@ionic/angular';
import { GenericObjectService } from 'src/app/services/generic-object.service';

@Component({
  selector: 'cranix-software-licenses',
  templateUrl: './software-licenses.component.html',
  styleUrls: ['./software-licenses.component.scss'],
})
export class SoftwareLicensesComponent implements OnInit {

  licenses: License[];
  licenseType: string = "C";
  value: string;
  count: number;
  file: File;
  files = {};
  @Input() software: Software;
  constructor(
    public authService: AuthenticationService,
    public modalController: ModalController,
    public objectService: GenericObjectService,
    public softwareService: SoftwareService
  ) { }

  ngOnInit() {
    let subs = this.softwareService.getSoftwareLicense(this.software.id).subscribe(
      (val) => { this.licenses = val },
      (err) => { console.log(err) },
      () => { subs.unsubscribe() }
    )
  }

  onFilesAdded(files: FileList) {
    this.file = files.item(0);
  }
  onFilesChanged(files: FileList, id: number) {
    this.files[id] = files.item(0);
  }
  addLicense() {
    let formData: FormData = new FormData();
    if (this.file) {
      formData.append('file', this.file, this.file.name);
    }
    formData.append('licenseType', this.licenseType);
    formData.append('count', this.count.toString());
    if (this.value) {
      formData.append('value', this.value);
    }
    let sub = this.softwareService.addSoftwareLicense(this.software.id, formData).subscribe(
      (val) => {
        this.objectService.responseMessage(val);
        if (val.code == "OK") {
          this.modalController.dismiss()
        }
      },
      (err) => {
        this.objectService.errorMessage(err)
      },
      () => { sub.unsubscribe() }
    )
  }

  deleteLicense(license: License) {
    let sub = this.softwareService.deleteSoftwareLicense(license.id).subscribe(
      (val) => {
        this.objectService.responseMessage(val);
        this.ngOnInit();
      },
      (err) => { this.objectService.errorMessage(err) },
      () => { sub.unsubscribe() }
    )
  }

  modifyLicense(license: License) {
    console.log(license)
    let formData: FormData = new FormData();
    if (this.files[license.id]) {
      formData.append('file', this.files[license.id], this.files[license.id].name);
    }
    formData.append('licenseType', license.licenseType);
    formData.append('count', license.count.toString());
    formData.append('value', license.value);
    let sub = this.softwareService.modifySoftwareLicense(license.id, formData).subscribe(
      (val) => {
        this.objectService.responseMessage(val);
        if (val.code == "OK") {
          this.modalController.dismiss()
        }
      },
      (err) => {
        this.objectService.errorMessage(err)
      },
      () => { sub.unsubscribe() }
    )
  }

}
