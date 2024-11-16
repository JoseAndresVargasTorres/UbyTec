import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AffiliateShopsComponent } from './components/affiliate-shops/affiliate-shops.component';
import { PurchaseHistoryComponent } from './components/purchase-history/purchase-history.component';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full', // Redirige a Dashboard por defecto
  },
  {
    path: 'dashboard',
    component: DashboardComponent, // Ruta principal que contiene AffiliateShops y PurchaseHistory
  },
  {
    path: 'affiliate-shops',
    component: AffiliateShopsComponent, // Página independiente de Comercios Afiliados (opcional)
  },
  {
    path: 'purchase-history',
    component: PurchaseHistoryComponent, // Página independiente del Historial de Compras (opcional)
  },
  {
    path: '**',
    redirectTo: '/dashboard', // Redirige cualquier ruta no encontrada al Dashboard
  },
];
