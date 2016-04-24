# Methods in this module are made to help render the recipe table.
module RecipesHelper

	# Render table for listing recipes
	def recipe_list(recipes)
		recipe_table = ''
		if recipes.present?
			recipes.each_with_index do |recipe, index|
				if recipe.instance_of? Hash
					puts recipe
					if recipe[:id]
						recipe = Recipe.find(recipe[:id])
					else
						recipe = Recipe.new(title: recipe[:title], ingredients: recipe[:ingredients], directions: recipe[:directions])
					end

					curr_parallel = recipes[index][:parallel]
				end

				id_element = add_form_element('recipe', 'id', {type: 'hidden'}, {value: recipe.try(:id)})
				form = render('recipes/form', recipe: recipe, parallel: curr_parallel)
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

	def ingredients_list(ingredients, parallel)
		unordered_list_html = ''
		ingredients_list_html = ''
		puts parallel
		
		if parallel.present?
			#check ingredients with parallel array. if parallel[index]=-1, render li with red background
			index = 0;
			ingredients.split("\n").each do |ingredient|
				if parallel[index] == -1
					ingredients_list_html << "<li class='ingredient-to-avoid'>#{ingredient}</li>"
				elsif parallel[index] == 1
					ingredients_list_html << "<li class='ingredient-to-have'>#{ingredient}</li>"
				else
					ingredients_list_html << "<li class='ingredient'>#{ingredient}</li>"
				end
				index +=1
			end
		else
			ingredients.split("\n").each do |ingredient|
				ingredients_list_html << "<li class='ingredient'>#{ingredient}</li>"
			end

		end

		unordered_list_html << <<-EOS.html_safe
			<ul class="rec-ingredients">
			#{ingredients_list_html}
			</ul>
		EOS

		unordered_list_html.html_safe


	end
	
end