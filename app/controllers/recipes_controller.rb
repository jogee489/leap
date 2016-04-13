require 'docx'
require 'rubygems'
require 'nokogiri'   
require 'open-uri'

class RecipesController < ApplicationController
	MAX_NUM_OF_RECIPES = 3

	def save_recipe_json
		@recipe = Recipe.new(JSON.parse(params[:recipe]))
		if @recipe.save
			puts "saved properly"
		end

		render nothing: true
	end

	def save_recipe_list
		raw_json = params[:recipeList]
		raw_json.each do |attributes|
			recipe = Recipe.new(JSON.parse(attributes)) 
			recipe.save
		end
		render status: 200, nothing: true
	end
	
	def search_new
		if params[:search]
			@category_list = Category.search(params[:search])
       	else
       		@category_list = Category.sorted
       	end
	end

	def index
		redirect_to action: 'list'
	end

	def list
		if params[:search]
			if params[:sort]
				@recipe_list = Recipe.search(params[:sort], params[:search]).sorted.page(params[:page]).per_page(15)
			else
				@recipe_list = Recipe.search('title', params[:search]).sorted.page(params[:page]).per_page(15)
			end
		else
			@recipe_list = Recipe.sorted.page(params[:page]).per_page(15)
		end
	end

	#def show
	#	redirect_to action: 'destroy'
	#end

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

		redirect_to(action: 'list')
	end

	def destroy
		@recipe = Recipe.find(params[:id]).destroy
		puts params[:id]
    	redirect_to(action: 'index')
	end

	def destroy_multiple
		recipe_ids = JSON.parse(params[:recipe_ids])
		puts recipe_ids
		recipe_ids.each do |id|
			recipe = Recipe.find(id)

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

	def search_online
		$recipe_list = web_crawl_blog if params[:foods_to_include].present?
		if $recipe_list
			render status: 200, nothing: true
		else
			render status: 404, nothing: true
		end
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

  	def web_crawl_blog
		# Variables
		@recipeList = []
		page_url = "http://realfitrealfoodmom.com/?s=-blog+recipe"
		foods_include = params[:foods_to_include]
		foods_exclude = params[:foods_to_exclude]
		num_of_recipes = 0
		j = 0

		# Construct initial URL method
		def constructInitialURL(baseURL, food_items)
			food_items.each {|food| baseURL << "+#{food}"}
			baseURL << '&submit=Go'
		end

		# Iterate through food items to construct page_url.
		constructInitialURL(page_url, foods_include)
		
		# Request and open the page.
		page = Nokogiri::HTML(open(page_url))   
		
		# get <a> tags which contains recipe links.
		temp_partial_links = page.css("h1.entry-title a")
		# keep only href links.
		recipe_links = temp_partial_links.map{|element| element["href"]}.compact
		
		while j < (recipe_links.count - 1)  and num_of_recipes < MAX_NUM_OF_RECIPES do
			method_flag = true # Flag indicating which method to use to find directions.
			# Open the page
			recipe_page = Nokogiri::HTML(open(recipe_links[j]))
			# Grab the recipe title
			title = recipe_page.at_css("h1.entry-title").text

			# gather ingredients.
			unorganized_ingredients = []
			ingredients = []
			unorganized_ingredients = recipe_page.css("li.ingredient")
			# try a new method if ingredients were not found.
			if unorganized_ingredients.blank?
				##### Issue with multiple ul inside div.entry-content
				ul = recipe_page.css("div.entry-content ul")
				if (ul.count > 1 or ul.count == 0)
					j += 1
					next
				end
				unorganized_ingredients = recipe_page.css("div.entry-content li")
				method_flag = false
			end
			# give up on parsing this page and try another link
			if unorganized_ingredients.blank?
				j += 1
				next
			end
			unorganized_ingredients.each {|item| ingredients.push item.text}

			# gather directions.
			unorganized_directions = []
			directions = []
			if method_flag
				unorganized_directions = recipe_page.css("li.instruction")
				unorganized_directions.each { |direction| directions.push direction.text}
			else
				ul = recipe_page.at_css("div.entry-content ul")
				if ul
					directions = ul.next_element.text.split(". ")
				end
			end

			j += 1
			num_of_recipes += 1

			@recipeList.push(Recipe.new(title: title, ingredients: ingredients, directions: directions))
		end
		
		return @recipeList
  	end

  	def web_crawl

		#########################################################
		############ End of Recipe class definition #############
		#########################################################
		
		
		################## Construct initial URL method #########
		def constructInitialURL(baseURL, food_items)
			for i in 0..(food_items.count-1)
				baseURL << food_items[i]
				if i!=(food_items.count-1)
					baseURL << "%20"
				end
			end
		end	
		################## End of Construct initial URL method ##
		
		
		################################################################################
		################################################################################
		
		################## Define variables #####################
		# Page URL base.
		PAGE_URL = "http://allrecipes.com/search/results/?wt="
		
		# food_to_include, food_to_exclude, number_of_recipes.
		# foods_include, foods_exclude, num_of_recipe = ARGV
		foods_include = params[:foods_to_include]
		
		foods_exclude = params[:foods_to_exclude]
		
		# Number of recipes.
		num_of_recipes = 0
		################## End of variable definitions ##########
		
		
		################## End of Assigning args ##########################
		
		# Iterate through food items to construct page_url.
		constructInitialURL(PAGE_URL, foods_include)
		puts(PAGE_URL)
		
		# Request and open the page.
		page = Nokogiri::HTML(open(PAGE_URL))   
		
		# get <a> tags which contains recipe links.
		temp_partial_links = []
		temp_partial_links = page.css("article.grid-col--fixed-tiles a")
		
		# keep only href links.
		temp_partial_links = temp_partial_links.map{|element| element["href"]}.compact
		
		# process it so we get only /recipe/
		partials = []
		
		for i in 0..(temp_partial_links.count - 1)
			if temp_partial_links[i].include?("/recipe/")
				partials.push temp_partial_links[i]
			end
		end
		
		# get rid of the every second links.
		partial_links = []
		
		for i in 0..(partials.count - 1)
			if i%2 == 0
				partial_links.push partials[i]
			end
		end
		
		# make full links for each recipe for later traverse.
		fullRecipeLinks = []
		for i in 0..(partial_links.count - 1)
			l="http://allrecipes.com"
			l << partial_links[i]
			fullRecipeLinks.push l
			#puts fullRecipeLinks[i]
		end
		
		# Make a list of empty tempRecipes.
		

		puts fullRecipeLinks
		puts fullRecipeLinks.count
		# recipe page.
		@recipeList = []
		recipe_page = []
		j = 0
		while j < (fullRecipeLinks.count - 1)  and num_of_recipes < MAX_NUM_OF_RECIPES do

			recipe_page[j] = Nokogiri::HTML(open(fullRecipeLinks[j]))

			title = recipe_page[j].at_css("h1.recipe-summary__h1").text
			puts title
			
			# gather ingredients.
			unorganized_Ingredients = []
			ingredients = []
			unorganized_Ingredients = recipe_page[j].css("span.recipe-ingred_txt.added")
			
			for i in 0..(unorganized_Ingredients.count - 3)
				ingredients.push unorganized_Ingredients[i].text
				puts unorganized_Ingredients[i].text
			end
			
			# gather directions.
			unorganized_directions = []
			directions = []
			unorganized_directions = recipe_page[j].css("span.recipe-directions__list--item")
			
			for i in 0..(unorganized_directions.count - 2)
				directions.push unorganized_directions[i].text
				puts directions[i]
			end

			puts j
			j += 1
			num_of_recipes += 1
			puts

			@recipeList.push(Recipe.new(title: title, ingredients: ingredients, directions: directions))
		end
		
		return @recipeList
		end
	
end
