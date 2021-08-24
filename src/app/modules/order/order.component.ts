import { Component, OnInit } from '@angular/core';
import { orderState, User, userState, productState} from 'src/assets/config/interfaces';
import { OrderserviceService } from './services/orderservice.service'

import { AuthService } from 'src/app/services/auth/auth.service';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { BottomsheetComponent } from 'src/app/shared/bottomsheet/bottomsheet.component';
import { environment } from 'src/environments/environment';
import { UsersService } from 'src/app/services/users/users.service';
import { ProductserviceService } from '../product/services/productservice.service';
import { state } from '@angular/animations';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  
  moduleState : orderState
  userState : User
  userModuleStae: userState
  productStet: productState

  baseUrl : string = environment.url.replace('/routes', '');
  
  products : any[] = [];
  users: any[] = [];
  
  orders: any[] = [];

  searchText;

  orderSelected: any = {
    date: null,
    user: {},
    state: null,
    data: []
  };

  isSelected = false;

  totalOrder: number;

  constructor(
    private moduleService : OrderserviceService,
    public matDialog: MatDialog, 
    private _bottomSheet: MatBottomSheet,
    private authService: AuthService,
    private userService: UsersService,
    private productService: ProductserviceService
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

      if(this.moduleState.orders && this.moduleState.orders.length > 0) {

        this.userService.init();

        this.userService.stateObservable.subscribe(user => {
          this.userModuleStae = user


          if(this.userModuleStae.users && this.userModuleStae.users.length > 0) {

            this.productService.init();

            this.productService.stateObservable.subscribe(product => {
              this.productStet = product
  
              if(this.productStet.products && this.productStet.products.length > 0) {
                this.getOrders(this.moduleState.orders, this.userModuleStae.users, this.productStet.products)
              }
              
            })

            
          }
          
  
        })

        

        
      }
      

    })

    this.authService.userObservable.subscribe(state => {
      this.userState = state
    })
  }


  getOrders (orders, users, products) {

    this.orders = [];

    orders.forEach(order => {
      order.userInfo = users.filter(u => Number(u.id) === Number(order.user))[0];
      order.productInfo = products.filter(p => Number(p.id) === Number(order.product))[0];
    });

    orders.sort((a,b) => Number (a.state) < Number (b.state) ? -1 : 1)

    this.orders = orders
    .reduce((acc, d) => {
      const found = acc.find(a => a.date === d.date);

      const value = { quantity: d.quantity, price: d.price, state: d.state, product: d.productInfo }; // the element in data property
      if (!found) {
        //acc.push(...value);
        acc.push({date:d.date, state: d.state, searchByName: d.userInfo.name, searchByPhone: d.userInfo.phone, user: d.userInfo, data: [value]}) // not found, so need to add data property
      }
      else {
        found.data.push(value) // if found, that means data property exists, so just push new element to found.data.
      }
      return acc;
    }, []);

  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

  selectOrder (order) {
    this.isSelected =  true
    this.orderSelected = order;

  }


  total(order)
  {
    let total = 0;
    for (let c of order.data) {
     total += Number(c.price) * Number (c.quantity)
    }

    this.totalOrder =  total;
  }

  cancelOrder() {
    const data = {
      date: this.orderSelected.date,
      state: 2
    }

    this.moduleService.editOrder(data)
  }

  paidOrder() {
    const data = {
      date: this.orderSelected.date,
      state: 1
    }

    this.moduleService.editOrder(data)
  }

}