class EcomicsController < ApplicationController
  before_action :set_ecomic, only: [:show, :edit, :update, :destroy]

  # GET /ecomics
  # GET /ecomics.json
  def index
    @ecomics = Ecomic.all
  end

  # GET /ecomics/1
  # GET /ecomics/1.json
  def show
  end

  # GET /ecomics/new
  def new
    @ecomic = Ecomic.new
  end

  # GET /ecomics/1/edit
  def edit
  end

  # POST /ecomics
  # POST /ecomics.json
  def create
    @ecomic = Ecomic.new(ecomic_params)

    respond_to do |format|
      if @ecomic.save
        format.html { redirect_to @ecomic, notice: 'Ecomic was successfully created.' }
        format.json { render action: 'show', status: :created, location: @ecomic }
      else
        format.html { render action: 'new' }
        format.json { render json: @ecomic.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /ecomics/1
  # PATCH/PUT /ecomics/1.json
  def update
    respond_to do |format|
      if @ecomic.update(ecomic_params)
        format.html { redirect_to @ecomic, notice: 'Ecomic was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @ecomic.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /ecomics/1
  # DELETE /ecomics/1.json
  def destroy
    @ecomic.destroy
    respond_to do |format|
      format.html { redirect_to ecomics_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_ecomic
      @ecomic = Ecomic.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def ecomic_params
      params.require(:ecomic).permit(:name)
    end
end
