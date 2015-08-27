json.array!(@frames) do |frame|
  json.extract! frame, :id, :name
  json.url frame_url(frame, format: :json)
end
