import {
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
} from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  Firestore,
  addDoc,
  collectionData,
  collection,
  deleteDoc,
  doc,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable, from, switchMap } from 'rxjs';

import { OpenFoodFactsProduct, PantryProductDocument } from './models';

@Injectable({
  providedIn: 'root',
})
export class Mypantry {
  private readonly firestore = inject(Firestore);
  private readonly injector = inject(EnvironmentInjector);
  private readonly auth = inject(Auth);

  private readonly productsRef = collection(this.firestore, 'products');

  private async getRequiredUser() {
    await this.auth.authStateReady();
    const currentUser = this.auth.currentUser;

    if (!currentUser) {
      throw new Error('Aucun utilisateur connecte. Veuillez vous connecter.');
    }

    return currentUser;
  }

  async addProduct(product: {
    name: string;
    product?: OpenFoodFactsProduct;
    product_name?: string;
    brands?: string;
    image_front_url?: string;
    code?: string;
    categories?: string;
    nutriscore_grade?: PantryProductDocument['nutriscore_grade'];
    quantity: number;
    unit: string;
    location: string;
    minQuantity: number;
  }) {
    try {
      const user = await this.getRequiredUser();

      const docRef = await runInInjectionContext(this.injector, () =>
        addDoc(this.productsRef, {
          ...product,
          ownerId: user.uid,
          createdAt: serverTimestamp(),
        }),
      );
      console.log("Document écrit avec l'ID : ", docRef.id);
    } catch (error) {
      console.error("Erreur lors de l'ajout du document : ", error);
    }
  }

  getProducts(): Observable<PantryProductDocument[]> {
    return from(this.getRequiredUser()).pipe(
      switchMap((user) => {
        const ownedProductsQuery = query(
          this.productsRef,
          where('ownerId', '==', user.uid),
        );

        return collectionData(ownedProductsQuery, {
          idField: 'id',
        }) as Observable<PantryProductDocument[]>;
      }),
    );
  }

  async updateProduct(
    productId: string,
    updates: Pick<PantryProductDocument, 'quantity' | 'unit' | 'location' | 'minQuantity'>,
  ) {
    const productRef = doc(this.productsRef, productId);
    await updateDoc(productRef, updates);
  }

  async deleteProduct(productId: string) {
    const productRef = doc(this.productsRef, productId);
    await deleteDoc(productRef);
  }
   async deconnectUser() {
    await this.getRequiredUser();
    await this.auth.signOut();
  }
}

  
 
