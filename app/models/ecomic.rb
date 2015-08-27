class Ecomic < ActiveRecord::Base
  has_many :frames, dependent: :destroy
end
