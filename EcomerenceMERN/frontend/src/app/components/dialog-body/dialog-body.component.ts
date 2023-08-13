import { Component } from '@angular/core';
import {CartService} from "../../services/cart.service";
import {ProductService} from "../../services/product.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-dialog-body',
  templateUrl: './dialog-body.component.html',
  styleUrls: ['./dialog-body.component.scss']
})
export class DialogBodyComponent {
  closePopup:boolean = false;

  constructor(private matDialog:MatDialog, private dialogRef: MatDialogRef<DialogBodyComponent>) {}

  closeDialog(){
    this.closePopup = true;
    this.dialogRef.close('closed');
  }

}
