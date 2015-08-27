class Frame < ActiveRecord::Base
  belongs_to :ecomic
  validates_presence_of :ecomic

  has_ancestry 
  has_attached_file :picture, styles: { thumb: "100x100>" }, default_url: ""
  validates_attachment_content_type :picture, content_type: /\Aimage\/.*\Z/

  def parent_name
    parent ? parent.name : "--NONE--"
  end

  def ecomic_name
    ecomic.name if ecomic
  end

  def first_child
    children.first unless children.empty?
  end
  
end
