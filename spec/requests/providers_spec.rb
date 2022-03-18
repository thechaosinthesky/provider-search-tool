require 'rails_helper'

RSpec.describe "Providers", type: :request do
  describe "GET /search" do
    it "returns http success" do
      get "/providers/search"
      expect(response).to have_http_status(:success)
    end
  end

end
