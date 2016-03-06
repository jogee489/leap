class FoodItem < ActiveRecord::Base

  belongs_to :category
  validates_uniqueness_of :name
  scope :sorted, lambda { order("food_items.name ASC")}

end
