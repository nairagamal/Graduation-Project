import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { HomeComponent } from './home/home.component';
import { OrderComponent } from './order/order.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductsComponent } from './products/products.component';
import { SuggestedProductsComponent } from './suggested-products/suggested-products.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { LoginComponent } from './login/login.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { AddProductComponent } from './add-product/add-product.component';
import { AdminOrderComponent } from './admin-order/admin-order.component';
import { AdminReportsComponent } from './admin-reports/admin-reports.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'product-details', component: ProductDetailsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'orders', component: OrderComponent },
  { path: 'edit/:productId', component: EditProductComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminDashboardComponent },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    children: [
      { path: 'user-management', component: UserManagementComponent },
      { path: 'admin-order', component: AdminOrderComponent },
      { path: 'add-product', component: AddProductComponent },
      { path: 'admin-reports', component: AdminReportsComponent }
    ]
  },
  // { path: 'app-user-management', component: UserManagementComponent },
  // { path: 'AdminOrder', component: AdminOrderComponent },
  // { path: 'add-product', component: AddProductComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
  { path: 'suggest', component: SuggestedProductsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
