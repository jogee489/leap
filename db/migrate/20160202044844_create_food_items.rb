class CreateFoodItems < ActiveRecord::Migration
  def self.up
    create_table :food_items do |t|
      t.integer "category_id"
      t.string "name"
      t.timestamps
    end
    add_index("food_items", "category_id")
    add_index("food_items", "name")
  end

  def self.down
    drop_table :food_items
  end
end
