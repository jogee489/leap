class CategoriesController < ApplicationController
  def index
    @categoryList = Category.sorted
  end

  def show
  end

  def new
  end

  def save_category 
    Category.new(name: params[:name]).save
    render nothing: true
  end

  def edit
  end



  def destroy
    @category = Category.find(params[:id]).destroy
    render nothing: true
  end

  private
    def category_params                                                                                                                         
      params.require(:category).permit(:name)
    end
  

end
