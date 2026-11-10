import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Mypantry } from '../mypantry';
import { PantryProductDocument } from '../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-stock',
  imports: [AsyncPipe, UpperCasePipe, FormsModule],
  templateUrl: './stock.html',
  styleUrl: './stock.css',
})
export class Stock {
  private readonly myPantryService = inject(Mypantry);

  readonly products$: Observable<PantryProductDocument[]> =
    this.myPantryService.getProducts();

  readonly editingId = signal<string | null>(null);
  readonly editDraft = signal<
    Pick<PantryProductDocument, 'quantity' | 'unit' | 'location' | 'minQuantity'> | null
  >(null);
  readonly pendingDeleteId = signal<string | null>(null);
  readonly pendingSaveId = signal<string | null>(null);

  startEdit(product: PantryProductDocument) {
    if (!product.id) {
      return;
    }

    this.editingId.set(product.id);
    this.editDraft.set({
      quantity: product.quantity,
      unit: product.unit,
      location: product.location,
      minQuantity: product.minQuantity,
    });
  }

  cancelEdit() {
    this.editingId.set(null);
    this.editDraft.set(null);
  }

  async saveEdit(productId?: string) {
    const draft = this.editDraft();
    if (!productId || !draft) {
      return;
    }

    this.pendingSaveId.set(productId);
    try {
      await this.myPantryService.updateProduct(productId, draft);
      this.cancelEdit();
    } catch (error) {
      console.error('Erreur lors de la mise a jour : ', error);
    } finally {
      this.pendingSaveId.set(null);
    }
  }

  async deleteProduct(productId?: string) {
    if (!productId) {
      return;
    }

    this.pendingDeleteId.set(productId);
    try {
      await this.myPantryService.deleteProduct(productId);
    } catch (error) {
      console.error('Erreur lors de la suppression : ', error);
    } finally {
      this.pendingDeleteId.set(null);
    }
  }
}
