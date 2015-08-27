class Frame < ActiveRecord::Base
  belongs_to :ecomic
  validates_presence_of :ecomic

  has_ancestry 
  has_attached_file :picture
  validates_attachment_content_type :picture, content_type: /\Aimage\/.*\Z/

  def parent_name
    parent.name if parent
  end

  def ecomic_name
    ecomic.name if ecomic
  end

  def first_child
    children.first unless children.empty?
  end
  
end
