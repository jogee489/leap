class CreateRecipes < ActiveRecord::Migration
  def self.up
    create_table :recipes do |t|
      t.string :title
      t.string :ingredients
      t.string :directions
      t.integer :tag_id

      t.timestamps
    end

      add_index :recipes, :tag_id
  end

  def self.down
    drop_table :recipes
  end
end
