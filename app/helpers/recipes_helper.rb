# Methods in this module will relate directly to forms that are used ..
module RecipesHelper

	# Render table for listing recipes
	def recipe_list(recipes)
		recipe_table = ''
		if recipes.present?
			recipes.each_with_index do |recipe, index|
				

				id_element = add_form_element('recipe', 'id', {type: 'hidden'}, {value: recipe.try(:id)})
				form = render('recipes/form', recipe: recipe)
				recipe_table << <<-EOS.html_safe

<tr class="app-table-tr">
	#{id_element}
     <td class="expand-td">
        <span class="glyphicon glyphicon-chevron-down expand-icon" />
     </td>
     <td class="app-table-title">
    	<div class="checkbox check-app">
  			<label><input class="check-rec" type="checkbox" value="">#{recipe.title}</label>
		</div>
    </td>
</tr>
<tr class="app-table-details">
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