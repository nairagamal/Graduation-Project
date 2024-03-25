import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { Product } from '../models/models';
import { Observable } from 'rxjs';
import {
  Category,
  Order,
  Payment,
  PaymentMethod,
  User,
} from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  baseurl = 'https://localhost:7149/api/Shopping/';

  constructor(private http: HttpClient) {}

  getCategoryList() {
    let url = this.baseurl + 'GetCategoryList';
    return this.http.get<any[]>(url).pipe(
      map((categories) =>
        categories.map((category) => {
          let mappedCategory: Category = {
            id: category.id,
            category: category.category,
            subCategory: category.subCategory,
          };
          return mappedCategory;
        })
      )
    );
  }

  getProducts(category: string, subcategory: string, count: number) {
    return this.http.get<any[]>(this.baseurl + 'GetProducts', {
      params: new HttpParams()
        .set('category', category)
        .set('subcategory', subcategory)
        .set('count', count),
    });
  }

  getProduct(id: number) {
    let url = this.baseurl + 'GetProduct/' + id;
    return this.http.get(url);
  }

  registerUser(user: User) {
    let url = this.baseurl + 'RegisterUser';
    return this.http.post(url, user, { responseType: 'text' });
  }

  loginUser(email: string, password: string) {
    let url = this.baseurl + 'LoginUser';
    return this.http.post(
      url,
      { Email: email, Password: password },
      { responseType: 'text' }
    );
  }

  submitReview(userid: number, productid: number, review: string) {
    let obj: any = {
      User: {
        Id: userid,
      },
      Product: {
        Id: productid,
      },
      Value: review,
    };

    let url = this.baseurl + 'InsertReview';
    return this.http.post(url, obj, { responseType: 'text' });
  }

  getAllReviewsOfProduct(productId: number) {
    let url = this.baseurl + 'GetProductReviews/' + productId;
    return this.http.get(url);
  }

  addToCart(userid: number, productid: number) {
    let url = this.baseurl + 'InsertCartItem/' + userid + '/' + productid;
    return this.http.post(url, null, { responseType: 'text' });
  }

  removeCartItemFromBackend(cartItem: any): Observable<any> {
    // Make an HTTP request to the backend to remove the item from the cart
    let url = this.baseurl + 'RemoveCartItem';
    return this.http.post(url, cartItem);
  }

  getActiveCartOfUser(userid: number) {
    let url = this.baseurl + 'GetActiveCartOfUser/' + userid;
    return this.http.get(url);
  }

  getAllPreviousCarts(userid: number) {
    let url = this.baseurl + 'GetAllPreviousCartsOfUser/' + userid;
    return this.http.get(url);
  }

  getPaymentMethods() {
    let url = this.baseurl + 'GetPaymentMethods';
    return this.http.get<PaymentMethod[]>(url);
  }

  insertPayment(payment: Payment) {
    return this.http.post(this.baseurl + 'InsertPayment', payment, {
      responseType: 'text',
    });
  }

  insertOrder(order: Order) {
    return this.http.post(this.baseurl + 'InsertOrder', order);
  }


  getPendingOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseurl}/pending-orders`);
  }

  acceptOrder(orderId: number): Observable<any> {
    return this.http.put(`${this.baseurl}/orders/${orderId}/accept`, {});
  }

  refuseOrder(orderId: number): Observable<any> {
    return this.http.put(`${this.baseurl}/orders/${orderId}/refuse`, {});
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<any[]>(this.baseurl + 'GetProducts').pipe(
      map((products) =>
        products.map((product) => {
          let mappedProduct: Product = {
            id: product.id,
            title: product.title,
            description: product.description,
            productCategory: {
              id: product.productCategory.id,
              category: product.productCategory.category,
              subCategory: product.productCategory.subCategory,
            },
            offer: {
              id: product.offer.id,
              title: product.offer.title,
              discount: product.offer.discount,
            },
            price: product.price,
            quantity: product.quantity,
            imageName: product.imageName,
          };
          return mappedProduct;
        })
      )
    );
  }

  insertProduct(product: Product): Observable<any> {
    return this.http.post<any>(this.baseurl + 'InsertProduct', product);
  }

}
