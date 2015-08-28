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
    Frame.add_prev_event($(".prev"));
});


//TODO : foutre en attribut de Frame les méthodes ajax, ainsi que les noms des classes et attributs des éléments du DOM dont on a besoin
Frame = { max_nb_vertical: 3 }

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
    Frame.append_last_frame(html);

    //ON CACHE LE BOUTON CLIQUE
    button.addClass("hidden");

    //ON DETECTE LES NOUVEAUX BOUTONS
    new_next_buttons = $(html).find(".next")
    new_prev_buttons = $(html).find(".prev")

    // ON AJOUTE LES EVENTS PREV & NEXT AUX NOUVEAUX BOUTONS
    Frame.add_next_event(new_next_buttons);
    Frame.add_prev_event(new_prev_buttons);
  });
};

//PREV EVENT
Frame.prev = function() {
  console.log("prev!");
  button = $(this);
  frame_id = button.attr("data-prev");
  $.ajax({ method: "GET",
           url: "/ajax_prev",
           data: {frame_id: frame_id}
  }).done(function(html) {
    //ON AJOUTE LA NOUVELLE FRAME
    Frame.append_first_frame(html);

    //ON CACHE LE BOUTON CLIQUE
    button.addClass("hidden");

    //ON DETECTE LES NOUVEAUX BOUTONS
    new_next_buttons = $(html).find(".next")
    new_prev_buttons = $(html).find(".prev")

    // ON AJOUTE LES EVENTS PREV & NEXT AUX NOUVEAUX BOUTONS
    Frame.add_next_event(new_next_buttons);
    Frame.add_prev_event(new_prev_buttons);
  });
};

//Ajoute l'évènement Frame.next sur une liste d'éléments (lus dans un retour ajax)
Frame.add_next_event = function(elements){
  elements.each(function(){
    $(".next[data-next='"+$(this).attr("data-next")+"']").on("click", Frame.next)
  });
};

Frame.add_prev_event = function(elements){
  elements.each(function() {
    $(".prev[data-prev='"+$(this).attr("data-prev")+"']").on("click", Frame.prev)
  });
};

//Ajoute une frame à la fin de la liste des frames
Frame.append_last_frame = function(html){
  frame_li = $("#frames_vertical_list");
  nb_frames = frame_li.children().size();

  //Si il y a plus de max_nb_vertical frames
  if(nb_frames >= Frame.max_nb_vertical){
    //on enlève la première frame
    frame_li.children().first().remove();
    //on affiche le bouton prev de la nouvelle premiere frame
    frame_li.children().first().find(".prev").toggleClass("hidden");
  }
  frame_li.append(html);//on ajoute la nouvelle dernière frame
};

//Ajoute une frame au début de la liste des frames
Frame.append_first_frame = function(html) {
  frame_li = $("#frames_vertical_list");
  nb_frames = frame_li.children().size();

  //Si il y a plus de max_nb_vertical frames
  if(nb_frames >= Frame.max_nb_vertical){
    //on enlève la dernière frame
    frame_li.children().last().remove();
    //on affiche le bouton next de la nouvelle dernière frame
    frame_li.children().last().find(".next").toggleClass("hidden");
  }
  $(html).insertBefore(frame_li.children().first());//on ajoute la nouvelle première frame
};


