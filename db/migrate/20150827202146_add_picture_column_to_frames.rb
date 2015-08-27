class AddPictureColumnToFrames < ActiveRecord::Migration
  def up
    add_attachment :frames, :picture
  end

  def down
    remove_attachment :frames, :picture
  end
end
