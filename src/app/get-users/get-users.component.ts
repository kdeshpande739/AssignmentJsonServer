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

  // Declaration of variables
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
  // Get user will be called on page load as it is written in ngOnInit hook
   this.getUsers();
  }

  ngAfterViewInit(): void {
    // If any change in the view is called this hook will get called and changes the table rows accordingly
    this.getUsers();
  }
  displayedColumns: string[] = ['select','name', 'description', 'webReference'];
  dataSource :any;
  selection = new SelectionModel<GetUsersComponent>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;


  // Get Api will be executed and data from the same will be bind to the table
  getUsers(){
    this.http.get('http://localhost:3000/data').subscribe((data:any) => {

     this.dataSource = new MatTableDataSource<GetUsersComponent>(data);
     this.dataSource.paginator = this.paginator

    })
  }

  // Post API will be executed and data from the input boxes will be added to the json file
  // If any input field is empty it will give an error that this field is empty
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

  // Select user will be deleted based the id which was selected in the checkbox, Only one user can be delete at a single time as json server does not provide functionality of multiple deletion at a single time
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

  // Close dialog method is used to close the modal
  closeDialog() { this.dialogRef.close({ event: 'close' }); }


   /** Whether the number of selected elements matches the total number of rows. */
   isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.paginator.pageSize;
    this.selectionId = this.selection.selected
    return numSelected;
  }

  // Function to select specific rows based on the index value
  selectRows() {
    for (let index = 0; index < this.dataSource.paginator.pageSize; index++) {
      this.selection.select(this.dataSource.data[index]);
      console.log(this.selection);
      this.selectionAmount = this.selection.selected.length;
    }
  }

  // Search functioanlity is used to search rows based on the name column and the table will show only matching rows based on the filter
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

  // Sort by Name funtionality will be used to sort rows by name column
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

  // Sort by Description funtionality will be used to sort rows by description column
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

    // Sort by Name funtionality will be used to sort rows by name column
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

  // Select all rows function
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.selectRows();
  }

}
