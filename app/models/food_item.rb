class FoodItem < ActiveRecord::Base

  belongs_to :category
  validates_uniqueness_of :name
  scope :sorted, lambda { order("food_items.name ASC")}

  def name=(s)
    write_attribute(:name, s.to_s.capitalize) # The to_s is in case you get nil/non-string
  end

  def self.search(name)
  		where("name like ?", "%#{name}%")
  	end
  

end
