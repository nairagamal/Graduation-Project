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
  selectedImage: string | ArrayBuffer | null = null;

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


  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    // Assuming you want to send the image name along with product data
    const productData = {
      ...this.product,
      imageName: this.product.imageName // Update imageName property with uploaded image name
    };

    this.http.post('https://localhost:7149/api/Shopping/InsertProduct', productData, httpOptions)
      .subscribe(
        (response) => {
          console.log('Product added successfully:', response);
          alert('Product inserted successfully'); // Show success message
          this.resetForm(); // Reset the form after successful submission
        },
        (error) => {
          console.error('Error adding product:', error);
          alert('Error adding product. Please try again.'); // Show error message
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

  updateImageName(): void {
    this.product.imageName = `${this.product.id}.jpg`;
  }
}
