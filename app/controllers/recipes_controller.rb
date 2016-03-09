require 'docx'

class RecipesController < ApplicationController

	def save_recipe_json
		@recipe = Recipe.new(JSON.parse(params[:recipe]))
		if @recipe.save
			puts "saved properly"
		end

		render nothing: true
	end

	def save_recipe_list
		raw_json = params[:recipeList]
		recipes = raw_json.collect { |attributes| JSON.parse(attribues) }
		puts recipes
		recipes.each do |recipe_data|
			recipe = Recipe.new(recipe_data)
			recipe.save
		end
		return
	end
	
	def search_new
       @category_list = Category.all
	end

	def index
		@recipeList = Recipe.all.page(params[:page])
		redirect_to action: 'list'
	end

	def list
		@recipeList = Recipe.all.page(params[:page]).per_page(15)
	end

	def show
		redirect_to action: 'index'
	end

	def new
		@recipe = Recipe.new
	end

	def create
		@recipe = Recipe.new(recipe_params)
		if (@recipe.save) 
			flash[:notice] = 'The new recipe was successfully added.'
			redirect_to action: 'index'
		else 
			render action: 'new'
		end
	end

	def edit
		@recipe = Recipe.find(params[:id])
	end

	def update
		@recipe = Recipe.find(params[:id])
		recipe_data = JSON.parse(params[:recipe])
		puts recipe_data
		@recipe.update_attributes!(JSON.parse(params[:recipe]))
		@recipe.save

		redirect_to(action: list)
	end

	def destroy
		@recipe = Recipe.find(params[:id]).destroy
    	redirect_to(:action => 'index')
	end

	def destroy_multiple
		recipe_ids = JSON.parse(params[:recipe_ids])
		puts recipe_ids
		recipe_ids.each do |id|
			recipe = Recipe.find(id) #to_f
			recipe.destroy if recipe.present?
		end
		render nothing: true
	end

	def upload
	end

	def display_upload
		file = params[:recipe][:file]
		doc = Docx::Document.open(params[:recipe][:file].path)
		@recipe_list = []
		@recipe_data = ''
		@recipe = Recipe.new
		@state = 0
		doc.paragraphs.each do |p|
			temp = "#{p}".strip + "\n"
			@recipe_data << temp unless temp.blank?
			parse_document temp.strip unless temp.blank?
		end
		@recipe_list << @recipe
	end


  private
    def recipe_params                                                                                                                         
      params.require(:recipe).permit(:title, :ingredients, :directions)
    end

  	def parse_document(text)
  		return nil if text.blank?
  		if text == 'TITLE' && @state == 2
  			@state = 0
  			@recipe_list << @recipe
  			@recipe = Recipe.new
  		elsif text == 'INGREDIENTS'
  			@state = 1
  		elsif text == 'DIRECTIONS'
  			@recipe.ingredients = @recipe.ingredients.chomp ', '
  			@state = 2
  		elsif @state == 0 && text != 'TITLE'
  			@recipe.title = text
  		elsif @state == 1
  			@recipe.ingredients ||= ''
  			@recipe.ingredients << "#{text}, "
  		elsif @state == 2
  			@recipe.directions ||= ''
  			@recipe.directions << text
  		end
  			
  	end
	
end
