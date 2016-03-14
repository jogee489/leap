class CategoriesController < ApplicationController
  def index
    @categoryList = Category.sorted
  end

  def show
  end

  def new
  end

  def save_category 
    @category = Category.new(name: params[:name])
    if Category.exists?(name: @category.name)
      puts "save unsuccessful"
      render status: 400, nothing: true
    elsif @category.save
      puts "save successful"
      render status: 200, nothing: true
    else
      
    end
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
