# Methods in this module are made to help render the recipe table.
module RecipesHelper

	# Render table for listing recipes
	def recipe_list(recipes)
		recipe_table = ''
		if recipes.present?
			recipes.each_with_index do |recipe, index|
				if recipe.instance_of? Hash
					recipe = Recipe.new(title: recipe[:title], ingredients: recipe[:ingredients], directions: recipe[:directions])
				end

				id_element = add_form_element('recipe', 'id', {type: 'hidden'}, {value: recipe.try(:id)})
				form = render('recipes/form', recipe: recipe, parallel: recipe[:parallel])
				recipe_table << <<-EOS.html_safe

<tr class="app-table-tr">
	#{id_element}
     <td class="expand-td">
        <span class="glyphicon glyphicon-chevron-down expand-icon" />
     </td>
     <td class="app-table-title">
    	<div class="app-checkbox">
        <input class="check-rec" type="checkbox" id="#{recipe.title}">
        <label for="#{recipe.title}">#{recipe.title}</label>
      </div>
    </td>
</tr>
<tr class="app-table-details" style="display:none;">
    <td colspan="4">
    	#{form}
    </td>
</tr>

				EOS
			end
		else
			recipe_table << <<-EOS.html_safe
<tr class="app-table-tr">
	<td class="app-table-title" style="text-align: center;">
		No recipes were found.
	</td>
</tr>
			EOS
		end
		recipe_table.html_safe
	end

	
end