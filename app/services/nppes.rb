module NPPES

  class ProviderService
    require 'httparty'

    def initialize(params)
      @root_uri = "#{Rails.application.config.nppes_api["uri"]}?version=#{Rails.application.config.nppes_api["version"]}"
      @query_string = query_string(params)
    end

    def call
      p "FULL URL"
      p "#{@root_uri}#{@query_string}"
      result = HTTParty.get("#{@root_uri}#{@query_string}")
    rescue HTTParty::Error => e
      {"error": "There was a error fetching providers. Please try again."}
      # OpenStruct.new({success?: false, error: e})
    else
      result
      # OpenStruct.new({success?: true, payload: result})
    end

    private

      def query_string(params)
        qs = "&"
        params.each do |k, v|
          qs += "#{k}=#{v}"
        end
        qs
      end

  end
end
