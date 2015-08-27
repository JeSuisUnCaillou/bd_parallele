class Frame < ActiveRecord::Base
  belongs_to :ecomic
  validates_presence_of :ecomic
end
