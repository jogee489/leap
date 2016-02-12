class Tag < ActiveRecord::Base
	has_many :recipes
end
