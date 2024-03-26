import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    imageName: '',
  };

  categories: Category[] = [];
  offers: Offer[] = [];
  selectedImage: string | ArrayBuffer | null = null;
  productToEdit: Product | null = null;

  constructor(private http: HttpClient , private router: Router) { }

  addedProducts: Product[] = [];

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
    // Fetch all products from the database
    this.http.get<Product[]>('https://localhost:7149/api/Shopping/GetAllProducts')
      .subscribe(
        (response: Product[]) => {
          this.addedProducts = response; // Assign fetched products to addedProducts array
        },
        (error) => {
          console.error('Error fetching products:', error);
        },
        () => {


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
         // this.resetForm(); // Reset the form after successful submission
        },
        (error) => {
          console.error('Error adding product:', error);
          alert('Error adding product. Please try again.'); // Show error message
          // Log the error object for further inspection
          console.error('Error object:', error);
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


  // Method to edit a product
  editProduct(productId: number): void {
    // Redirect to the edit page with the selected product ID
    this.router.navigate(['/edit', productId]);
  }

  // Method to cancel editing
  cancelEdit(): void {
    this.productToEdit = null;
  }
}
