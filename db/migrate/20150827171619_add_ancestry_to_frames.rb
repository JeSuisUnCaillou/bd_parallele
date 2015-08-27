class AddAncestryToFrames < ActiveRecord::Migration
  def change
    add_column :frames, :ancestry, :string
  end
end
