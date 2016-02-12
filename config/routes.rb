Leap::Application.routes.draw do
  get "food_items/index"

  get "food_items/show"

  get "food_items/new"

  get "food_items/edit"

  get "food_items/delete"

  
  get "categories/index"

  get "categories/show"

  get "categories/new"

  get "categories/edit"

  get "categories/delete"

	
  get "recipes/list", controller: :recipes, action:  :list

  resources :categories

  resources :food_items

  resources :recipes

  resources :tags

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => "search#index"
  # map.root :to => {contoller: "search"}

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id(.:format)))'

   
  # root page
  get '/', to: "search#index"

  match ':controller(/:action(/:id))', :via => [:get, :post]
  # get '/search/list', controller: :search, action: :list
 # get '/search/show', controller: :search, action: :show
 # get '/search/saveRecipe', controller: :search, action: :saveRecipe
  #get '/search/show?:searchString', controller: :search, action: :show
end
