import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { MatDialogRef } from '@angular/material/dialog';
import {SelectionModel} from '@angular/cdk/collections';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-get-users',
  templateUrl: './get-users.component.html',
  styleUrls: ['./get-users.component.css']
})
export class GetUsersComponent implements OnInit,AfterViewInit {
  selectionAmount: number;
  name: any;
  description: any;
  webRef: any;
  count: any;
  selectionId: any = {
   
    id: null,
    
    
  };
  id: any;
  searchText: any;
  nameSort: any = true;
  DescSort: any = true;
  webRefSort: any = true;



  constructor(private http: HttpClient, private dialogRef: MatDialogRef<GetUsersComponent>) { }

  ngOnInit() {

   this.getUsers();

  }

  ngAfterViewInit(): void {
    this.getUsers();
  }
  displayedColumns: string[] = ['select','name', 'description', 'webReference'];
  dataSource :any;
  selection = new SelectionModel<GetUsersComponent>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;


  getUsers(){
    this.http.get('http://localhost:3000/data').subscribe((data:any) => {

     this.dataSource = new MatTableDataSource<GetUsersComponent>(data);
     this.dataSource.paginator = this.paginator

    })
  }

  addUser(){
    
    console.log("id:"+this.count+":: Name: "+this.name+":: Description: "+this.description+":: WEB Ref: "+this.webRef)
    if(this.name && this.description && this.webRef){
      
      this.http.post('http://localhost:3000/data',{"id":this.count,"name": this.name,"description": this.description, "webReference": this.webRef}).subscribe((data:any) => {
        alert("Data added successfully")
        this.name="";
        this.description="";
        this.webRef=""
      this.getUsers();
      })
      return;
    }
    
    if(this.name == "" || this.name == undefined){
      alert("Name is required, Please fill the name field")
    }
    if(this.description == "" || this.description==undefined)
      alert("Description is required, Please fill the description field")
    if(this.webRef == "" || this.webRef==undefined)
      alert("Web Reference is required, Please fill the Web Reference field")
  }

  deleteUser(){
    console.log("Delete::"+this.selection.selected.length);

    if(this.selection.selected[0] == undefined || this.selection.selected.length != 1){
      alert("Please Select Single row to delete ")

      return;
    }
    this.http.delete('http://localhost:3000/data/'+this.selection.selected[0].id).subscribe((data:any) => {

      alert(this.selection.selected[0].id+" deleted Successfully")
      this.getUsers();
    })
  }

  closeDialog() { this.dialogRef.close({ event: 'close' }); }


   /** Whether the number of selected elements matches the total number of rows. */
   isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.paginator.pageSize;
    this.selectionId = this.selection.selected
    return numSelected;
  }

  selectRows() {
    for (let index = 0; index < this.dataSource.paginator.pageSize; index++) {
      this.selection.select(this.dataSource.data[index]);
      console.log(this.selection);
      this.selectionAmount = this.selection.selected.length;
    }
  }

  search(){
    console.log(this.searchText)

    if (this.searchText) {
      return this.http
        .get(`http://localhost:3000/data?name_like=${this.searchText.trim()}`).subscribe((data:any) => {

          this.dataSource = new MatTableDataSource<GetUsersComponent>(data);
          this.dataSource.paginator = this.paginator
        })
    }else{
      this.getUsers();
    }
  }

  sortByName(){
    if(this.nameSort){
      this.http.get(`http://localhost:3000/data?_sort=name&_order=desc`).subscribe((data:any) => {
      this.dataSource = new MatTableDataSource<GetUsersComponent>(data);
          this.dataSource.paginator = this.paginator
          this.nameSort = false;
     })
    }else{
      this.http.get(`http://localhost:3000/data?_sort=name&_order=asc`).subscribe((data:any) => {
        this.dataSource = new MatTableDataSource<GetUsersComponent>(data);
            this.dataSource.paginator = this.paginator
            this.nameSort = true;
       })
    }
  }

  sortByDesc(){
    if(this.DescSort){
      this.http.get(`http://localhost:3000/data?_sort=description&_order=desc`).subscribe((data:any) => {
      this.dataSource = new MatTableDataSource<GetUsersComponent>(data);
          this.dataSource.paginator = this.paginator
          this.DescSort = false;
     })
    }else{
      this.http.get(`http://localhost:3000/data?_sort=description&_order=asc`).subscribe((data:any) => {
        this.dataSource = new MatTableDataSource<GetUsersComponent>(data);
            this.dataSource.paginator = this.paginator
            this.DescSort = true;
       })
    }
  }

  sortBywebRef(){

    if(this.webRefSort){
      this.http.get(`http://localhost:3000/data?_sort=webReference&_order=desc`).subscribe((data:any) => {
      this.dataSource = new MatTableDataSource<GetUsersComponent>(data);
          this.dataSource.paginator = this.paginator
          this.webRefSort = false;
     })
    }else{
      this.http.get(`http://localhost:3000/data?_sort=webReference&_order=asc`).subscribe((data:any) => {
        this.dataSource = new MatTableDataSource<GetUsersComponent>(data);
            this.dataSource.paginator = this.paginator
            this.webRefSort = true;
       })
    }

  }
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.selectRows();
  }

}
