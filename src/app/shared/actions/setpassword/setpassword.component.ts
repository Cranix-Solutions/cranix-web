import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'cranix-setpassword',
  templateUrl: './setpassword.component.html',
  styleUrls: ['./setpassword.component.scss'],
})
export class SetpasswordComponent implements OnInit {

  setPassword = {
    mustChange: true,
    password: "",
    password2:""
  }

  constructor(
    public modalController: ModalController
  ) { }

  ngOnInit() {}

  onSubmit(val) {
    console.log(val);
    this.modalController.dismiss(val);
  }

}
