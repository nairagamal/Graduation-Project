import { NavigationService } from './../services/navigation.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Product, Category, Offer } from '../models/models';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

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
    imageName: new Uint8Array() ,
  };

  categories: Category[] = [];
  offers: Offer[] = [];
  productToEdit: Product | null = null;
  showAddForm: boolean = false;
  addedProducts: Product[] = [];
  imageSrc: string = ''; 
  imageData: ArrayBuffer | null = null; 
  constructor(private http: HttpClient, private router: Router, private navigationService: NavigationService) { }

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchOffers();
    this.fetchProducts();
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
  fetchProducts(): void {
    this.http.get<Product[]>('https://localhost:7149/api/Shopping/GetAllProducts')
      .subscribe(
        (response: Product[]) => {
          this.addedProducts = response;
          this.addedProducts.forEach(product => {
            this.getImageData(product.id);
          });
        },
        (error) => {
          console.error('Error fetching products:', error);
        }
      );
  }

  getImageData(productId: number): void {
    this.navigationService.getImageData(productId).subscribe(
      (data: ArrayBuffer) => {
        const productIndex = this.addedProducts.findIndex(product => product.id === productId);
        if (productIndex !== -1) {
          this.addedProducts[productIndex].imageName = new Uint8Array(data);
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching image data:', error);
      }
    );
  }
  
  convertImageToBase64(imageData: Uint8Array): string {
    const binaryString = imageData.reduce((data, byte) => data + String.fromCharCode(byte), '');
    return 'data:image/png;base64,' + btoa(binaryString);
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
          alert('Product inserted successfully'); // Show success message
        },
        (error) => {
          console.error('Error adding product:', error);
          alert('Error adding product. Please try again.'); // Show error message
          console.error('Error object:', error); // Log the error object for further inspection
        }
      );
    this.addedProducts.push(this.product);
  }

  
  deleteProduct(productId: number): void {
    const index = this.addedProducts.findIndex(product => product.id === productId);

    if (index !== -1) {
      this.http.delete(`https://localhost:7149/api/Shopping/DeleteProduct/${productId}`)
        .subscribe(
          () => {
            console.log('Product deleted successfully');
            this.addedProducts.splice(index, 1);
          },
          (error) => {
            console.error('Error deleting product:', error);
            alert('Error deleting product. Please try again.');
          }
        );
    }
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetForm();
    }
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
      imageName: new Uint8Array(),
    };
  }

  editProduct(productId: number): void {
    const selectedProduct = this.addedProducts.find(product => product.id === productId);
    if (selectedProduct) {
      this.productToEdit = { ...selectedProduct };
    }
  }

  cancelEdit(): void {
    this.productToEdit = null;
  }

  onEdit(): void {
    if (this.productToEdit) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };

      this.http.post(`https://localhost:7149/api/Shopping/EditProduct/${this.productToEdit.id}`, this.productToEdit, httpOptions)
        .subscribe(
          () => {
            console.log('Product updated successfully');
            alert('Product updated successfully');
            this.cancelEdit();
            this.fetchProducts();
          },
          (error) => {
            console.error('Error updating product:', error);
            alert('Error updating product. Please try again.');
          }
        );
    }
  }
}
