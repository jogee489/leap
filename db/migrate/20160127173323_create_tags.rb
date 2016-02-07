class CreateTags < ActiveRecord::Migration
  def self.up
    create_table :tags do |t|
      t.string :title
      t.integer :recipe_id

      t.timestamps
    end
    add_index :tags, :recipe_id
  end

  def self.down
    drop_table :tags
  end
end
