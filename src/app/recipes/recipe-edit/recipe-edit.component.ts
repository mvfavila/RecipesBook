import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { FormGroup, FormControl, FormArray, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";

import { Ingredient } from "src/app/shared/ingredient.model";
import * as fromApp from "src/app/store/app.reducer";
import * as RecipeActions from "../store/recipe.actions";

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

  private storeSub: Subscription;

  get ingredientsControls() {
    return this.getIngredients().controls;
  }

  getIngredients() {
    return this.recipeForm.get("ingredients") as FormArray;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.idSubscription = this.route.params.subscribe((params: Params) => {
      this.id = +params.id;
      this.isEditMode = params.id != null;
      this.initForm();
    });
  }

  onSubmit() {
    if (this.isEditMode) {
      this.store.dispatch(
        RecipeActions.updateRecipe({
          index: this.id,
          recipe: this.recipeForm.value
        })
      );
    } else {
      this.store.dispatch(RecipeActions.addRecipe(this.recipeForm.value));
    }
    this.router.navigate(["../"], { relativeTo: this.route });
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

  onCancel() {
    this.router.navigate(["../"], { relativeTo: this.route });
  }

  onDeleteIngredient(index: number) {
    this.getIngredients().removeAt(index);
  }

  ngOnDestroy() {
    if (this.idSubscription) {
      this.idSubscription.unsubscribe();
    }
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
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
      this.storeSub = this.store
        .select("recipe")
        .pipe(
          map(recipeState => {
            return recipeState.recipes.find((_, index) => {
              return index === this.id;
            });
          })
        )
        .subscribe(editedRecipe => {
          recipeName = editedRecipe.name;
          imagePath = editedRecipe.imagePath;
          description = editedRecipe.description;
          ingredients = editedRecipe.ingredients;
        });
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(imagePath, Validators.required),
      description: new FormControl(description, Validators.required),
      ingredients: new FormArray(this.createIngredientsControls(ingredients))
    });
  }
}
