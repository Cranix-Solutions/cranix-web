import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParentsService } from 'src/app/services/parents.service';
import { ParentTeacherMeeting } from 'src/app/shared/models/data-model';

@Component({
  selector: 'app-register-ptm',
  templateUrl: './register-ptm.component.html',
  styleUrl: './register-ptm.component.css'
})
export class RegisterPTMComponent implements OnInit {
  id: number
  selectedPTM: ParentTeacherMeeting

  constructor(
    private route: ActivatedRoute,
    private parentService: ParentsService
  ){
  }

  ngOnInit(){
    this.id = this.route.snapshot.params['id'];
    this.parentService.getPTMById(this.id).subscribe(
      (val) => { this.selectedPTM = val}
    )
  }

}
