require 'test_helper'

class EcomicsControllerTest < ActionController::TestCase
  setup do
    @ecomic = ecomics(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:ecomics)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create ecomic" do
    assert_difference('Ecomic.count') do
      post :create, ecomic: { name: @ecomic.name }
    end

    assert_redirected_to ecomic_path(assigns(:ecomic))
  end

  test "should show ecomic" do
    get :show, id: @ecomic
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @ecomic
    assert_response :success
  end

  test "should update ecomic" do
    patch :update, id: @ecomic, ecomic: { name: @ecomic.name }
    assert_redirected_to ecomic_path(assigns(:ecomic))
  end

  test "should destroy ecomic" do
    assert_difference('Ecomic.count', -1) do
      delete :destroy, id: @ecomic
    end

    assert_redirected_to ecomics_path
  end
end
