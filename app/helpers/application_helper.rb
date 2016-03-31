module ApplicationHelper

  # Flash messages in the system are designed to notify the user of any notifications, warning,
  # or errors related to the task that they are performing. These messages should be informative
  # and explain in detail what has happened and if necessary what actions must be taken next.
  #
  # The three types of flash messages that will be supported in the system are +notice+, +warning+,
  # and +error+. More may be added in the future if necessary but these types should cover all
  # potential scenarios. To call the flash message within a view all you need to do is make sure
  # this method exists on the page. Because this is something that should really be displayed
  # on every page in the system, it has been placed in the app/views/application.html.erb file.
  # This will ensure that any page using the main application layout will be capable of showing
  # the flash message.
  def display_flash_message
    if flash[:notice]
      level = 'notice'
      message = flash[:notice]
      heading = 'Attention!'
    elsif flash[:warning]
      level = 'warning'
      message = flash[:warning]
      heading = 'Warning!'
    elsif flash[:error]
      level = 'error'
      message = flash[:error]
      heading = 'Oops!'
    else
      return
    end

    alert_box(heading, content_tag(:p, message), class: level)
  end

  # Alert boxes are represented in several different areas throughout the application. Most often
  # they are called for the flash messages that appear on the page when the user needs to be notified
  # of something..
  #
  # === Example
  #   alert_box('This is a test', 'This is the message for the alert box.', class: 'warning')
  def alert_box(heading, content, html_options = {})
    html_options = html_options.stringify_keys
    html_options['class'] = "alert_box #{html_options['class']}"
    content_tag(:div, html_options) do
      content_tag(:div) do
        content_tag(:p, heading, class: 'alert_box_heading') << content
      end
    end
  end

  # Each page within the application will requrie a primary page title. The +page_title+
  # helper will make sure that the title is formatted correctly for each page.
  #
  # The given title will be escaped.
  #
  # == Examples
  #   page_title # => "<h2 class='page_title'>Page Title</h2>
  #   page_title('Current Roles') # => <h2 class='page_title'>Current Roles</h2>
  #
  # == Options
  # You may also supply any standard HTML options that will affect the page title.
  def page_title(page_title = 'Page Title', html_options = {}, &block)
    html_options.has_key?(:class) ? html_options[:class] += ' page_title' : html_options[:class] = 'page_title'

    if block_given?
      actions = capture(&block)
      content_tag(:h2, content_tag(:span, h(page_title) << actions), html_options)
    else
      content_tag(:h2, content_tag(:span, h(page_title)), html_options)
    end
  end

end
