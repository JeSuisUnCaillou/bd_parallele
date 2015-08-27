class AddIndexToFramesAncestry < ActiveRecord::Migration
  def change
    add_index :frames, :ancestry
  end
end
