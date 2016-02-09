class FoodItemsController < ApplicationController
  def index
    @foodItems = FoodItem.all
  end

  def show
    @foodItem = FoodItem.find(params[:id])
  end

  def new
    @foodItem = FoodItem.new()
  end

  def create
    # Instantiate a new object using form parameters
    @foodItem = FoodItem.new(food_items_params)
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
    @foodItem = FoodItem.find(params[:id])
  end
  
  def update
    # Instantiate a new object using form parameters
    @foodItem = FoodItem.find(params[:id])
    # update the object
    if @foodItem.update_attributes(food_items_params)
      # If save succeeds, redirect to the index action
      redirect_to(:action => 'show', :id => @foodItem.id)
    else
      # If save fails, redisplay the form so user can fix problems
      render('show')
    end
    
  end

  def delete
    @foodItem = FoodItem.find(params[:id])
  end

  def destroy
    foodItem = FoodItem.find(params[:id]).destroy
    redirect_to(:action => 'index')
  end

  private
    def food_items_params
      # same as using "params[:subject]", except that it:                                                                                                                       
      # - raises an error if :subject is not present                                                                                                                            
      # - allows listed attributes to be mass-assigned                                                                                                                          
      params.require(:food_item).permit(:name, :category_id)
    end
  
end
