#!/usr/bin/python

# Def a class: a crawler. It's going to traverse through pages and grab recipes.
#import requests
from bs4 import BeautifulSoup
from urllib2 import urlopen
import re
import json
import sys

class Recipe:
    def __init__(self,recipeName):
        self.recipeName = recipeName
        self.recipeIngredients = []
        self.recipeDirections = []

    def addIngredients(self,ingredient):
        if (ingredient and not (ingredient == "Add all ingredients to list")):
            self.recipeIngredients.append(ingredient)

    def addDirection(self,direction):
        if (direction):
            self.recipeDirections.append(direction)

    def printRecipeName(self):
        print(self.recipeName)

    def printIngredient(self):
        for food in self.recipeIngredients:
            print(food)
    def printDirection(self):
        for dir in self.recipeDirections:
            print(dir)

    def toJson(self):
        recipeData = {}
        recipeData["title"] = self.recipeName
        recipeData["ingredients"] = self.recipeIngredients
        recipeData["directions"] = self.recipeDirections
        return recipeData

class RecipeFinder:
    # Constructor.
    def __init__(self,foodItems):
        # All about links.
        self.recipePartialLinks = []
        self.initialURL = ''

        # All about food items.
        self.foodItems = foodItems

        # all about recipes.
        self.recipeList = []

    # This method initiates search and gather all the recipe links.
    def getRecipePartialLinks(self,maxPage):
        currentPageNum = 1
        maxPageNum = maxPage
        counter = 0
        while currentPageNum <= maxPageNum:
            # Construct url to crawl. Just update page number.
            url = self.initialURL+str(currentPageNum)
            # Make beautiful soup object.
            plain_text = urlopen(url).read()#requests.get(url)
            #plain_text = source_code.text
            soup = BeautifulSoup(plain_text,"lxml")

            # Find all <a> tags with href.
            for link in soup.findAll('a',href=re.compile("/recipe/")):
                # Extract links
                href = link.get('href')
                # Disregard evey second link cuz it's the same as the previous one.
                counter += 1
                if counter%2==1:
                    #print(str(href))
                    self.recipePartialLinks.append(str(href))
            # Update page number to traverse the next page..
            currentPageNum += 1



    # This method will take a list of foodItems and construct the search query url.
    def constructInitialURL(self):
        self.initialURL = 'http://allrecipes.com/search/results/?wt='
        i = 0
        # Loop through the list and add ingredient to the url.
        for food in self.foodItems:
            self.initialURL += food
            # For the last food item (searchTerm), don't add '+'.
            if food != self.foodItems[len(self.foodItems)-1]:
                self.initialURL += '%20'


        # Append page number info to the url.
        self.initialURL += '&sort=re&page='

    # This method extract read a recipe and make a recipe object.
    def extractRecipeInfo(self, partialRecipeURL):

        # Make the full recipe url.
        fullRecipeURL = "http://allrecipes.com" + partialRecipeURL

        # Make beautiful soup object.
        plain_text = urlopen(fullRecipeURL).read()#requests.get(fullRecipeURL)
        #plain_text = source_code.text
        soup = BeautifulSoup(plain_text,"lxml")

        # Instantiate a Recipe object.
        recipe = Recipe(soup.find('h1', 'recipe-summary__h1').string)
        for link in soup.findAll('span',class_=re.compile('recipe-ingred_txt')):
            recipe.addIngredients(link.string)
        for link in soup.findAll('span',class_=re.compile('recipe-directions__list--item')):
            recipe.addDirection(link.string)

        self.recipeList.append(recipe)




##################################### Actual Execution #############################################

# Food Items
#foodItems = ['pumpkin','pie','milk','egg','beef']
foodString = sys.argv[1]
foodItems = [x.strip() for x in foodString.split(' ')]


# Make crawler.
spider = RecipeFinder(foodItems)

# Make initial URL to crawl.
spider.constructInitialURL()

# Extract recipe url fragments.
spider.getRecipePartialLinks(1)

# Make recipes.
for x in range (0,5):
    spider.extractRecipeInfo(spider.recipePartialLinks[x])

# Printings...
recipeList = []
i = 0
for rp in spider.recipeList:
    recipe = rp.toJson()
    recipeList.append(recipe)
    i += 1

output = json.dumps(recipeList)
print(output)
