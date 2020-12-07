import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'cranix-setpassword',
  templateUrl: './setpassword.component.html',
  styleUrls: ['./setpassword.component.scss'],
})
export class SetpasswordComponent implements OnInit {

  @Input() type;

  setPassword = {
    mustChange: true,
    password: "",
    password2:""
  }

  constructor(
    public modalController: ModalController
  ) { 
    console.log('type is:', this.type);
  }

  ngOnInit() {}

  onSubmit() {
    this.modalController.dismiss(this.setPassword);
  }

}
