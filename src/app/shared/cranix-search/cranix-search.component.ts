import { Component, Input, OnInit, Output, EventEmitter, forwardRef } from '@angular/core';
import { GenericObjectService } from 'src/app/services/generic-object.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'cranix-search',
  templateUrl: './cranix-search.component.html',
  styleUrl: './cranix-search.component.css',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CranixSearchComponent),
    multi: true
  }]
})
export class CranixSearchComponent implements ControlValueAccessor, OnInit {
  isCranixSearchModalOpen: boolean = false;
  rowData = []
  selection: any|any[]

  @Output() callback = new EventEmitter<any>();
  @Input({ required: true }) objectType: string
  @Input() context
  @Input() items: any[]
  @Input() itemTextField: string
  @Input() multiple: boolean
  constructor(
    private objectService: GenericObjectService
  ) { }

  ngOnInit(): void {
    console.log("CranixSearchComponent")
    console.log(this.objectType)
    if (typeof this.items == "undefined") {
      console.log("items undefined")
      this.items = this.objectService.allObjects[this.objectType]
    }
    if (typeof this.multiple == "undefined") {
      console.log("multiple undefined")
      this.multiple = false;
    }
    if (typeof this.itemTextField == "undefined") {
      console.log("itemTextField undefined")
      this.itemTextField = "name";
    }
    if (this.multiple) {
      this.selection = []
    }
    this.rowData = this.items
  }

  private propagateOnChange = (_: any) => { };
  private propagateOnTouched = () => { };

  writeValue(value: any) {
    this.selection = value;
  }
  registerOnChange(method: any): void {
    this.propagateOnChange = method;
  }
  registerOnTouched(method: () => void) {
    this.propagateOnTouched = method;
  }
  clearSelection(){
    if(this.multiple){
      this.selection = []
    }else{
      this.selection = null
    }
    this.propagateOnChange(this.selection);
  }
  openModal() {
    console.log(this.openModal)
    this.isCranixSearchModalOpen = true
  }
  returnValues(){
    this.isCranixSearchModalOpen = false
    if(this.callback){
      this.callback.emit();
    }
  }
  closeModal(){
    this.isCranixSearchModalOpen = false
  }
  isSelected(id: number) {
    if (this.selection) {
      return this.selection.filter(o => o.id == id).length == 1
    }
    return false;
  }

  select(o: any) {
    this.selection = o;
    this.propagateOnChange(this.selection);
    console.log(this.selection)
  }

  doSelect(o: any) {
    if(this.selection.filter(obj => obj.id == o.id).length == 1){
      this.selection = this.selection.filter(obj => obj.id != o.id)
    } else {
      this.selection.push(o)
    }
    this.propagateOnChange(this.selection);
    console.log(this.selection)
  }
  onQuickFilterChanged() {
    let filter = (<HTMLInputElement>document.getElementById('crxSearchFilter')).value.toLowerCase();
    let tmp = []
    for (let o of this.items) {
      if (o[this.itemTextField].indexOf(filter) > -1) {
        tmp.push(o)
      }
    }
    this.rowData = tmp;
  }
}
