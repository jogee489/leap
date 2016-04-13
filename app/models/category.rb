class Category < ActiveRecord::Base

  has_many :food_items, dependent: :destroy
  validates_uniqueness_of :name
  scope :sorted, lambda { order("categories.name ASC")}
  
  def name=(s)
    write_attribute(:name, s.to_s.capitalize) # The to_s is in case you get nil/non-string
  end

  
end
