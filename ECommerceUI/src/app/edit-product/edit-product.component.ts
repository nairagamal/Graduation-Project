import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationService } from '../services/navigation.service';
import { Product } from '../models/models';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  @Input() productId!: number;
  @Output() cancelEdit: EventEmitter<void> = new EventEmitter<void>();

  editedProduct!: Product;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navigationService: NavigationService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = +params['productId'];
      this.navigationService.getProductById(this.productId).subscribe(product => {
        this.editedProduct = product;
      });
    });
  }

  onSaveChanges(): void {
    this.navigationService.updateProduct(this.editedProduct).subscribe(() => {
      // Product updated successfully, navigate to add-product route
      this.router.navigate(['/admin/add-product']);
    }, error => {
      // Handle error if product update fails
      console.error('Error updating product:', error);
    });
  }

  onCancelEdit(): void {
    this.cancelEdit.emit();
  }
}
