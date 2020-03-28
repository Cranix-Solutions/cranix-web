import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
//own stuff
import { GenericObjectService } from '../../../../../services/generic-object.service';
import { LanguageService } from '../../../../../services/language.service';
import { DevicesService } from '../../../../../services/devices.service';
import { Printer, Device } from '../../../../../shared/models/data-model'

@Component({
  selector: 'cranix-group-members',
  templateUrl: './device-printers.page.html',
  styleUrls: ['./device-printers.page.scss'],
})
export class DevicePrintersPage implements OnInit {
  editPrinter;
  noPrinter: Printer = new Printer;
  allPrinters: Printer[] = [this.noPrinter];
  availablePrinters: Printer[] = [];
  availablePrintersId: number[] = [];
  defaultPrinterId: number;
  device: Device;

  constructor(
    private objectService: GenericObjectService,
    private languageS: LanguageService,
    public formBuilder: FormBuilder,
    private deviceService: DevicesService
  ) {
    this.device = <Device>this.objectService.selectedObject;
  }

  ngOnInit() {
    this.readPrinters();
    this.editPrinter = this.formBuilder.group({
      "defaultPrinter": this.defaultPrinterId,
      "availablePrinters": this.availablePrintersId
    });
  }

  readPrinters() {
    let subM = this.deviceService.getAvaiPrinter(this.device.id).subscribe(
      (val) => { this.availablePrinters = val; console.log(val) },
      (err) => { console.log(err) },
      () => { subM.unsubscribe() });
    let subNM = this.deviceService.getDefPrinter(this.device.id).subscribe(
      (val) => {
        if (val) {
          this.defaultPrinterId = val.id
        }
      },
      (err) => { console.log(err) },
      () => { subNM.unsubscribe() })
    this.objectService.getObjects('printer').subscribe(obj => this.allPrinters = obj);
    for (let printer of this.availablePrinters) {
      this.availablePrintersId.push(printer.id);
    }
  }

  defaultChanged(ev: Event) {
    console.log(ev);
  }

  availableChanged(ev: Event) {
    console.log(ev);
  }

  onSubmit(form) {
    for( let i of this.availablePrintersId ){
      this.deviceService.deleteAvaiPrinter(this.device.id,i);  
    }
    for( let i of form.availablePrinters ){
      this.deviceService.putAvaiPrinter(this.device.id,i);  
    }
    this.deviceService.putDefPrinter(this.device.id,form.defaultPrinter);
  }
}
