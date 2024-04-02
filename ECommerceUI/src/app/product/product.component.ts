import { NavigationService } from './../services/navigation.service';
import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../models/models';
import { UtilityService } from '../services/utility.service';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  @Input() view: 'grid' | 'list' | 'currcartitem' | 'prevcartitem' = 'grid';
  imageData: ArrayBuffer | null = null;
  @Input() product: Product = {
    id: 0,
    title: '',
    description: '',
    price: 0,
    quantity: 0,
    productCategory: {
      id: 1,
      category: '',
      subCategory: '',
    },
    offer: {
      id: 1,
      title: '',
      discount: 0,
    },
    imageName: new Uint8Array(),
  };
  imageSrc: string = ''; 
  showSuccess: boolean = false;
  addToCartSuccess: boolean = false;
  constructor(public utilityService: UtilityService, private NavigationService: NavigationService, private http: HttpClient) {}

  ngOnInit(): void { this.getImageSrc();}

  addToCart(product: Product) {
    this.utilityService.addToCart(product);
    this.addToCartSuccess = true;
    setTimeout(() => {
      this.addToCartSuccess = false;
      this.showSuccess = true;
      setTimeout(() => {
        this.showSuccess = false;
      }, 3000);
    }, 0);
  }

  getImageSrc(): void {
    this.NavigationService.getImage(this.product.id).subscribe(
      (data: string) => {
        this.imageSrc = data;
      },
      (error: HttpErrorResponse) => { 
        console.error('Error fetching image:', error);
        console.error('Status:', error.status);
        console.error('Status Text:', error.statusText);
      }
    );
}
  
  getImageUrl(): string {
    if (this.imageData) {
      const byteArray = new Uint8Array(this.imageData);
      const blob = new Blob([byteArray], { type: 'image/png' });
      return URL.createObjectURL(blob);
    } else {
      return '';
    }
  }
}
