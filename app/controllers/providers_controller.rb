require 'nppes'

class ProvidersController < ApplicationController

  def search
    res = NPPES::ProviderService.new(provider_params).call

p "RES"
p res

    render :json => res
  end

  private

    # Whitelisted params
    def provider_params
      params.permit(:number)
    end
end
