require 'json'

class SearchController < ActionController::Base
	def index

	end

	def show
		recipeData = %x(python ~/workspaces/leap/leap/script/scraping.py)
		@recipe = JSON.parse(recipeData)
	end

end