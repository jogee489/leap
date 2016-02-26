class CategoriesController < ApplicationController
  def index
    @categoryList = Category.all
  end

  def show
  end

  def new
  end

  def edit
  end

  def delete
  end

end
