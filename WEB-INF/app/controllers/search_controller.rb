require 'json'

class SearchController < ActionController::Base
	def index

	end

	def show
		recipeData = %x(python ~/workspaces/leap/leap/script/foodSearcher.py)
		@recipeList = JSON.parse(recipeData)
		@recipeList.each {|recipe|
			instance = Recipe.create(recipe)
		}
		#@recipeList = Recipe.all
	end

	def list
		@recipeList = Recipe.all
	end

end