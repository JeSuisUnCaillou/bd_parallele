class FramesController < ApplicationController
  before_action :set_frame, only: [:show, :edit, :update, :destroy]
  before_action :set_ecomic, only: [:index, :show, :new, :edit, :update, :create, :destroy]

  def ajax_next
    frame = Frame.find(params[:frame_id])
    if frame.children.count <= 1
      render partial: "frames/frame", locals: { frame: frame.first_child }
    else
      render partial: "frames/frame_multiple", locals: { frames: frame.children }
    end
  end

  def ajax_prev
    frame = Frame.find(params[:frame_id])
    render partial: "frames/frame", locals: { frame: frame.parent, has_prev: true }
  end


  # GET /frames
  def index
    if @ecomic
      @frames = @ecomic.frames
    else
      @frames = Frame.all
    end
  end

  # GET /frames/1
  def show
  end

  # GET /frames/new
  def new
    @frame = Frame.new
  end

  # GET /frames/1/edit
  def edit
  end

  # POST /frames
  def create
    @frame = Frame.new(frame_params)

    if @frame.save
      flash[:success] = "Frame #{@frame.name} saved"
      redirect_to ecomic_frames_path(@ecomic)
    else
      flash[:error] = "The frame #{@frame.name} hasn't been saved"
      redirect_to new_ecomic_frame_path(@ecomic, @frame)
    end
  end

  # PATCH/PUT /frames/1
  def update
    if @frame.update(frame_params)
      flash[:success] = "Frame #{@frame.name} saved"
      redirect_to ecomic_frames_path(@ecomic)
    else
      flash[:error] = "The frame #{@frame.name} hasn't been saved"
      redirect_to edit_ecomic_frame_path(@ecomic, @frame)
    end
  end

  # DELETE /frames/1
  def destroy
    @frame.destroy
    flash[:success] = "Frame #{@frame.name} deleted"
    redirect_to ecomic_frames_path(@ecomic)
  end


  private
    # Use callbacks to share common setup or constraints between actions.
    def set_frame
      @frame = Frame.find(params[:id])
    end

    def set_ecomic
      ecomic_id = params[:ecomic_id]
      @ecomic = Ecomic.find(ecomic_id) if ecomic_id
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def frame_params
      params.require(:frame).permit(:name, :ecomic_id, :parent_id, :picture)
    end
end
