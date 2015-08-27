require 'test_helper'

class FramesControllerTest < ActionController::TestCase
  setup do
    @frame = frames(:one)
    @ecomic = @frame.ecomic
  end

  test "should get index" do
    get :index, ecomic_id: @ecomic.id
    assert_response :success
    assert_not_nil assigns(:frames)
  end

  test "should get new" do
    get :new, ecomic_id: @ecomic.id
    assert_response :success
  end

  test "should create frame" do
    assert_difference('Frame.count') do
      post :create, frame: { name: @frame.name, ecomic_id: @frame.ecomic }, ecomic_id: @ecomic.id
    end

    assert_redirected_to ecomic_frames_path(@ecomic)
  end

  test "should show frame" do
    get :show, id: @frame, ecomic_id: @ecomic.id
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @frame, ecomic_id: @ecomic.id
    assert_response :success
  end

  test "should update frame" do
    patch :update, id: @frame, frame: { name: @frame.name }, ecomic_id: @ecomic.id
    assert_redirected_to ecomic_frames_path(@ecomic)
  end

  test "should destroy frame" do
    assert_difference('Frame.count', -1) do
      delete :destroy, id: @frame, ecomic_id: @ecomic.id
    end

    assert_redirected_to ecomic_frames_path(@ecomic)
  end
end
