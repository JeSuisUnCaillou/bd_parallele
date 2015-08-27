json.array!(@ecomics) do |ecomic|
  json.extract! ecomic, :id, :name
  json.url ecomic_url(ecomic, format: :json)
end
