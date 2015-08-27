class Ecomic < ActiveRecord::Base
  has_many :frames, dependent: :destroy

  def first_frame
    first_frames = self.frames.where(ancestry: nil).to_a

    if !first_frames.empty?
      if first_frames.length == 1
        first_frames.first
      else
        raise StandardError, "Multiple first frames found"
      end
    else
      nil
    end
  end
end
