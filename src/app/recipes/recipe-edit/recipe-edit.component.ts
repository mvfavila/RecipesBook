import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";
import { FormGroup, FormControl, FormArray, Validators } from "@angular/forms";
import { RecipeService } from "../recipe.service";
import { Ingredient } from "src/app/shared/ingredient.model";

@Component({
  selector: "app-recipe-edit",
  templateUrl: "./recipe-edit.component.html",
  styleUrls: ["./recipe-edit.component.css"]
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  idSubscription: Subscription;
  id: number;
  isEditMode = false;
  recipeForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService
  ) {}

  ngOnInit() {
    this.idSubscription = this.route.params.subscribe((params: Params) => {
      this.id = +params.id;
      this.isEditMode = params.id != null;
      this.initForm();
    });
  }

  onSubmit() {}

  getIngredients() {
    return this.recipeForm.get("ingredients") as FormArray;
  }

  onAddIngredient() {
    this.getIngredients().push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    );
  }

  ngOnDestroy() {
    this.idSubscription.unsubscribe();
  }

  private createIngredientsControls(ingredients: Ingredient[]): FormControl[] {
    const ingredientsControls = [];
    ingredients.forEach(ingredient => {
      ingredientsControls.push(
        new FormGroup({
          name: new FormControl(ingredient.name, Validators.required),
          amount: new FormControl(ingredient.amount, [
            Validators.required,
            Validators.pattern(/^[1-9]+[0-9]*$/)
          ])
        })
      );
    });
    return ingredientsControls;
  }

  private initForm() {
    let recipeName = "";
    let imagePath = "";
    let description = "";
    let ingredients = [];

    if (this.isEditMode) {
      const editedRecipe = this.recipeService.getRecipe(this.id);
      recipeName = editedRecipe.name;
      imagePath = editedRecipe.imagePath;
      description = editedRecipe.description;
      ingredients = editedRecipe.ingredients;
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(imagePath, Validators.required),
      description: new FormControl(description, Validators.required),
      ingredients: new FormArray(this.createIngredientsControls(ingredients))
    });
  }
}
