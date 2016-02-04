#!/usr/bin/python

# The main logic for scraping data from the webpage is kept here.

from bs4 import BeautifulSoup
from urllib2 import urlopen
import json

URL = "http://realfitrealfoodmom.com/2014/11/30/spiced-cocoa-smoothie/"

def scrape_recipe():
	recipeData = {}
	recipeList = []
	# Grab the required sections of the html page
	html = urlopen(URL).read()
	soup = BeautifulSoup(html, "lxml")
	recipe = soup.find("div", "easyrecipe")
	title = recipe.find("div", "ERSName").string
	ingredientList = recipe.find("div", "ERSIngredients")
	ingredients = [ ingredient.string for ingredient in ingredientList.findAll("li")]
	directionList = recipe.find("div", "ERSInstructions")
	directions = [ direction.string for direction in directionList.findAll("li")]
	# Put scraped information into a map
	recipeData["title"] = title
	recipeData["ingredients"] = ingredients
	recipeData["directions"] = directions
	recipeList.append(recipeData)
	# Place data into a JSONObject and output
	output = json.dumps(recipeList)
	print output

scrape_recipe()