import { Component, OnInit } from '@angular/core';
import { SuggestedProduct } from '../models/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  suggestedProducts: SuggestedProduct[] = [
    // {
    //   banerimage: 'Baner/naira.jpg',
    //   category: {
    //     id: 0,
    //     category: 'electronics',
    //     subCategory: 'mobiles',
    //   },
    // },
    {
      banerimage:
        'Baner/Premium Vector _ Ramadan sale banner template background.jpeg',
      category: {
        id: 1,
        category: 'electronics',
        subCategory: 'laptops',
      },
    },
    // {
    //   banerimage: 'Baner/c6fc8237-dc0b-459d-84d5-d4937fd26c91.jpeg',
    //   category: {
    //     id: 1,
    //     category: 'furniture',
    //     subCategory: 'chairs',
    //   },
    // },
  ];
  constructor() {}

  ngOnInit(): void {}
}
