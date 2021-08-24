import { Component, OnInit } from '@angular/core';
import { categoryState, User } from 'src/assets/config/interfaces';
import { CategoryserviceService } from './services/categoryservice.service';

import { AuthService } from 'src/app/services/auth/auth.service';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { BottomsheetComponent } from 'src/app/shared/bottomsheet/bottomsheet.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  moduleState : categoryState
  userState : User

  active = 0;

  subacetgories : any[] = [];
  subacetgoriesDatas : any[] = [];

  constructor(
    private moduleService : CategoryserviceService,
    public matDialog: MatDialog, 
    private _bottomSheet: MatBottomSheet,
    private authService: AuthService
  ) { }

  public openModal = (modalWith, modalWithExt, modalRoot, modalTitle, modalDatas) => {
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.disableClose = false;
    dialogConfig.width = modalWith + modalWithExt;
    dialogConfig.panelClass = "custom-dialog-container";
    dialogConfig.data = {root: modalRoot, title: modalTitle, data: modalDatas}
    this.matDialog.open(ModalComponent, dialogConfig);
  }
  
  public openBottomSheet(sheetRoot, sheetTitle, sheetDatas): void {
    const sheetConfig = new MatBottomSheetConfig();
    sheetConfig.panelClass = "custom-sheet-container";
    sheetConfig.data = {root: sheetRoot, title: sheetTitle, data: sheetDatas}
    this._bottomSheet.open(BottomsheetComponent, sheetConfig);
  }

  ngOnInit(): void {
    this.moduleService.init()

    this.moduleService.stateObservable.subscribe(state => {
      this.moduleState = state;

      if(this.moduleState.subacetgories && this.moduleState.subacetgories.length > 0) {
        this.subacetgories = this.moduleState.subacetgories

        if(this.moduleState.categories && this.moduleState.categories.length > 0) {
          this.getSubCategories(this.moduleState.categories[0].id)
        }
      }
    })

    this.authService.userObservable.subscribe(state => {
      this.userState = state
    })
  }


  editAdminState (admin, state) {
    const adminData = {
      ...admin,
      password: '',
      state : Number(state)
    }
    this.moduleService.deleteCategory(adminData)
  }


  getSubCategories (id) {
    this.subacetgoriesDatas = this.subacetgories.filter(cat => cat.category === id);
  }
}
