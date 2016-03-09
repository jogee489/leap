# Methods in this module will relate directly to forms that are used ..
module RecipesHelper

	# Render table for listing recipes
	def recipe_list(recipes, submit, cancel)
		#button_to when path is present
		recipe_table = ''
		recipes.each_with_index do |recipe, index|
			if !submit[:path].nil?
				submit_button = create_button_to(submit[:label], submit[:class], "#{recipe.id}", submit[:action])
			else
				submit_button = create_button(submit[:label], submit[:class])
			end

			if !cancel[:path].nil?
				cancel_button = create_button_to(cancel[:label], cancel[:class], "#{recipe.id}", cancel[:action])
			else
				cancel_button = create_button(cancel[:label], cancel[:class])
			end

			id_element = add_form_element('recipe', 'id', {type: 'hidden'}, {value: recipe.try(:id)})
			form = render('form', recipe: recipe)
			recipe_table << <<-EOS.html_safe
<tr>
	#{id_element}
     <td>
        <span class="glyphicon glyphicon-chevron-down expand" />
     </td>
     <td>
     	#{index}
     </td>
     <td>
        <span><input type="checkbox" class="check-rec"/>
     </td>
     <td>
        <a class="recTitle" >#{recipe.title}</a>
    </td>
</tr>
<tr class="recipeDetails" style="display: none">
    <td colspan="4" class="detailView">
        <div class="container col-md-12">
          <div class="panel panel-default" id="recipePanel">
            <div class="panel-heading">Recipe Details</div>
            <div class="panel-body">
              <form role="form">
                #{form}
                #{submit_button}
                #{cancel_button}
            </form>
            </div>
          	</div>
        </div>
    </td>
</tr>

			EOS
		end
		recipe_table.html_safe
	end

	# Create a button with the specified path.
	# Currently not working properly
	def create_button_to(label, button_class, id, action)
		method = 'delete' if action = 'destory'
		method ||= 'post'
		button_class ||= ''
		button_to(label, {controller: 'recipe', action: 'action', id: id}, method: method, class: "btn btn-danger col-sm-4 #{button_class}")
	end

	# Create a button that does not lead anywhere.
	def create_button(label, button_class)
		button_class ||= ''
		<<-EOS.html_safe
<input class="btn btn-warning col-sm-4 col-md-offset-3 #{button_class}" type="button" value="#{label}" />
		EOS
	end
end