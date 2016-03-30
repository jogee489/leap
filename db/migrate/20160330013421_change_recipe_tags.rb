class ChangeRecipeTags < ActiveRecord::Migration
  def self.up
  	change_column :recipes, :tag_id, :string
  	rename_column :recipes, :tag_id, :tags
  end

  def self.down
  	rename_column :recipes, :tags, :tag_id
  	change_column :recipes, :tag_id, :string
  	add_index :recipes, :tag_id

  end

end
