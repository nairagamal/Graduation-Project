import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product, Category, Offer } from '../models/models';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  product: Product = {
    id: 0,
    title: '',
    description: '',
    productCategory: {
      id: 0,
      category: '',
      subCategory: ''
    },
    offer: {
      id: 0,
      title: '',
      discount: 0
    },
    price: 0,
    quantity: 0,
    imageName: '',
  };

  categories: Category[] = [];
  offers: Offer[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchOffers();
  }

  fetchCategories(): void {
    this.http.get<Category[]>('https://localhost:7149/api/Shopping/GetCategoryList')
      .subscribe(
        (response: Category[]) => {
          this.categories = response;
        },
        (error) => {
          console.error('Error fetching categories:', error);
        }
      );
  }

  fetchOffers(): void {
    this.http.get<Offer[]>('https://localhost:7149/api/Shopping/GetOffers') // Adjust endpoint as per your API
      .subscribe(
        (response: Offer[]) => {
          this.offers = response;
        },
        (error) => {
          console.error('Error fetching offers:', error);
        }
      );
  }


  onSubmit(): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    this.http.post('https://localhost:7149/api/Shopping/InsertProduct', this.product, httpOptions)
      .subscribe(
        (response) => {
          console.log('Product added successfully:', response);
          this.resetForm();
        },
        (error) => {
          console.error('Error adding product:', error);
        }
      );
  }

  resetForm(): void {
    this.product = {
      id: 0,
      title: '',
      description: '',
      productCategory: {
        id: 0,
        category: '',
        subCategory: ''
      },
      offer: {
        id: 0,
        title: '',
        discount: 0
      },
      price: 0,
      quantity: 0,
      imageName: ''
    };
  }
}
