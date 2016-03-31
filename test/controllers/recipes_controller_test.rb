require 'test_helper'

class RecipesControllerTest < ActionController::TestCase
  
  context 'With a list of recipes in JSON' do
  	setup do
  	  @recipe_list_json << <<-EOS
  	  [
  	  	{title: 'recipe1', ingredients: 'ingredients1', directions: 'directions1'},
  	  	{title: 'recipe2', ingredients: 'ingredients2', directions: 'directions2'},
  	  	{title: 'recipe3', ingredients: 'ingredients3', directions: 'directions3'}
  	  ]
  	  EOS
  	end

  	should 'save list of recipes' do
  	  post :save_recipe_list, params[:recipeList] = @recipe_list_json
  	  assert_equal 3, Recipe.count
  	end

  end
end