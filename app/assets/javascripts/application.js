// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require bootstrap
//= require_tree .

$(document).on("ready page:load", function() {
//$( document ).ready(function() {
    console.log( "ready to read !" );

    $(".next").on("click", Frame.next);
});

Frame = {}

Frame.next = function() {
  console.log("next !");
  button = $(this)
  frame_id = button.attr("data-next");
  $.ajax({ method: "GET",
           url: "/ajax_next",
           data: {frame_id: frame_id}
         }
  ).done(function(html) {
    // ON AJOUTE LA NOUVELLE FRAME
    $("#ecomic_list").append(html);

    //ON CACHE LE BOUTON CLIQUE
    button.addClass("hidden");

    //ON DETECTE LES NOUVEAUX BOUTONS
    new_buttons = $(html).find(".next")
    if (new_buttons.length != 0) {
      console.log("Nouveaux boutons: " + new_buttons.size());
      // ON AJOUTE L'EVENT NEXT AUX NOUVEAUX BOUTONS
      new_buttons.each(function(){ $(".next[data-next='"+$(this).attr("data-next")+"']").on("click", Frame.next) });
    }
  });

};
