import { Recipe } from "./recipe.model";
import { Ingredient } from "../shared/ingredient.model";
import { Subject } from "rxjs";

export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();
  // private recipes: Recipe[] = [
  //   new Recipe(
  //     "First recipe",
  //     "Description",
  //     "https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_1280.jpg",
  //     [new Ingredient("Meat", 1), new Ingredient("French fries", 20)]
  //   ),
  //   new Recipe(
  //     "Crabs",
  //     "Best food ever",
  //     "https://upload.wikimedia.org/wikipedia/commons/1/14/Caranguejo_de_Sergipe.jpg",
  //     [new Ingredient("Crab", 6), new Ingredient("Vinagrete", 3)]
  //   )
  // ];
  private recipes: Recipe[] = [];

  getRecipes() {
    // slice so it returns by value and not by reference
    return this.recipes.slice();
  }

  getRecipe(id: number) {
    return this.recipes[id];
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.getRecipes());
  }

  updateRecipe(index: number, recipe: Recipe) {
    this.recipes[index] = recipe;
    this.recipesChanged.next(this.getRecipes());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.getRecipes());
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.getRecipes());
  }
}
