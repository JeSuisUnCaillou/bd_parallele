class HomeController < ApplicationController
  def index
    @frames = Frame.all
  end
end
