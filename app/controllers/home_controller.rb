class HomeController < ApplicationController
  def index
    @ecomic = Ecomic.find_by(name: "Délires parallèles")
    #@ecomic = Ecomic.find_by(name: "NOFRAME ECOMIC")
    
  end
end
