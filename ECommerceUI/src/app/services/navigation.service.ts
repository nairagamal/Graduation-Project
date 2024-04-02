import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
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

  // removeCartItemFromBackend(cartItem: any): Observable<any> {
  //   let url = this.baseurl + 'RemoveCartItem';
  //   return this.http.post(url, cartItem);
  // }

  removeCartItem(cartItemId: number): Observable<any> {
    const url = `${this.baseurl}RemoveCartItem/${cartItemId}`;
    return this.http.delete(url);
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
            imageName: this.convertToUint8Array(product.imageName),
          };
          return mappedProduct;
        })
      )
    );
  }


  getAllProductsFlat(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseurl + 'GetAllProductsFlat');
  }

  getImage(productId: number): Observable<string> {
    const url = `${this.baseurl}GetImage/${productId}`;
    return this.http.get(url, { responseType: 'arraybuffer' }).pipe(
      map((data: ArrayBuffer) => this.arrayBufferToBase64(data))
    );
  }

  getImageData(productId: number): Observable<ArrayBuffer> {
    const url = `${this.baseurl}GetImage/${productId}`;
    return this.http.get(url, { responseType: 'arraybuffer' });
  }

  convertImageToBase64(imageData: Uint8Array): string {
    const bytes: number[] = Array.from(imageData);
    const base64String = btoa(String.fromCharCode.apply(null, bytes));
    return 'data:image/png;base64,' + base64String;
  }


  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return 'data:image/png;base64,' + btoa(binary);
  }

  private convertToUint8Array(imageName: string): Uint8Array {
    const binaryString = window.atob(imageName);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  insertProduct(product: Product): Observable<any> {
    return this.http.post<any>(this.baseurl + 'InsertProduct', product);
  }


  getProductById(productId: number): Observable<Product> {
    const url = `${this.baseurl}GetProduct/${productId}`;
    return this.http.get<Product>(url);
  }


  updateProduct(product: Product): Observable<any> {
    return this.http.put<any>(`${this.baseurl}EditProduct/${product.id}`, product);
  }




}
