import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/shared/models/data-model';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'cranix-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  displayedColumns: string[] = ['id', 'uid', 'surName', 'givenName', 'role'];
  dataSource:  MatTableDataSource<User> ;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
     userS: UsersService,
     public translateService: TranslateService
  ) {
    userS.getUsers().subscribe((res) => {
      this.dataSource = new MatTableDataSource<User>(res)
    },
    (err) => { },
    () => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngOnInit() {
  }

}
