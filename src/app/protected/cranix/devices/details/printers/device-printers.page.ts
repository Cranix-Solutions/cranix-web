import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastController } from '@ionic/angular';
//own stuff
import { GenericObjectService } from '../../../../../services/generic-object.service';
import { LanguageService } from '../../../../../services/language.service';
import { DevicesService } from '../../../../../services/devices.service';
import { Printer, Device } from '../../../../../shared/models/data-model'
import { ServerResponse } from '../../../../../shared/models/server-models';

@Component({
  selector: 'cranix-group-members',
  templateUrl: './device-printers.page.html',
  styleUrls: ['./device-printers.page.scss'],
})
export class DevicePrintersPage implements OnInit {
  editPrinter;
  noPrinter: Printer = new Printer;
  allDefaultPrinters: Printer[] = [this.noPrinter];
  allPrinters: Printer[] = [];
  device: Device;
  printers = {
    defaultPrinter: 0,
    availablePrinters: []
  }

  constructor(
    private deviceService: DevicesService,
    private languageS: LanguageService,
    public formBuilder: FormBuilder,
    public objectService: GenericObjectService,
    private toastController: ToastController
  ) {
    this.device = <Device>this.objectService.selectedObject;
    this.noPrinter.id=0;
    this.noPrinter.name= languageS.trans("No default  printer");
  }

  ngOnInit() {
    this.objectService.getObjects('printer').subscribe(
      (obj) => {
        this.allPrinters = obj;
        this.allDefaultPrinters = this.allDefaultPrinters.concat(obj);
      });
      this.readPrinters();
      console.log("printers");
      console.log(this.printers);
      this.editPrinter = this.formBuilder.group(this.printers);
  }

  readPrinters() {
    let subM = this.deviceService.getAvailablePrinter(this.device.id).subscribe(
      (val) => {
        for (let printer of val) {
          this.printers.availablePrinters.push(printer.id);
        }
      },
      (err) => { console.log(err) },
      () => { subM.unsubscribe() });
    let subNM = this.deviceService.getDefaultPrinter(this.device.id).subscribe(
      (val) => {
        if (val) {
          this.printers.defaultPrinter = val.id;
        }
      },
      (err) => { console.log(err) },
      () => { subNM.unsubscribe() })
  }

  compareFn(a: number, b): boolean {
    console.log(a,b);
    return a == b;
  }
  onSubmit(form) {
    this.editPrinter.disable();
    let serverResponse: ServerResponse;
    let printers = {
      defaultPrinter: [form.defaultPrinter],
      availablePrinters: form.availablePrinters
    };
    console.log(form);
    console.log(printers)
    let sub = this.deviceService.setPrinters(this.device.id, printers).subscribe(
      async (val) => {
        serverResponse = val;
        if (serverResponse.code == "OK") {
          const toast = this.toastController.create({
            position: "middle",
            header: this.languageS.trans("Success:"),
            message: this.languageS.trans(serverResponse.value),
            color: "success",
            duration: 5000
          });
          (await toast).present();
        } else {
          const toast = this.toastController.create({
            position: "middle",
            header: this.languageS.trans("An Error was accoured:"),
            message: serverResponse.value,
            color: "warning",
            duration: 6000
          });
          (await toast).present();
        }
      },
      async (error) => {
        const toast = this.toastController.create({
          position: "middle",
          header: this.languageS.trans("An Error was accoured:"),
          message: error,
          color: "warning",
          duration: 6000
        });
        (await toast).present();
        console.log(error);
      },
      () => {
        sub.unsubscribe();
      }
    )
    this.editPrinter.enable();
  }
}
