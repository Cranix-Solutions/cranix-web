import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/auth.service';

@Component({
  selector: 'cranix-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {

  roomName: string ="";
  commonName: string="";
  instituteName: string = "";
  constructor( authService: AuthenticationService ) {
    this.commonName = authService.session.commonName;
    this.roomName = authService.session.roomName;
    this.instituteName = authService.session.instituteName;
   }

  ngOnInit() {}

}
