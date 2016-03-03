require 'docx'

class RecipesController < ApplicationController

	def save_recipe_json
		@recipe = Recipe.new(JSON.parse(params[:recipe]))
		if @recipe.save
			puts "saved properly"
		end

		#respond_with @recipe
		render nothing: true
	end

	def save_recipe_list
		raw_json = params[:recipeList]
		puts raw_json
		#recipe_list = JSON.parse(params[:recipeList])
		recipes = raw_json.collect { |attributes| JSON.decode(attribues) }
		puts recipes
		recipes.each do |recipe_data|
			recipe = Recipe.new(recipe_data)
			recipe.save
		end
		return
	end
	
	def search_new
       render "recipes/search_new"
	end

	def index
		@recipeList = Recipe.all.page(params[:page])
		redirect_to action: 'list'
	end

	def list
		@recipeList = Recipe.all.page(params[:page]).per_page(15)
	end

	def show
		@recipe = Recipe.find(params[:id])
		if @recipe.blank?
			flash[:error] = 'The recipe you are looking for has disappeared..'
			render action: 'list'

		end

	end

	def new
		@recipe = Recipe.new
	end

	def create
		@recipe = Recipe.new(recipe_params)
		if (@recipe.save) 
			flash[:notice] = 'The new recipe was successfully added.'
			redirect_to action: 'show', id: @recipe.id
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
