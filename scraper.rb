require 'rubygems'
require 'nokogiri'
require 'open-uri'

class Recipe

  attr_accesor :title, :ingredients, :directions, :tags
  
  def initialize(title, ingredients, directions, tags)
    @title = title
    @directions = directions
    @ingredients = ingredients
    @tags = tags
  end

  @recipe = Recipe.New
  
end
