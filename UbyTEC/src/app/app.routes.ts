import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HeaderAdminComponent } from './admin/components/header-admin/header-admin.component';
import { GestionarAdministradoresComponent } from './admin/pages/gestionar-administradores/gestionar-administradores.component';
import { GestionarAfiliacionesComponent } from './admin/pages/gestionar-afiliaciones/gestionar-afiliaciones.component';
import { GestionarAfiliadosComponent } from './admin/pages/gestionar-afiliados/gestionar-afiliados.component';
import { GestionarRepartidoresComponent } from './admin/pages/gestionar-repartidores/gestionar-repartidores.component';
import { GestionarTiposdeComercioComponent } from './admin/pages/gestionar-tiposde-comercio/gestionar-tiposde-comercio.component';
import { ReportesConsolidadodeVentasComponent } from './admin/pages/reportes-consolidadode-ventas/reportes-consolidadode-ventas.component';
import { SolicitudAfiliacionComponent } from './affiliate/pages/solicitud-afiliacion/solicitud-afiliacion.component';
import { HeaderAffiliateComponent } from './affiliate/components/header/header-affiliate.component';
import { GestionProductosComponent } from './affiliate/pages/gestion-productos/gestion-productos.component';
import { GestionPedidosComponent } from './affiliate/pages/gestion-pedidos/gestion-pedidos.component';

export const routes: Routes = [

  {path: "", component:LoginComponent},
  {path: "header",component:HeaderAdminComponent},
  {path:"gestion-administradores",component:GestionarAdministradoresComponent},
  {path:"gestion-afiliaciones",component:GestionarAfiliacionesComponent},
  {path:"gestion-afiliados",component:GestionarAfiliadosComponent},
  {path:"gestion-repartidores",component:GestionarRepartidoresComponent},
  {path:"gestion-tiposcomercio",component:GestionarTiposdeComercioComponent},
  {path:"reportes-ventas",component:ReportesConsolidadodeVentasComponent},
  {path:"solicitud-afiliaciones", component:SolicitudAfiliacionComponent},
  {path:"negocio-header", component: HeaderAffiliateComponent},
  {path:"gestion-productos", component:GestionProductosComponent},
  {path:"gestion-pedidos", component:GestionPedidosComponent}
];
