import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const appRoutes: Routes = [
  { path: "", redirectTo: "/recipes", pathMatch: "full" }
];

const appChildRoutes: Routes = [
  {path: "recipes", loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes), RouterModule.forChild(appChildRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
