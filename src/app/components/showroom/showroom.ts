
import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

// Modalità di visualizzazione del prodotto
type ViewMode = 'funko' | 'box';

// Informazioni di ogni Funko Pop
interface ShowroomProduct {
  id: number;
  name: string;
  price: number;
  image: string;

  // Fotografie del personaggio e della confezione
  funkoImages: string[];
  boxImages: string[];

  // Modalità e angolazione attualmente selezionate
  viewMode: ViewMode;
  currentAngle: number;
}

@Component({
  selector: 'app-showroom',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './showroom.html',
  styleUrl: './showroom.css'
})
export class Showroom {

  // ==========================================
  // FUNKO POP ONE PIECE
  // ==========================================

  // Prodotti dimostrativi.
  // In futuro arriveranno dal database MySQL.

  products: ShowroomProduct[] = [
    {
      id: 1,
      name: 'Monkey D. Luffy',
      price: 19.90,
      image: '/funko/luffy.png',
      funkoImages: [
        '/funko/luffy-front.png',
        '/funko/luffy-left.png',
        '/funko/luffy-back.png',
        '/funko/luffy-right.png'
      ],
      boxImages: [
        '/funko/luffy-box-front.png',
        '/funko/luffy-box-left.png',
        '/funko/luffy-box-back.png',
        '/funko/luffy-box-right.png'
      ],
      viewMode: 'funko',
      currentAngle: 0
    },
    {
      id: 2,
      name: 'Roronoa Zoro',
      price: 22.90,
      image: '/funko/zoro.png',
      funkoImages: [
        '/funko/zoro-front.png',
        '/funko/zoro-left.png',
        '/funko/zoro-back.png',
        '/funko/zoro-right.png'
      ],
      boxImages: [
        '/funko/zoro-box-front.png',
        '/funko/zoro-box-left.png',
        '/funko/zoro-box-back.png',
        '/funko/zoro-box-right.png'
      ],
      viewMode: 'funko',
      currentAngle: 0
    },
    {
      id: 3,
      name: 'Sanji',
      price: 19.90,
      image: '/funko/sanji.png',
      funkoImages: [
        '/funko/sanji-front.png',
        '/funko/sanji-left.png',
        '/funko/sanji-back.png',
        '/funko/sanji-right.png'
      ],
      boxImages: [
        '/funko/sanji-box-front.png',
        '/funko/sanji-box-left.png',
        '/funko/sanji-box-back.png',
        '/funko/sanji-box-right.png'
      ],
      viewMode: 'funko',
      currentAngle: 0
    },
    {
      id: 4,
      name: 'Tony Tony Chopper',
      price: 24.90,
      image: '/funko/chopper.png',
      funkoImages: [
        '/funko/chopper-front.png',
        '/funko/chopper-left.png',
        '/funko/chopper-back.png',
        '/funko/chopper-right.png'
      ],
      boxImages: [
        '/funko/chopper-box-front.png',
        '/funko/chopper-box-left.png',
        '/funko/chopper-box-back.png',
        '/funko/chopper-box-right.png'
      ],
      viewMode: 'funko',
      currentAngle: 0
    },
    {
      id: 5,
      name: 'Nami',
      price: 21.90,
      image: '/funko/nami.png',
      funkoImages: [
        '/funko/nami-front.png',
        '/funko/nami-left.png',
        '/funko/nami-back.png',
        '/funko/nami-right.png'
      ],
      boxImages: [
        '/funko/nami-box-front.png',
        '/funko/nami-box-left.png',
        '/funko/nami-box-back.png',
        '/funko/nami-box-right.png'
      ],
      viewMode: 'funko',
      currentAngle: 0
    }
  ];

  // ==========================================
  // VISUALIZZAZIONE FUNKO / SCATOLA
  // ==========================================

  // Cambia modalità per un singolo prodotto
  setViewMode(
    product: ShowroomProduct,
    mode: ViewMode
  ): void {

    product.viewMode = mode;

    // Quando cambiamo modalità ripartiamo
    // dalla fotografia frontale.
    product.currentAngle = 0;

  }

  // Restituisce le immagini della modalità attiva
  getActiveImages(
    product: ShowroomProduct
  ): string[] {

    return product.viewMode === 'funko'
      ? product.funkoImages
      : product.boxImages;

  }

  // Restituisce la fotografia da visualizzare
  getCurrentImage(
    product: ShowroomProduct
  ): string {

    const images = this.getActiveImages(product);

    return images[product.currentAngle] || product.image;

  }

  // Seleziona direttamente un'angolazione
  selectAngle(
    product: ShowroomProduct,
    angle: number
  ): void {

    const images = this.getActiveImages(product);

    if (angle >= 0 && angle < images.length) {
      product.currentAngle = angle;
    }

  }

  // ==========================================
  // ROTAZIONE CON LE FRECCE
  // ==========================================

  rotateProduct(
    product: ShowroomProduct,
    direction: number
  ): void {

    const images = this.getActiveImages(product);

    if (images.length === 0) {
      return;
    }

    const total = images.length;

    product.currentAngle =
      (product.currentAngle + direction + total) % total;

  }

  // ==========================================
  // ROTAZIONE TRASCINANDO IL PRODOTTO
  // ==========================================

  private dragStartX: number | null = null;
  private draggedProductId: number | null = null;

  startDrag(
    product: ShowroomProduct,
    event: PointerEvent
  ): void {

    this.dragStartX = event.clientX;
    this.draggedProductId = product.id;

  }

  endDrag(
    product: ShowroomProduct,
    event: PointerEvent
  ): void {

    if (
      this.dragStartX === null ||
      this.draggedProductId !== product.id
    ) {
      return;
    }

    const distance = event.clientX - this.dragStartX;

    // Bastano 35 pixel di trascinamento
    // per passare all'angolazione successiva.
    if (Math.abs(distance) >= 35) {

      if (distance < 0) {
        this.rotateProduct(product, 1);
      } else {
        this.rotateProduct(product, -1);
      }

    }

    this.cancelDrag();

  }

  cancelDrag(): void {
    this.dragStartX = null;
    this.draggedProductId = null;
  }

  // ==========================================
  // PRODOTTI SELEZIONATI
  // ==========================================

  selectedIds: number[] = [];

  isSelected(productId: number): boolean {
    return this.selectedIds.includes(productId);
  }

  toggleSelection(productId: number): void {

    if (this.isSelected(productId)) {

      this.selectedIds = this.selectedIds.filter(
        id => id !== productId
      );

    } else {

      this.selectedIds = [
        ...this.selectedIds,
        productId
      ];

    }

  }

  clearSelection(): void {
    this.selectedIds = [];
  }

  // ==========================================
  // AGGIUNTA MULTIPLA AL CARRELLO
  // ==========================================

  addSelectedToCart(): void {

    const selectedProducts = this.products.filter(
      product => this.selectedIds.includes(product.id)
    );

    if (selectedProducts.length === 0) {
      return;
    }

    // Il carrello condiviso sarà collegato
    // in un passaggio successivo.

    console.log(
      'Funko selezionati per il carrello:',
      selectedProducts
    );

    alert(
      `${selectedProducts.length} Funko selezionati! ` +
      'Il collegamento al carrello sarà il prossimo passaggio.'
    );

  }

}
