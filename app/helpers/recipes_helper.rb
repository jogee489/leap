# Methods in this module will relate directly to forms that are used ..
module RecipesHelper

	# Render table for listing recipes
	def recipe_list(recipes)
		#button_to when path is present
		recipe_table = ''
		
		recipes.each_with_index do |recipe, index|
			

			id_element = add_form_element('recipe', 'id', {type: 'hidden'}, {value: recipe.try(:id)})
			form = render('recipes/form', recipe: recipe)
			recipe_table << <<-EOS.html_safe

<tr>
	#{id_element}
     <td class="td-expand">
        <span class="glyphicon glyphicon-chevron-down expand-rec" />
     </td>
     <td class="title-recipe">
    	<div class="checkbox check-app">
  			<label><input class="check-rec" type="checkbox" value="">Yeha#{recipe.title}</label>
			</div>  	
    </td>
</tr>
<tr class="recipeDetails" style="display: none">
    <td colspan="4" class="detail-view">
    	#{form}
    </td>
</tr>

			EOS
		end
		recipe_table.html_safe
	end

	
end