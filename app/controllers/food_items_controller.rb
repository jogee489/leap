class FoodItemsController < ApplicationController
  def index
    @foodItems = FoodItem.all
  end

  def show
    @foodItem = FoodItem.find(params[:id])
  end

  def new
    @foodItem = FoodItem.new(foodItem_params)
  end

  def create
    # Instantiate a new object using form parameters
    @foodItem = FoodItem.new(foodItem_params)
    # Save the object
    if @foodItem.save
      # If save succeeds, redirect to the index action
      redirect_to(:action => 'index')
    else
      # If save fails, redisplay the form so user can fix problems
      render('new')
    end
  end
  
  def edit
  end

  def delete
  end

  private
  def foodItem_params
    # same as using "params[:foodItem]", except that it:
    # - raises an error if :foodItem is not present
    # - allows listed attributes to be mass-assigned
    params.require(:foodItem).permit(:name, :category)
  end

end
