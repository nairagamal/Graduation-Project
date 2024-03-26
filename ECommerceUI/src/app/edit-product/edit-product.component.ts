import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../services/navigation.service';
import { Product } from '../models/models';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  @Input() productId!: number;
  @Output() saveChanges: EventEmitter<Product> = new EventEmitter<Product>();
  @Output() cancelEdit: EventEmitter<void> = new EventEmitter<void>();

  editedProduct!: Product;

  constructor(private route: ActivatedRoute, private navigationService: NavigationService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = +params['productId'];
      this.navigationService.getProductById(this.productId).subscribe(product => {
        this.editedProduct = product;
      });
    });
  }

  onSaveChanges(): void {
    this.saveChanges.emit(this.editedProduct);
  }

  onCancelEdit(): void {
    this.cancelEdit.emit();
  }
}
