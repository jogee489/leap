# Methods in this module will relate directly to forms that are used ..
module LeapFormHelper

  public

  # Render html for a delete button
  def delete_button(button_class = nil, id = nil)
    leap_button('Delete', {class: "btn-app #{button_class}", id: id}, 'glyphicon-trash')
  end

  # Render html for a save button
  def save_button(button_class = nil, id = nil)
    leap_button('Save', {class: "btn-app #{button_class}", id: id}, 'glyphicon-save')
  end

  # Helper method for displaying a button
  def leap_button(text, options = {}, icon_name = nil, path = nil)
    span = "<span class='glyphicon #{icon_name}' />" if icon_name.present?
    span ||= ''
    button_class = options[:class] || ''
    button_id = options[:id] ? "id='#{options[:id]}'" : ''
    button_type = options[:type] || 'button'
    data_toggle = options[:data_toggle] ? "data-toggle='#{options[:data_toggle]}'" : ''
    data_target = options[:data_target] ? "data-target='#{options[:data_target]}'" : ''
    path_to = path ? "<a href=#{path}></a>" : ''


    <<-EOS.html_safe
      <button class="btn #{button_class}" #{button_id} type="#{button_type}" #{data_toggle} #{data_target}>
        #{text}
        #{span}
        #{path_to}
      </button>
    EOS
  end

  # Adds a form element styled to match our form style.
  def add_form_element(obj = nil, method = 'attribute', options = {}, html_options = {})
    type = options[:type] || 'text'
    type = nil unless %w(file text hidden textarea password select checkbox).include?(type)
    label = options[:label] || method.humanize.titleize

    description = options[:description]

    html_options[:class] = "#{type} form_elem #{html_options[:class]}"
    label_for = if html_options.key?(:id)
      html_options[:id]
    else
      "#{obj}_#{method}"
    end

    element = case type
      when 'text'
        text_field(obj, method, html_options)
      when 'hidden'
        hidden_field(obj, method, html_options)
      when 'textarea'
        html_options = {class: 'form-control'}
        text_area(obj, method, html_options)
      when 'password'
        password_field(obj, method, html_options)
      when 'select'
        select_options = options[:select_options]
        selected = options[:selected]
        include_blank = options[:include_blank]

        select(obj, method, select_options, { selected: selected, include_blank: include_blank }, html_options)
      when 'checkbox'
        if [true, 'true', 1, '1'].include?(html_options[:value])
          html_options[:checked] = 'checked'
        else
          ''
        end
        check_box(obj, method, html_options)
      when 'file'
        file_field(obj, method, html_options)
      else
        ''
    end

    case type
      when 'hidden'
        element
      else
        <<-EOS.html_safe
<div class="group clearfix">
  <div class="row">
    <div class="column grid2of5">
    <div class="spacer">
      <label for="#{label_for}">#{label}<span>#{description}</span></label>
    </div>
    </div>

    <div class="column grid3of5">
    <div class="#{'boxed ' unless type == 'checkbox'}spacer">
      #{element}
    </div>
    </div>
  </div>
</div>
        EOS
    end
  end

end
