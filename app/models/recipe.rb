class Recipe < ActiveRecord::Base
	belongs_to :tag
	scope :sorted, lambda { order("recipes.title ASC")}
	  validates_uniqueness_of :title

	def title=(s)
    	write_attribute(:title, s.to_s.titleize) # The to_s is in case you get nil/non-string
  	end

  	def self.search(title)
  		where("title like ?", "%#{title}%")
  	end
end
