class CreateRecipes < ActiveRecord::Migration
  def self.up
    create_table :recipes do |t|
      t.string :title, null: false
      t.string :ingredients, null: false
      t.string :directions, null:false
      t.integer :tag_id

      t.timestamps
    end

      add_index :recipes, :tag_id
  end

  def self.down
    drop_table :recipes
  end
end
