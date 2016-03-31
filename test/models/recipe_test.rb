require 'test_helper'

class RecipeTest < ActiveSupport::TestCase

  context 'On a new recipe' do
  	setup { @recipe = Factory.create(:recipe) }
  	
  	should 'ensure title is unique' do
  	  recipe2 = Recipe.create(title: 'Original Title')
  	  recipe2.update_attributes(title: 'New Title')
  	  assert_equals 'Original Title', recipe2.title
  	end
  	
  end
end