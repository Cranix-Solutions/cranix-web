import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./public/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'public',
    loadChildren: () => import('./public/public.module').then(m => m.PublicPageModule)
  },
  {
    path: 'pages',
    loadChildren: () => import('./protected/protected.module').then(m => m.ProtectedPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      {
        preloadingStrategy: PreloadAllModules
        //,enableTracing: true
      })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
  
}