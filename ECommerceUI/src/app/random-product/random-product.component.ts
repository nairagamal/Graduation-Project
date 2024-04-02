import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../services/navigation.service';
import { UtilityService } from '../services/utility.service';
import { Product } from '../models/models';

@Component({
  selector: 'app-random-product',
  templateUrl: './random-product.component.html',
  styleUrls: ['./random-product.component.css']
})
export class RandomProductComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private navigationService: NavigationService,
    public utilityService: UtilityService
  ) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts(): void {
    this.navigationService.getAllProductsFlat().subscribe(
      (products: Product[]) => {
        this.products = products;
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
