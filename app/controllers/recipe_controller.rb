class RecipeController < ApplicationController

	def save_recipe_json
		
	end
	
	def searchRecipes
	end

	def index
		@recipeList = Recipe.all
	end

	def list
		@recipeList = Recipe.all
	end

	def show
		@recipe = Recipe.find(params[:id])
		if @recipe.blank?
			flash[:error] = 'The recipe you are looking for has dissapeared..'
			render action: 'list'
		end
	end

	def new
		@recipe = Recipe.new(params[:recipe])
	end

	def create
		@recipe = Recipe.new(params[:recipe])
		if (@recipe.save) 
			flash[:notice] = 'The new recipe was successfully added.'
			redirect_to :action => 'show', :id => @recipe.id
		else 
			render action: 'new'
		end
	end

	def edit
		@recipe = Recipe.find(params[:id])
	end

	def update
		@recipe = Recipe.find(params[:id])
	end

	def destroy
		@recipe = Recipe.find(params[:id]).destroy
    	redirect_to(:action => 'index')
	end
	
end