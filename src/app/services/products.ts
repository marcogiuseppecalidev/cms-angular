
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
}

@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    private http = inject(HttpClient);

    private apiUrl = 'http://localhost:5008/api/Products';

    getProducts() {
        return this.http.get<Product[]>(this.apiUrl);
    }

    updateProduct(id: number, product: Partial<Product>) {
        return this.http.patch<Product>(
            `${this.apiUrl}/${id}`,
            product
        );
    }
}
