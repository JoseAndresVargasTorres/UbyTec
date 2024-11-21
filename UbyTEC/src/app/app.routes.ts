import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HeaderAdminComponent } from './admin/components/header-admin/header-admin.component';
import { GestionarAdministradoresComponent } from './admin/pages/gestionar-administradores/gestionar-administradores.component';
import { GestionAdministradorComponent } from './affiliate/pages/gestion-administrador/gestion-administrador.component';
import { GestionarAfiliacionesComponent } from './admin/pages/gestionar-afiliaciones/gestionar-afiliaciones.component';
import { GestionarAfiliadosComponent } from './admin/pages/gestionar-afiliados/gestionar-afiliados.component';
import { GestionarRepartidoresComponent } from './admin/pages/gestionar-repartidores/gestionar-repartidores.component';
import { GestionarTiposdeComercioComponent } from './admin/pages/gestionar-tiposde-comercio/gestionar-tiposde-comercio.component';
import { ReportesConsolidadodeVentasComponent } from './admin/pages/reportes-consolidadode-ventas/reportes-consolidadode-ventas.component';
import { HeaderClientComponent } from './client/components/header-client/header-client.component';
import { GestionClientesComponent } from './client/pages/gestion-clientes/gestion-clientes.component';
import { EntrarComercioComponent } from './client/pages/entrar-comercio/entrar-comercio.component';
import { SolicitudAfiliacionComponent } from './affiliate/pages/solicitud-afiliacion/solicitud-afiliacion.component';
import { GestionProductosComponent } from './affiliate/pages/gestion-productos/gestion-productos.component';
import { GestionPedidosComponent } from './affiliate/pages/gestion-pedidos/gestion-pedidos.component';
import { EdicionAdministradorComponent } from './affiliate/pages/edicion-administrador/edicion-administrador.component';


export const routes: Routes = [

  {path: "", component:LoginComponent},
  {path: "header",component:HeaderAdminComponent},
  {path:"gestion-administradores",component:GestionarAdministradoresComponent},
  {path:"gestion-afiliaciones",component:GestionarAfiliacionesComponent},
  {path:"gestion-afiliados",component:GestionarAfiliadosComponent},
  {path:"gestion-repartidores",component:GestionarRepartidoresComponent},
  {path:"gestion-tiposcomercio",component:GestionarTiposdeComercioComponent},
  {path:"reportes-ventas",component:ReportesConsolidadodeVentasComponent},
  {path:"headerclient",component:HeaderClientComponent},
  {path:"gestion-clientes",component:GestionClientesComponent},
  {path:"entrar-comercios", component:EntrarComercioComponent},
  {path:"solicitud-afiliaciones", component:SolicitudAfiliacionComponent},
  {path:"gestion-productos", component:GestionProductosComponent},
  {path:"gestion-pedidos", component:GestionPedidosComponent},
  {path:"gestion-administrador", component:GestionAdministradorComponent},
  {path:"edicion-administrador", component:EdicionAdministradorComponent}
];
