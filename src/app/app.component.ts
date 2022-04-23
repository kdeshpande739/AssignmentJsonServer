import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {GetUsersComponent} from './get-users/get-users.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  title = 'Assignment1';

  constructor(private dialog:MatDialog){}

  ngOnInit(){
      
  }

  openDialog() {
    let dialogRef=this.dialog.open(GetUsersComponent,{
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`); // Pizza!
    });
  }

  
  
}


