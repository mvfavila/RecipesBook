import { Recipe } from "./recipe.model";

export class RecipeService {
  private recipes: Recipe[] = [
    new Recipe(
      "First recipe",
      "Description",
      "https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_1280.jpg"
    ),
    new Recipe(
      "Crabs",
      "Best food ever",
      "https://upload.wikimedia.org/wikipedia/commons/1/14/Caranguejo_de_Sergipe.jpg"
    )
  ];

  getRecipes() {
    // slice so it returns by value and not by reference
    return this.recipes.slice();
  }
}
