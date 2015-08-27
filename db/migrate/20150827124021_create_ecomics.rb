class CreateEcomics < ActiveRecord::Migration
  def change
    create_table :ecomics do |t|
      t.string :name

      t.timestamps
    end
  end
end
