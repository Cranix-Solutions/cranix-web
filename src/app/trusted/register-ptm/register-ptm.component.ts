import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/auth.service';
import { ParentsService } from 'src/app/services/parents.service';
import { ParentTeacherMeeting, User } from 'src/app/shared/models/data-model';

@Component({
  selector: 'app-register-ptm',
  templateUrl: './register-ptm.component.html',
  styleUrl: './register-ptm.component.css'
})
export class RegisterPTMComponent implements OnInit {
  id: number
  selectedPTM: ParentTeacherMeeting
  student: User

  constructor(
    private route: ActivatedRoute,
    private parentService: ParentsService,
    private authService: AuthenticationService
  ) {
  }

  ngOnInit() {
    this.student = this.authService.session.user;
    this.id = this.route.snapshot.params['id'];
    console.log(this.id)
    this.parentService.getPTMById(this.id).subscribe(
      (val) => {
        this.selectedPTM = val
        console.log(this.selectedPTM)
      }
    )
  }

}
