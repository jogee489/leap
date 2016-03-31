# Methods in this module will relate directly to forms that are used ..
module LeapFormHelper

  # Optionally returns submit and cancel buttons for a form.
  def form_buttons(accept = 'Ok', deny = 'Cancel', deny_path = {})
    deny_path = { controller: params[:controller] } if deny_path.blank?
    content_tag(:ol, class: 'actions clearfix') do
      submit = form_submit_button(accept) if accept.present?
      cancel = form_deny_button(deny, deny_path) if deny.present?
      [submit, cancel].compact.join.html_safe
    end
  end

  private

  def form_submit_button(label)
    name = label.sub(/\s+/, '').underscore
    content_tag(:li) do
      content_tag(:button, id: 'submit_button', type: 'submit', name: name) do
        content_tag(:span, label)
      end
    end
  end

  def form_deny_button(label, path)
    action_link_to(label, path, id: 'secondary', action_class: 'secondary')
  end

  public

  def leap_button(text, icon_name, button_class = '', id = 'button', type = 'button')
    span = "<span class='glyphicon #{icon_name}' />" if icon_name.present?
    span ||= ''

    <<-EOS.html_safe
      <button class="btn btn-app #{button_class}" id="#{id}" type="button">
        #{text}
        #{span}
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
