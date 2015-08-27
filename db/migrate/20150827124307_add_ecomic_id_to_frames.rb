class AddEcomicIdToFrames < ActiveRecord::Migration
  def change
    add_column :frames, :ecomic_id, :integer
  end
end
