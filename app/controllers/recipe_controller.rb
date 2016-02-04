class RecipeController < ApplicationController

	def save_recipe_json
		
	end

	def list
		@recipeList = Recipe.all
	end
	
end