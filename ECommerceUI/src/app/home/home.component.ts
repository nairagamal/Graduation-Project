import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../services/navigation.service';
import { Product } from '../models/models';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  products: Product[] = [];

  constructor(private navigationService: NavigationService,public utilityService: UtilityService) {}

  ngOnInit(): void {
    this.fetchFirstThreeProducts();
    this.getAllProducts();
  }

  fetchFirstThreeProducts(): void {
    this.navigationService.getAllProducts().subscribe(
      (products: Product[]) => {
        // Slice the array to get the first three products
        this.products = products.slice(0, 3);
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }


  getAllProducts(): void {
    this.navigationService.getAllProductsFlat().subscribe(
      (products: Product[]) => {
        // Slice the array to get only the first three products
        this.products = products.slice(0, 3);

        // Fetch image data for each product
        this.products.forEach(product => {
          this.getImageData(product);
        });
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }


  getImageData(product: Product): void {
    this.navigationService.getImageData(product.id).subscribe(
      (data: ArrayBuffer) => {
        product.imageName = new Uint8Array(data); // Store binary image data
      },
      (error) => {
        console.error('Error fetching image data:', error);
      }
    );
  }

  convertImageToBase64(imageData: Uint8Array): string {
    const binaryString = imageData.reduce((data, byte) => data + String.fromCharCode(byte), '');
    return 'data:image/png;base64,' + btoa(binaryString);
  }
}
