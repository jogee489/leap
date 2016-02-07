
class TagsController < ApplicationController

	def index

	end

	def new
		@tag = Tag.new
	end

	def create
		@tag = Tag.new(params[:tag])
		if (@tag.save) 
			flash[:notice] = 'The new tag was successfully created.'
			redirect_to :action => 'show', :id => @tag.id
		else 
			render action: 'new'
		end

	end

	def show
		@tag = Tag.find(params[:id])
	end

	def edit
		@tag = Tag.find(params[:id])
	end

	def update
		@tag = Tag.find(params[:id])
		@tag.update_attributes!(params[:tag])
		if (@tag.save) 
			flash[:notice] = 'The new tag was successfully created.'
			redirect_to :action => 'show', :id => @tag.id
		else 
			render action: 'edit', id: @tag.id
		end
	end

	def destroy
		.destroy
    	redirect_to(:action => 'index')
	end

end