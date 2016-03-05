class Category < ActiveRecord::Base

  has_many :food_items, dependent: :destroy

  scope :sorted, lambda { order("categories.name ASC")}
  
end
