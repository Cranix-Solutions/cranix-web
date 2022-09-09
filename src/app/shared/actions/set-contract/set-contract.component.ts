import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CephalixService } from 'src/app/services/cephalix.service';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { CephalixCare, contracts } from 'src/app/shared/models/cephalix-data-model';

@Component({
  selector: 'cranix-set-contract',
  templateUrl: './set-contract.component.html',
  styleUrls: ['./set-contract.component.scss'],
})
export class SetContractComponent implements OnInit {

  myContracts: string[] = contracts;
  care: CephalixCare = new CephalixCare()
  @Input() objectIds;
  constructor(
    private cephalixService: CephalixService,
    public modalController: ModalController,
    public objectService: GenericObjectService
  ) { 

  }

  ngOnInit() {}

  onSubmit() {
    for( let id of this.objectIds ) {
      this.care.cephalixInstituteId = id;
      this.cephalixService.setCare(id, this.care)
    }
    this.modalController.dismiss()
  }
}
