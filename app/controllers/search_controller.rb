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
end