# Model for the Recipe table
# Recipe has the following rows:
# => tite: string
# => ingredients: string
# => directions: string
#

class Recipe < ActiveRecord::Base
	require 'set' # Used for poor database search method...

	belongs_to :tag
	scope :sorted, lambda { order("recipes.created_at DESC")}
	  validates_uniqueness_of :title

	def title=(s)
    	write_attribute(:title, s.to_s.titleize) # The to_s is in case you get nil/non-string
  	end

  	def self.search(property, title)
  		where("#{property} like ?", "%#{title}%")
  	end

    def self.tags_search(tags)
      where("tags contains ?", "%#{tags}%")
    end

  	def self.ingredients_search(food_items)
      recipe_list = [].to_set
  		food_items.each do |food|
  			where("ingredients like ?", "%#{food}%").all.each { |recipe| recipe_list << recipe }
  		end
  		return recipe_list
  	end

    def formatIngredients
      ingredients.gsub('", "', "\n").delete('"[]')
    end

    def formatDirections
      directions.gsub('", "', ' ').delete('"[]')
    end

end
