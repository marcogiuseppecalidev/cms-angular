
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  inject
} from '@angular/core';

import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import {
  ProductsService,
  Product
} from '../../services/products';

// Prodotto del database con informazioni grafiche aggiuntive.
interface DisplayedProduct extends Product {
  category: string;
  oldPrice: number;
  badge: string;
  emoji: string;
  color: string;
}

// Articolo presente nel carrello.
interface CartItem {
  product: DisplayedProduct;
  quantity: number;
}

type SortOrder =
  | 'default'
  | 'price-asc'
  | 'price-desc'
  | 'name';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  // ==========================================
  // SERVIZI ANGULAR
  // ==========================================

  private productsService = inject(ProductsService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('searchInput')
  searchInput?: ElementRef<HTMLInputElement>;

  // ==========================================
  // PRODOTTI CARICATI DAL DATABASE
  // ==========================================

  apiProducts: Product[] = [];

  loading = true;
  errorMessage = '';

  // ==========================================
  // RICERCA E FILTRI
  // ==========================================

  searchTerm = '';
  activeCategory = 'TUTTI';
  sortOrder: SortOrder = 'default';
  favoritesOnly = false;

  // ==========================================
  // PREFERITI
  // ==========================================

  favoriteIds: number[] = [];

  // ==========================================
  // CARRELLO
  // ==========================================

  cartItems: CartItem[] = [];
  cartOpen = false;

  // ==========================================
  // MODIFICA PREZZO
  // ==========================================

  selectedProduct: DisplayedProduct | null = null;
  newPrice = 0;
  savingPrice = false;

  // ==========================================
  // CATEGORIE CALI STORE
  // ==========================================

  categories = [
    {
      name: 'FUNKO',
      emoji: '🎭',
      color: 'red',
      products: 'Scopri i Funko Pop'
    },
    {
      name: 'FUGGLER',
      emoji: '👹',
      color: 'yellow',
      products: 'Scopri i Fuggler'
    },
    {
      name: 'SONNY ANGEL',
      emoji: '👼',
      color: 'green',
      products: 'Scopri i Sonny Angel'
    },
    {
      name: 'POP MART',
      emoji: '🎁',
      color: 'purple',
      products: 'Scopri Pop Mart'
    },
    {
      name: 'MINISO',
      emoji: '🐻',
      color: 'pink',
      products: 'Scopri Miniso'
    }
  ];

  // ==========================================
  // AVVIO COMPONENTE
  // ==========================================

  ngOnInit(): void {
    this.loadProducts();
  }

  // ==========================================
  // CARICAMENTO PRODOTTI DAL BACKEND .NET
  // ==========================================

  loadProducts(): void {

    this.loading = true;
    this.errorMessage = '';

    this.productsService.getProducts().subscribe({

      next: (products: Product[]) => {

        this.apiProducts = Array.isArray(products)
          ? [...products]
          : [];

        this.loading = false;

        console.log(
          'CALI STORE - Prodotti caricati:',
          this.apiProducts
        );

        // Fondamentale per aggiornare la pagina
        // dopo la risposta delle API.
        this.cdr.detectChanges();

      },

      error: (error: HttpErrorResponse) => {

        console.error(
          'Errore caricamento prodotti:',
          error
        );

        this.errorMessage =
          'Impossibile caricare i prodotti. ' +
          'Controlla che VintageApi sia avviato.';

        this.loading = false;

        this.cdr.detectChanges();

      }

    });

  }

  // ==========================================
  // RICONOSCIMENTO CATEGORIA PRODOTTO
  // ==========================================

  private getProductCategory(name: string): string {

    const normalizedName = (name ?? '').toUpperCase();

    if (normalizedName.includes('FUGGLER')) {
      return 'FUGGLER';
    }

    if (normalizedName.includes('FUNKO')) {
      return 'FUNKO';
    }

    if (normalizedName.includes('SONNY ANGEL')) {
      return 'SONNY ANGEL';
    }

    if (
      normalizedName.includes('POP MART') ||
      normalizedName.includes('POPMART') ||
      normalizedName.includes('LABUBU')
    ) {
      return 'POP MART';
    }

    if (normalizedName.includes('MINISO')) {
      return 'MINISO';
    }

    return 'COLLEZIONABILI';

  }

  // ==========================================
  // INFORMAZIONI GRAFICHE DEL PRODOTTO
  // ==========================================

  private decorateProduct(product: Product): DisplayedProduct {

    const category = this.getProductCategory(product.name);

    let emoji = '🎁';
    let color = 'blue';

    switch (category) {

      case 'FUNKO':
        emoji = '🎭';
        color = 'red';
        break;

      case 'FUGGLER':
        emoji = '👹';
        color = 'yellow';
        break;

      case 'SONNY ANGEL':
        emoji = '👼';
        color = 'green';
        break;

      case 'POP MART':
        emoji = '🎁';
        color = 'purple';
        break;

      case 'MINISO':
        emoji = '🐻';
        color = 'pink';
        break;

    }

    return {
      ...product,
      category,
      oldPrice: product.price,
      badge: 'CALI STORE',
      emoji,
      color
    };

  }

  // ==========================================
  // PRODOTTI DA VISUALIZZARE NEL CATALOGO
  // ==========================================

  get displayedProducts(): DisplayedProduct[] {

    let products = this.apiProducts.map(
      product => this.decorateProduct(product)
    );

    // RICERCA
    const query = this.searchTerm.trim().toLowerCase();

    if (query) {

      products = products.filter(product => {

        const name = (product.name ?? '').toLowerCase();

        const description =
          (product.description ?? '').toLowerCase();

        const category = product.category.toLowerCase();

        return (
          name.includes(query) ||
          description.includes(query) ||
          category.includes(query)
        );

      });

    }

    // FILTRO CATEGORIA
    if (this.activeCategory !== 'TUTTI') {

      products = products.filter(
        product => product.category === this.activeCategory
      );

    }

    // FILTRO PREFERITI
    if (this.favoritesOnly) {

      products = products.filter(
        product => this.favoriteIds.includes(product.id)
      );

    }

    // ORDINAMENTO
    switch (this.sortOrder) {

      case 'price-asc':

        products.sort(
          (a, b) => a.price - b.price
        );

        break;

      case 'price-desc':

        products.sort(
          (a, b) => b.price - a.price
        );

        break;

      case 'name':

        products.sort(
          (a, b) => a.name.localeCompare(b.name, 'it')
        );

        break;

      default:
        break;

    }

    return products;

  }

  // ==========================================
  // SCORRIMENTO AL CATALOGO
  // ==========================================

  private scrollToCatalog(): void {

    document.getElementById('catalogo')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

  }

  // ==========================================
  // RICERCA
  // ==========================================

  focusSearch(): void {

    this.scrollToCatalog();

    this.searchInput?.nativeElement.focus();

  }

  onSearchInput(event: Event): void {

    const input = event.target as HTMLInputElement;

    this.searchTerm = input.value;

  }

  clearSearch(): void {

    this.searchTerm = '';

    this.searchInput?.nativeElement.focus();

  }

  // ==========================================
  // SELEZIONE CATEGORIA
  // ==========================================

  selectCategory(category: string): void {

    this.activeCategory = category;

    this.favoritesOnly = false;

    this.scrollToCatalog();

  }

  // ==========================================
  // ORDINAMENTO
  // ==========================================

  onSortChange(event: Event): void {

    const select = event.target as HTMLSelectElement;

    const value = select.value;

    if (
      value === 'default' ||
      value === 'price-asc' ||
      value === 'price-desc' ||
      value === 'name'
    ) {
      this.sortOrder = value;
    }

  }

  // ==========================================
  // RIPRISTINO FILTRI
  // ==========================================

  resetFilters(): void {

    this.searchTerm = '';
    this.activeCategory = 'TUTTI';
    this.sortOrder = 'default';
    this.favoritesOnly = false;

  }

  // ==========================================
  // PREFERITI
  // ==========================================

  isFavorite(productId: number): boolean {

    return this.favoriteIds.includes(productId);

  }

  toggleFavorite(productId: number): void {

    if (this.isFavorite(productId)) {

      this.favoriteIds = this.favoriteIds.filter(
        id => id !== productId
      );

    } else {

      this.favoriteIds = [
        ...this.favoriteIds,
        productId
      ];

    }

  }

  toggleFavoritesView(): void {

    this.favoritesOnly = !this.favoritesOnly;

    if (this.favoritesOnly) {

      this.activeCategory = 'TUTTI';

      this.scrollToCatalog();

    }

  }

  // ==========================================
  // NUMERO ARTICOLI NEL CARRELLO
  // ==========================================

  get cartCount(): number {

    return this.cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );

  }

  // ==========================================
  // TOTALE CARRELLO
  // ==========================================

  get cartTotal(): number {

    return this.cartItems.reduce(
      (total, item) =>
        total + item.product.price * item.quantity,
      0
    );

  }

  // ==========================================
  // APERTURA E CHIUSURA CARRELLO
  // ==========================================

  toggleCart(): void {

    this.cartOpen = !this.cartOpen;

  }

  // ==========================================
  // AGGIUNGI AL CARRELLO
  // ==========================================

  addToCart(product: DisplayedProduct): void {

    const existingItem = this.cartItems.find(
      item => item.product.id === product.id
    );

    if (existingItem) {

      this.cartItems = this.cartItems.map(item => {

        if (item.product.id === product.id) {

          return {
            ...item,
            quantity: item.quantity + 1
          };

        }

        return item;

      });

    } else {

      this.cartItems = [
        ...this.cartItems,
        {
          product,
          quantity: 1
        }
      ];

    }

    console.log(
      'Aggiunto al carrello:',
      product.name
    );

  }

  // ==========================================
  // MODIFICA QUANTITÀ CARRELLO
  // ==========================================

  changeCartQuantity(
    productId: number,
    change: number
  ): void {

    this.cartItems = this.cartItems
      .map(item => {

        if (item.product.id === productId) {

          return {
            ...item,
            quantity: item.quantity + change
          };

        }

        return item;

      })
      .filter(item => item.quantity > 0);

  }

  // ==========================================
  // RIMUOVI DAL CARRELLO
  // ==========================================

  removeFromCart(productId: number): void {

    this.cartItems = this.cartItems.filter(
      item => item.product.id !== productId
    );

  }

  // ==========================================
  // APERTURA MODIFICA PREZZO
  // ==========================================

  selectProduct(product: DisplayedProduct): void {

    this.selectedProduct = product;

    this.newPrice = product.price;

  }

  // ==========================================
  // INPUT NUOVO PREZZO
  // ==========================================

  onPriceInput(event: Event): void {

    const input = event.target as HTMLInputElement;

    this.newPrice = Number(input.value);

  }

  // ==========================================
  // SALVATAGGIO PREZZO SUL DATABASE
  // ==========================================

  savePrice(): void {

    if (
      !this.selectedProduct ||
      !Number.isFinite(this.newPrice) ||
      this.newPrice <= 0 ||
      this.savingPrice
    ) {
      return;
    }

    const product = this.selectedProduct;
    const priceToSave = this.newPrice;

    this.savingPrice = true;

    this.productsService.updateProduct(product.id, {

      name: product.name,
      description: product.description,
      price: priceToSave

    }).subscribe({

      next: (updatedProduct: Product) => {

        // Aggiorna il catalogo con i dati ricevuti
        // dal backend dopo il salvataggio.
        this.apiProducts = this.apiProducts.map(item => {

          if (item.id === product.id) {

            return {
              ...item,
              ...updatedProduct,
              price: updatedProduct.price
            };

          }

          return item;

        });

        // Aggiorna anche il prezzo nel carrello.
        this.cartItems = this.cartItems.map(item => {

          if (item.product.id === product.id) {

            return {
              ...item,
              product: {
                ...item.product,
                ...updatedProduct,
                price: updatedProduct.price
              }
            };

          }

          return item;

        });

        this.selectedProduct = null;
        this.savingPrice = false;

        this.cdr.detectChanges();

        console.log(
          'Prezzo salvato correttamente:',
          updatedProduct
        );

        alert('Prezzo aggiornato con successo!');

      },

      error: (error: HttpErrorResponse) => {

        console.error(
          'Errore aggiornamento prezzo:',
          error
        );

        this.savingPrice = false;

        this.cdr.detectChanges();

        alert(
          'Impossibile aggiornare il prezzo. ' +
          'Verifica che il backend VintageApi sia avviato.'
        );

      }

    });

  }

}
