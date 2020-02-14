import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';


import {CephalixService} from 'src/app/services/cephalix.service';
import { Institute } from 'src/app/shared/models/cephalix-data-model';

@Component({
  selector: 'cranix-institutes',
  templateUrl: './institutes.page.html',
  styleUrls: ['./institutes.page.scss'],
})
export class InstitutesPage implements OnInit {

  displayedColumns: string[] = ['id', 'uuid', 'name', 'locality','ipVPN', 'regCode'];
  dataSource:  MatTableDataSource<Institute> ;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    cephalixS: CephalixService,
    public translateService: TranslateService
  ) {
   // this.translateService.setDefaultLang('de');
   console.log('Trans in institutes', this.translateService.translations);
    cephalixS.getAllInstitutes().subscribe(
      (res) => {
      this.dataSource = new MatTableDataSource<Institute>(res)
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
