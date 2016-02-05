class ApplicationController < ActionController::Base
  #protect_from_forgery
  rescue_from Exception, with: :render_error
  rescue_from ActionController::RoutingError, with: :render_404
  #rescue_from ActionController::UnknownAction, with: :render_404
  rescue_from ActiveRecord::RecordNotFound, with: :render_404

  def render_error(exception)
    Rails.logger.error(exception.message)
    Rails.logger.error(exception.backtrace.join("\n"))
    respond_to do |format|
      format.any { render text: 'Server error', status: 500 }
      format.html { render template: 'common/error', status: 500 }
    end
  end

  def render_404
    respond_to do |format|
      format.any { render text: 'Not found', status: 404 }
      format.html { render template: 'common/page_not_found', status: 404 }
    end
  end

end
