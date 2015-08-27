class Frame < ActiveRecord::Base
  belongs_to :ecomic
  validates_presence_of :ecomic

  has_ancestry 

  def parent_name
    parent.name if parent
  end

  def ecomic_name
    ecomic.name if ecomic
  end

end
