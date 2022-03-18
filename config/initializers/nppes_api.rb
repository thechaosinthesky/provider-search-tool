Rails.application.config.nppes_api = YAML.load_file(Rails.root.join('config', 'nppes_api.yml'))[Rails.env]
