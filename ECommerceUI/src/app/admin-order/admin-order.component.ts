import { Component, OnInit } from '@angular/core';
import { Order } from '../models/models';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-admin-order',
  templateUrl: './admin-order.component.html',
  styleUrls: ['./admin-order.component.css']
})
export class AdminOrderComponent implements OnInit {
  pendingOrders: Order[] = [];

  constructor(private navigationService: NavigationService) { }

  ngOnInit(): void {
    this.loadPendingOrders();
  }

  loadPendingOrders() {
    // Assuming you have a service method to fetch pending orders from the backend
    this.navigationService.getPendingOrders().subscribe((orders: Order[]) => {
      this.pendingOrders = orders;
    });
  }

  acceptOrder(orderId: number) {
    // Call a service method to update order status as accepted
    this.navigationService.acceptOrder(orderId).subscribe(() => {
      // Reload pending orders after accepting
      this.loadPendingOrders();
    });
  }

  refuseOrder(orderId: number) {
    // Call a service method to update order status as refused
    this.navigationService.refuseOrder(orderId).subscribe(() => {
      // Reload pending orders after refusing
      this.loadPendingOrders();
    });
  }
}
