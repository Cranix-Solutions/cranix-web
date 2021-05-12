import { Component, OnInit } from '@angular/core';
import { ToastController, ModalController } from '@ionic/angular';
//own stuff
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { LanguageService } from 'src/app/services/language.service';
import { DevicesService } from 'src/app/services/devices.service';
import { Printer, Device } from 'src/app/shared/models/data-model'

@Component({
  selector: 'cranix-device-printers',
  templateUrl: './device-printers.component.html',
  styleUrls: ['./device-printers.component.scss'],
})
export class DevicePrintersComponent implements OnInit {
  noPrinter: Printer = new Printer();
  allDefaultPrinters: Printer[] = [this.noPrinter];
  allPrinters: Printer[] = [];
  device: Device;
  printers = {
    defaultPrinter: null,
    availablePrinters: []
  }
  disabled = false

  constructor(
    private deviceService: DevicesService,
    private languageS: LanguageService,
    public objectService: GenericObjectService,
    public modalCtrl: ModalController
  ) {

  }

  ngOnInit() {
    this.device = <Device>this.objectService.selectedObject;
    this.noPrinter.id = 0;
    this.noPrinter.name = this.languageS.trans("No default  printer");
    this.printers.defaultPrinter = this.noPrinter;
    this.objectService.getObjects('printer').subscribe(
      (obj) => {
        this.allPrinters = obj;
        this.allDefaultPrinters = this.allDefaultPrinters.concat(obj);
        this.deviceService.getAvailablePrinter(this.device.id).subscribe(
          (val) => {
            for (let printer of val) {
              this.printers.availablePrinters.push(printer);
            }
            this.deviceService.getDefaultPrinter(this.device.id).subscribe(
              (val) => {
                if (val) {
                  this.printers.defaultPrinter = val;
                }
              }
            )
          }
        )
      });
  }
  compareFn(o1: Printer, o2: Printer | Printer[]) {
    if (!o1 || !o2) {
      return o1 === o2;
    }
    if (Array.isArray(o2)) {
      return o2.some((u: Printer) => u.id === o1.id);
    }
    return o1.id === o2.id;
  }
  setPrinters() {
    this.disabled = true;
    let printers = {
      defaultPrinter: [this.printers.defaultPrinter.id],
      availablePrinters: this.printers.availablePrinters.map(a => a.id)
    };
    console.log(printers)
    let sub = this.deviceService.setPrinters(this.device.id, printers).subscribe(
      async (val) => {
        this.objectService.responseMessage(val);
        this.modalCtrl.dismiss();
      },
      async (error) => {
        this.objectService.errorMessage(error);
      },
      () => {
        this.disabled = false;
        sub.unsubscribe();
      }
    )
  }
}
