import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "home",
    loadChildren: () =>
      import("./home/home.module").then((m) => m.HomePageModule),
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "log-sleep",
    loadChildren: () =>
      import("./log-sleep/log-sleep.module").then((m) => m.LogSleepPageModule),
  },  {
    path: 'rate-tiredness',
    loadChildren: () => import('./rate-tiredness/rate-tiredness.module').then( m => m.RateTirednessPageModule)
  },
  {
    path: 'view-data',
    loadChildren: () => import('./view-data/view-data.module').then( m => m.ViewDataPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
