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

    Frame.add_next_event($(".next"));
});


Frame = {max_nb_vertical: 3}

//NEXT EVENT
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
    Frame.append_frame(html);

    //ON CACHE LE BOUTON CLIQUE
    button.addClass("hidden");

    //ON DETECTE LES NOUVEAUX BOUTONS
    new_buttons = $(html).find(".next")
    if (new_buttons.length != 0) {
      // ON AJOUTE L'EVENT NEXT AUX NOUVEAUX BOUTONS
      Frame.add_next_event(new_buttons);
    }
  });
};


//Ajoute une frame à la liste des frames
Frame.append_frame = function(html){
  frame_li = $("#frames_vertical_list");
  nb_frames = frame_li.children().size();
  console.log(nb_frames);
  //Si il y a plus de max_nb_vertical frames
  if(nb_frames >= Frame.max_nb_vertical){
    frame_li.children().first().remove();//on enlève la première frame
  }
  frame_li.append(html);
};

//Ajoute l'évènement Frame.next sur une liste d'éléments
Frame.add_next_event = function(elements){
  elements.each(function(){ $(".next[data-next='"+$(this).attr("data-next")+"']").on("click", Frame.next) });
};


