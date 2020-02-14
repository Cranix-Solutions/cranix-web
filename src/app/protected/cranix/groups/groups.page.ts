import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { TranslateService } from '@ngx-translate/core';

//Own modules
import { GroupsService } from 'src/app/services/groups.service';
import { Group } from 'src/app/shared/models/data-model';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit {

  displayedColumns: string[] = ['select', 'name', 'description', 'groupType','actions'];
  dataSource: MatTableDataSource<Group>;
  selection = new SelectionModel<Group>(true, []);
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    groupS: GroupsService,
    public translateService: TranslateService
  ) {
    this.translateService.setDefaultLang('de');
    groupS.getGroups().subscribe(
      (res) => {
        this.dataSource = new MatTableDataSource<Group>(res)
      },
      (err) => { },
      () => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  ngOnInit() {
  }

public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  public redirectToMember= (group: Group) => {
    console.log("Details:" + group.name)
  }
  public redirectToEdit = (group: Group) => {
    console.log("Details:" + group.name)
  }
  public redirectToDelete = (group: Group)=> {
    console.log("Delete:" + group.name)
  }
}
