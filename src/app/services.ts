import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AppAuthService {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(Auth);
  private readonly productsRef = collection(this.firestore, 'products');

  async addProduct(product: {
    name: string;
    quantity: number;
    unit: string;
    location: string;
    minQuantity: number;
  }) {
    try {
      const docRef = await addDoc(this.productsRef, product);
      console.log("Document écrit avec l'ID : ", docRef.id);
    } catch (error) {
      console.error("Erreur lors de l'ajout du document : ", error);
    }
  }

  async userSignIn(username: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        username,
        password,
      );
      console.log('User signed in: ', userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error('Erreur lors de sign in : ', error);
      throw new Error(this.getAuthErrorMessage(error));
    }
  }

  async userLogin(username: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        username,
        password,
      );
      console.log('User logged in: ', userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error('Erreur lors de login : ', error);
      throw new Error(this.getAuthErrorMessage(error));
    }
  }

  async userLogout() {
    await signOut(this.auth);
  }

  private getAuthErrorMessage(error: unknown): string {
    const code =
      typeof error === 'object' && error !== null && 'code' in error
        ? String((error as { code?: unknown }).code)
        : '';

    switch (code) {
      case 'auth/operation-not-allowed':
        return 'Email/mot de passe non active dans Firebase Console > Authentication > Sign-in method.';
      case 'auth/email-already-in-use':
        return 'Cet email est deja utilise.';
      case 'auth/invalid-email':
        return 'Adresse email invalide.';
      case 'auth/weak-password':
        return 'Mot de passe trop faible (minimum 6 caracteres).';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Identifiants invalides.';
      case 'auth/too-many-requests':
        return 'Trop de tentatives. Reessayez plus tard.';
      default:
        return 'Erreur d\'authentification. Verifiez la configuration Firebase.';
    }
  }
}


