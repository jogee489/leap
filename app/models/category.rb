class Category < ActiveRecord::Base

  has_many :food_items
  
end
