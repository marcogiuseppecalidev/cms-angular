import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  categories = [
    {
      name: 'FUNKO',
      emoji: '🎭',
      color: 'purple',
      products: '120+ prodotti'
    },
    {
      name: 'FUGGLER',
      emoji: '👹',
      color: 'pink',
      products: '45+ prodotti'
    },
    {
      name: 'SONNY ANGEL',
      emoji: '👼',
      color: 'orange',
      products: '80+ prodotti'
    },
    {
      name: 'POP MART',
      emoji: '🎁',
      color: 'blue',
      products: '60+ prodotti'
    },
    {
      name: 'MINISO',
      emoji: '🐻',
      color: 'green',
      products: '90+ prodotti'
    }
  ];

  products = [
    {
      name: 'Funko Pop! Marvel',
      category: 'FUNKO',
      price: 19.99,
      oldPrice: 24.99,
      badge: 'NUOVO',
      emoji: '🦸',
      color: 'purple'
    },
    {
      name: 'Fuggler Original',
      category: 'FUGGLER',
      price: 16.99,
      oldPrice: 21.99,
      badge: 'BESTSELLER',
      emoji: '👹',
      color: 'pink'
    },
    {
      name: 'Sonny Angel Series',
      category: 'SONNY ANGEL',
      price: 14.99,
      oldPrice: 18.99,
      badge: 'HOT',
      emoji: '👼',
      color: 'orange'
    },
    {
      name: 'Pop Mart Figure',
      category: 'POP MART',
      price: 29.99,
      oldPrice: 34.99,
      badge: 'LIMITED',
      emoji: '🎁',
      color: 'blue'
    },
    {
      name: 'Miniso Character',
      category: 'MINISO',
      price: 12.99,
      oldPrice: 16.99,
      badge: 'NUOVO',
      emoji: '🐻',
      color: 'green'
    },
    {
      name: 'Funko Pop! Disney',
      category: 'FUNKO',
      price: 17.99,
      oldPrice: 22.99,
      badge: 'SALE',
      emoji: '✨',
      color: 'yellow'
    },
    {
      name: 'Fuggler Monster',
      category: 'FUGGLER',
      price: 18.99,
      oldPrice: 23.99,
      badge: 'HOT',
      emoji: '👾',
      color: 'red'
    },
    {
      name: 'Sonny Angel Animal',
      category: 'SONNY ANGEL',
      price: 15.99,
      oldPrice: 19.99,
      badge: 'NUOVO',
      emoji: '🐰',
      color: 'cyan'
    }
  ];

}