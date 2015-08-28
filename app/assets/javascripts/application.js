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
Frame = { max_nb_vertical: 3,
          frames_vertical_list: "#frames_vertical_list"}

//NEXT EVENT
Frame.next = function() {
  button = $(this)
  console.log(Frame.position_of(button) + " next!");
  frame_id = button.attr("data-next");
  $.ajax({ method: "GET",
           url: "/ajax_next",
           data: {frame_id: frame_id}
         }
  ).done(function(html) {
    // ON AJOUTE LA NOUVELLE FRAME (ou double frame) et on fait défiler
    Frame.append_last_frame(html, button);

    //ON CACHE LE BOUTON CLIQUE
    Frame.hide_buttons_and_cousins(button);

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
  button = $(this);
  console.log(Frame.position_of(button) + " prev!");
  frame_id = button.attr("data-prev");
  $.ajax({ method: "GET",
           url: "/ajax_prev",
           data: {frame_id: frame_id}
  }).done(function(html) {
    //ON AJOUTE LA NOUVELLE FRAME (ou double frame) et on fait défiler
    Frame.append_first_frame(html);

    //ON CACHE LE BOUTON CLIQUE
    Frame.hide_buttons_and_cousins(button);

    //ON DETECTE LES NOUVEAUX BOUTONS
    new_next_buttons = $(html).find(".next");
    new_prev_buttons = $(html).find(".prev");

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

//Ajoute l'évènement Frame.prev sur une liste d'éléments (lus dans un retour ajax)
Frame.add_prev_event = function(elements){
  elements.each(function() {
    $(".prev[data-prev='"+$(this).attr("data-prev")+"']").on("click", Frame.prev)
  });
};

//Ajoute une frame à la fin de la liste des frames
Frame.append_last_frame = function(html, button){
  frame_li = $(Frame.frames_vertical_list);
  nb_frames = frame_li.children().size();
  position = Frame.position_of(button);
    
  //Si il y avait déjà 2 frames de large et que l'on s'apprète à afficher 2 frères (et non un enfant et un cousin), on enlève l'autre colonne
  if( (position == "left" || position == "right") && $(html).hasClass("siblings") ){
    Frame.delete_other_column(position);
  };
 
  //Si il y a plus de max_nb_vertical frames, on fait tout slider
  if(nb_frames >= Frame.max_nb_vertical){
    //on enlève la première frame
    frame_li.children().first().remove();
    //on affiche les boutons prev de la nouvelle premiere frame
    frame_li.children().first().find(".prev").each(function(){
      $(this).toggleClass("hidden");
    });
  }

  //on ajoute la nouvelle dernière frame
  frame_li.append(html);
};

//Ajoute une frame au début de la liste des frames
Frame.append_first_frame = function(html) {
  frame_li = $(Frame.frames_vertical_list);
  nb_frames = frame_li.children().size();

  //Si il y a plus de max_nb_vertical frames
  if(nb_frames >= Frame.max_nb_vertical){
    //on enlève la dernière frame
    frame_li.children().last().remove();
    //on affiche les boutons next de la nouvelle dernière frame
    frame_li.children().last().find(".next").each(function(){
      $(this).toggleClass("hidden");
    });
  }

  //TODO : reshow les cousins cachés si là maintenant on a plus qu'une colonne centrale ( ou un truc du genre)

  //on ajoute la nouvelle première frame
  $(html).insertBefore(frame_li.children().first());

};


//Cache un bouton et tous ses cousins
Frame.hide_buttons_and_cousins = function(button){
  double_frame = button.parents(".double_frame").first();

  if(double_frame.length == 0){
    button.addClass("hidden");

  } else {
    button_class = "";
    if(button.hasClass("next")){
      button_class = "next"
    } else if(button.hasClass("prev")){
      button_class = "prev"
    }
    frame_buttons = double_frame.children(".frame").children("." + button_class);
    frame_buttons.each(function(){
      $(this).toggleClass("hidden");
    });
  }

};

//Position d'un bouton. Renvoie central, left or right
Frame.position_of = function(button) {
  frame = button.parents(".frame").first();

  if(frame.hasClass("left_frame")) {
    return "left";
  } else if(frame.hasClass("right_frame")) {
    return "right";
  } else {
    return "central";
  }
};

//Suprimme l'autre colonne de frames par rapport a la position donnee
Frame.delete_other_column = function(position) {
  if(position == "left" || position == "right"){

    //On cache les frames de la colonne opposée
    frames_to_delete = $(".double_frame").children("."+ Frame.opposite(position) +"_frame");
    frames_to_delete.each( function() {
      $(this).addClass("hidden");
    });

    //On décale les frames de la même colonne
    frames_to_offset = $(".double_frame").children("."+ position +"_frame");
    frames_to_offset.each( function(){
      $(this).addClass("col-md-offset-3");
    });

  }
};

//Renvoie l'opposé de la string pour "left" ou "right". renvoie "central" sinon.
Frame.opposite = function(position){
  if(position == "left"){
    return "right";
  } else if(position == "right"){
    return "left";
  } else {
    return "central";
  }
};
