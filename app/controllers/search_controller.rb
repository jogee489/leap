require 'json'

class SearchController < ApplicationController
	def index

	end

	def saveRecipe
		Recipe.create(title: params[:title], ingredients: params[:ingredients], directions: params[:directions])
	end

	def list
		@recipeList = Recipe.all
	end

	def generate
	end

	def find_recipes
		food_items = JSON.parse(params[:food_items])
		avoid_items = JSON.parse(params[:avoid_items])
		recipe_set = Recipe.ingredients_search(food_items) if food_items.present?
		@recipe_list = []

		if recipe_set.present?
			recipe_set.each_with_index do |recipe, i|
				@recipe_list[i] = create_parallel_array(recipe, avoid_items, food_items)
			end
		end
		
		@recipe_list ||= Recipe.all
		render partial: 'find_recipes' 
	end

	def select_foods
		@category_list = Category.sorted
		render partial: 'select_foods'
	end

	def generate_meal_plan
		meal_plan_data = JSON.parse(params[:meal_plan_data])
		@foods_to_have = meal_plan_data['to_have']
		@foods_to_avoid = meal_plan_data['to_avoid']
		@recipe_list = Recipe.find(meal_plan_data['recipe_ids'])
		
		render partial: 'generate_meal_plan'
	end

	def create_parallel_array(recipe, avoid, have)
		puts recipe
		curr_parallel = []
		index = 0
		recipe.formatIngredients.split("\n").each do |ingredient|
			if avoid.present?
				avoid.each do |item|
					if ingredient.downcase.include? item.downcase
						curr_parallel[index] = -1
					end
				end
			end		
			if have.present?
				have.each do |item|
					if ingredient.downcase.include? item.downcase
						curr_parallel[index] = 1
					end
				end
			end
			index += 1
		end
		#convert recipe to hash and add the parallel array to it
		recipe = recipe.attributes.symbolize_keys
		recipe[:parallel] = curr_parallel
		recipe
	end
end	