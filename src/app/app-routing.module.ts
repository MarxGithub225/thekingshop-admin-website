import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministratorsComponent } from './modules/administrators/administrators.component';
import { BannerComponent } from './modules/banner/banner.component';
import { CategoryComponent } from './modules/category/category.component';
import { HomeComponent } from './modules/home/home.component';
import { OrderComponent } from './modules/order/order.component';
import { CreateproductComponent } from './modules/product/createproduct/createproduct.component';
import { ProductComponent } from './modules/product/product.component';

const routes: Routes = [
  {
    path: '',
    component:  OrderComponent
  },
  {
    path: 'dashboard',
    component:  OrderComponent
  },
  {
    path: 'admins',
    component:  AdministratorsComponent
  },
  {
    path: 'products',
    component:  ProductComponent
  },
  {
    path: 'addproduct',
    component:  CreateproductComponent
  },
  {
    path: 'categories',
    component:  CategoryComponent
  },
  {
    path: 'banners',
    component:  BannerComponent
  },
  {
    path: 'orders',
    component:  OrderComponent
  },
  {
    path: '**',
    component: OrderComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
