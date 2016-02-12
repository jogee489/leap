class RecipesController < ApplicationController

	def save_recipe_json
		
	end
	
	def searchRecipes
	end

	def index
		@recipeList = Recipe.all.page(params[:page]).per_page(4)

	end

	def list
		@recipeList = Recipe.all.page(params[:page]).per_page(4)
	end

	def show
		@recipe = Recipe.find(params[:id])
		if @recipe.blank?
			flash[:error] = 'The recipe you are looking for has disappeared..'
			render action: 'list'

		end

	end

	def new
		@recipe = Recipe.new()
	end

	def create
		@recipe = Recipe.new(recipe_params)
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


  private
    def recipe_params                                                                                                                         
      params.require(:recipe).permit(:title, :ingredients, :directions)
    end
	
end
