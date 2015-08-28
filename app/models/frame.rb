class FrameValidator < ActiveModel::Validator
  def validate(record)
    if record.siblings.keep_if{ |f| f.id != record.id }.count >= 2
      record.errors[:error] << "Only 2 children allowed per frame"
    end
  end
end

class CousinHasOtherUncleError < StandardError
end

class Frame < ActiveRecord::Base
  belongs_to :ecomic
  validates_presence_of :ecomic

  has_ancestry 
  validates_with FrameValidator

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

 
  #Gets the first ancestor with several children
  def grand_dad
    ancestors.reverse.each do |frame|
      return frame if frame.children.count > 1
    end
    return nil
  end

  #True if self is a descendant of frame
  def is_descendant_of?(frame)
    return true if self == frame
    if frame.nil?
      raise ArgumentError, "The frame argument can't be nil"
    else
      !(/(^|\/)#{frame.id}(\/|$)/ =~ self.ancestry).nil?
    end
  end

  #Recursively fetch a descendant frame with a given depth. Return nil if not found
  def get_descendant_at_depth(depth_num)
    if self.depth == depth_num
      self
    elsif self.child_ids.size == 0
      nil
    elsif self.child_ids.size <= 1
      self.first_child.get_descendant_at_depth(depth_num)
    else
      raise CousinHasOtherUncleError, "You can't get_descendant_at_depth through a descendant with more than one child"
    end
  end

  #Children of grand_dad who aren't self's parent. Return nil if not found
  def grand_uncle
    grand_daddy = self.grand_dad
    return nil if grand_daddy.nil?

    grand_uncles = grand_daddy.children.find_all{ |frame| !self.is_descendant_of?(frame) }
    if grand_uncles.size > 1
      ap grand_uncles
      raise StandardError, "You can't have more than one grand-uncle"
    elsif grand_uncles.size == 1
      grand_uncles.first
    else #if size == 0
      nil
    end
  end

  #Get the frame at the same depth with the same grand_dad (which is the first ancestry with several children)
  def cousin
    grand_uncle = self.grand_uncle
    return nil if grand_uncle.nil?
    cousin = grand_uncle.get_descendant_at_depth(self.depth)
  end
  
end

