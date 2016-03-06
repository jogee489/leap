class Category < ActiveRecord::Base

  has_many :food_items, dependent: :destroy
  validates_uniqueness_of :name


  scope :sorted, lambda { order("categories.name ASC")}
  
end
