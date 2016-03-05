class FoodItem < ActiveRecord::Base

  belongs_to :category

  scope :sorted, lambda { order("food_items.name ASC")}

end
