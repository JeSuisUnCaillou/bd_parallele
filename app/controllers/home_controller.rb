class HomeController < ApplicationController
  def index
    @ecomic = Ecomic.last
    
  end
end
