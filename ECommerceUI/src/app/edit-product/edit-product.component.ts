import { Component, OnInit } from '@angular/core';
import {Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../models/models';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent {
  @Input() product!: Product; // Input property to receive product data
  @Output() saveChanges: EventEmitter<Product> = new EventEmitter<Product>(); // Output event to emit edited product data
  @Output() cancelEdit: EventEmitter<void> = new EventEmitter<void>(); // Output event to cancel editing

  editedProduct!: Product; // Property to store edited product data

  constructor() { }

  ngOnChanges(): void {
    // Initialize editedProduct with a copy of the received product data
    this.editedProduct = { ...this.product };
  }

  onSaveChanges(): void {
    // Emit the edited product data to the parent component
    this.saveChanges.emit(this.editedProduct);
  }

  onCancelEdit(): void {
    // Emit cancel edit event
    this.cancelEdit.emit();
  }
}
