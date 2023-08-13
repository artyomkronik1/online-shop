import { Component } from '@angular/core';
import {DialogBodyComponent} from "./components/dialog-body/dialog-body.component";
import {MatDialog} from "@angular/material/dialog";
export const mobile = document.body.offsetWidth < 767;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  constructor(private matDialog:MatDialog) {}

  protected readonly mobile = mobile;
}
