import { Routes, RouterModule } from '@angular/router';
import { LocationStrategy} from '@angular/common';

import { AppComponent } from './app.component';

import { GridComponent } from './grid/grid.component';

const routes: Routes = [
  { path: '', redirectTo: 'grid', pathMatch: 'full' },
  { path: 'grid', component: GridComponent },
  { path: 'grid/:campaign', component: GridComponent },
  { path: 'grid/:campaign/:version', component: GridComponent },
  ];

export const routing = RouterModule.forRoot(routes);
