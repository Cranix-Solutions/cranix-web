import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GenericObjectService } from 'src/app/services/generic-object.service';

@Component({
  selector: 'cranix-set-validity',
  templateUrl: './set-validity.component.html',
  styleUrls: ['./set-validity.component.scss'],
})
export class SetValidityComponent implements OnInit {

  institute = {
    "id" : 0,
    "validity" : new Date()
  }
  inactive = false
  @Input() objectIds;
  constructor(
    public modalController: ModalController,
    public objectService: GenericObjectService
  ) { }

  ngOnInit() {}

  async onSubmit() {
    this.inactive = true
    for( let id of this.objectIds ) {
      this.institute.id = id;
      this.objectService.modifyObject(this.institute,'institute').subscribe(
        (val) => { this.objectService.responseMessage(val) }
      )
    }
    await new Promise(f => setTimeout(f, 4000));
    this.objectService.getAllObject('institute')
    this.modalController.dismiss()
  }
}
