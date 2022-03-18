Rails.application.routes.draw do
  get 'providers/search'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root 'dashboard#index'
end
