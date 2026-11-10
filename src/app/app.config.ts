import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() =>
      initializeApp({
   apiKey: "AIzaSyBB1gu4SGdJ5MZykhc1Wz_mOwx76jI7gmE",
  authDomain: "apic-2746d.firebaseapp.com",
  projectId: "apic-2746d",
  storageBucket: "apic-2746d.firebasestorage.app",
  messagingSenderId: "260772527486",
  appId: "1:260772527486:web:9f9b028c4bfaa64623472f"
      }),
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
