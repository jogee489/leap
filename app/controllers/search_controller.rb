require 'json'
require 'shellwords'

class SearchController < ApplicationController
	def index

	end

	def show
		# Shell words here is for security reasons.
		recipeData = %x(python ~/workspaces/leap/leap/script/foodSearcher.py #{Shellwords.escape(params[:searchString])})
		@recipeList = JSON.parse(recipeData)
		#@recipeList.each {|recipe|
		#	instance = Recipe.create(recipe)
		#}
		render layout: false #this page does not need the layout on top of it.
	end

	def saveRecipe
		Recipe.create(title: params[:title], ingredients: params[:ingredients], directions: params[:directions])
	end

	def list
		@recipeList = Recipe.all
	end

	def generate
		@category_list = Category.sorted
	end

	def web_crawl
		require 'rubygems'
		require 'nokogiri'   
		require 'open-uri'

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
		MAX_NUM_OF_RECIPES = 3
		
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
		
		### THIS WILL NEED TO RENDER THE RESULTS PAGE ###
		render status: 200
		end

	end		