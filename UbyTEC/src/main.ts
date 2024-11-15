import { bootstrapApplication } from '@angular/platform-browser';
import { ClientManagementComponent } from './app/client-management/client-management.component';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';

bootstrapApplication(ClientManagementComponent, {
  providers: [provideRouter(routes)]  // Proveedor de rutas
});
