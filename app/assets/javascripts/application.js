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





//   /!\ WARNING /!\ /!\ WARNING /!\ /!\ WARNING /!\
//   /!\ WARNING /!\ /!\ WARNING /!\ /!\ WARNING /!\

// TOUT CE QUI SUIT EST UN CIMETIERE DE CODE DEGUEULASSE.

//   /!\ WARNING /!\ /!\ WARNING /!\ /!\ WARNING /!\
//   /!\ WARNING /!\ /!\ WARNING /!\ /!\ WARNING /!\



//$(document).on("ready page:load", function() {
//$( document ).ready(function() {
    //console.log( "ready to read !" );

    //Frrame.add_next_event($(".next"));
    //Frrame.add_prev_event($(".prev"));
//});


//TODO : foutre en attribut de Frrame les méthodes ajax, ainsi que les noms des classes et attributs des éléments du DOM dont on a besoin
Frrame = { max_nb_vertical: 3,
          frames_vertical_list: "#frames_vertical_list"}

//NEXT EVENT
Frrame.next = function() {
  button = $(this)
  console.log(Frrame.position_of(button) + " next!");
  frame_id = button.attr("data-next");
  $.ajax({ method: "GET",
           url: "/ajax_next",
           data: {frame_id: frame_id}
         }
  ).done(function(html) {
    // ON AJOUTE LA NOUVELLE FRAME (ou double frame) et on fait défiler
    Frrame.append_last_frame(html, button);

    //ON CACHE LE BOUTON CLIQUE
    Frrame.hide_buttons_and_cousins(button);

    //ON DETECTE LES NOUVEAUX BOUTONS
    new_next_buttons = $(html).find(".next")
    new_prev_buttons = $(html).find(".prev")

    // ON AJOUTE LES EVENTS PREV & NEXT AUX NOUVEAUX BOUTONS
    Frrame.add_next_event(new_next_buttons);
    Frrame.add_prev_event(new_prev_buttons);
  });
};

//PREV EVENT
Frrame.prev = function() {
  button = $(this);
  console.log(Frrame.position_of(button) + " prev!");
  frame_id = button.attr("data-prev");
  $.ajax({ method: "GET",
           url: "/ajax_prev",
           data: {frame_id: frame_id}
  }).done(function(html) {
    //ON AJOUTE LA NOUVELLE FRAME (ou double frame) et on fait défiler
    Frrame.append_first_frame(html, button);

    //ON CACHE LE BOUTON CLIQUE
    Frrame.hide_buttons_and_cousins(button);

    //ON DETECTE LES NOUVEAUX BOUTONS
    new_next_buttons = $(html).find(".next");
    new_prev_buttons = $(html).find(".prev");

    // ON AJOUTE LES EVENTS PREV & NEXT AUX NOUVEAUX BOUTONS
    Frrame.add_next_event(new_next_buttons);
    Frrame.add_prev_event(new_prev_buttons);
  });
};

//Ajoute l'évènement Frrame.next sur une liste d'éléments (lus dans un retour ajax)
Frrame.add_next_event = function(elements){
  elements.each(function(){
    $(".next[data-next='"+$(this).attr("data-next")+"']").on("click", Frrame.next)
  });
};

//Ajoute l'évènement Frrame.prev sur une liste d'éléments (lus dans un retour ajax)
Frrame.add_prev_event = function(elements){
  elements.each(function() {
    $(".prev[data-prev='"+$(this).attr("data-prev")+"']").on("click", Frrame.prev)
  });
};


//Ajoute une frame à la fin de la liste des frames
Frrame.append_last_frame = function(html, button){
  frame_li = $(Frrame.frames_vertical_list);
  nb_frames = frame_li.children().size();
  position = Frrame.position_of(button);
    
  //Si il y avait déjà 2 frames de large et que l'on s'apprète à afficher 2 frères (et non un enfant et un cousin), on enlève l'autre colonne
  if( (position == "left" || position == "right") && $(html).hasClass("siblings") ){
    Frrame.delete_other_column(position);
  };
 
  //Si il y a plus de max_nb_vertical frames, on fait tout slider
  if(nb_frames >= Frrame.max_nb_vertical){
    //on enlève la première frame
    frame_li.children().first().remove();
    //on affiche les boutons prev de la nouvelle premiere frame
    frame_li.children().first().find(".prev").each(function(){
      $(this).toggleClass("hidden");
    });
  }
  //on a delete la première frame

  //si la nouvelle frame est simple (mais que l'on a une double branche - toujours le cas ?), on la décale
  new_html = $(html)
  new_is_central = new_html.children(".central").length > 0;
  has_double_frames = $(".double_frame").length > 0
  if(has_double_frames && new_is_central){
    
    Frrame.offset_central_frame(new_html, position);
  }

  //si on a que des with_offset, on les replace au centre
  offset_frames = $(".with_offset")
  if(offset_frames.length == Frrame.max_nb_vertical - 1){
     offset_frames.each( function(){
       Frrame.remove_offset_central_frame($(this));
     });
  };

  //on ajoute la nouvelle dernière frame
  frame_li.append(new_html);
};


//Ajoute une frame au début de la liste des frames
Frrame.append_first_frame = function(html, button) {
  frame_li = $(Frrame.frames_vertical_list);
  nb_frames = frame_li.children().size();
  position = Frrame.position_of(button);
  frame = button.parents(".frame").first();

  //Si il y a plus de max_nb_vertical frames, on fait tout slider
  if(nb_frames >= Frrame.max_nb_vertical){
    //on enlève la dernière frame
    frame_li.children().last().remove();
    //on affiche les boutons next de la nouvelle dernière frame
    frame_li.children().last().find(".next").each(function(){
      $(this).toggleClass("hidden");
    });
  }
  //On a delete la dernière frame

  //Reshow les cousins cachés si on a plus qu'une colonne centrale
  nb_fake_centrals = $(".double_frame").find(".frame.hidden").length;
  nb_centrals = $(".central").length;
  if(nb_fake_centrals + nb_centrals == Frrame.max_nb_vertical - 1){
    Frrame.show_hidden_cousins(position);
  }
  
  //Si la nouvelle frame est double et qu'on a une simple (mais pas offset) ou des siblings en top position, on cache une des double-frames
  new_html = $(html)
  new_frame_is_double = new_html.hasClass("double_frame")
  top_frame = frame_li.children().first();
  top_frame_is_solo = (!top_frame.hasClass("double_frame")) || ($(top_frame).find(".frame.hidden").length > 0);
  top_frame_is_siblings = top_frame.hasClass("siblings");

  if(new_frame_is_double && (top_frame_is_solo || top_frame_is_siblings )){
    //TODO RAJOUTER CONDITION SUR SI ON VA LA DECALER OU PAS en fonction de $(top_frame).children(".with_offset").length > 0 mais avant qu'on ai pu mettre l'offset. facile hein connard ?
    console.log("Et tu cache!");
    parent_frame = new_html.find(".frame[data-id='"+frame.attr("data-parent-id")+"']");
    parent_position = Frrame.position_of_frame(parent_frame);

    new_html.find("." + Frrame.opposite(parent_position) + "_frame").addClass("hidden");
    new_html.find("." + parent_position + "_frame").addClass("col-md-offset-3");
    
    //Si on a des central frames en dessous, on cherche la branche soit terminée, soit avec 2 enfants, en on décale les centrale frames sur la branche opposée
    central_frames = $(".central");
    no_children_frame = new_html.find(".frame.no_children");
    dead_end_frame = no_children_frame
    if(no_children_frame.length == 0){
      dead_end_frame = new_html.find(".frame.several_children");
    };//now we got the right dead_end_frame
    offset_position = Frrame.opposite( Frrame.position_of_frame(dead_end_frame) );
    central_frames.each( function(){
      Frrame.offset_central_frame($(this), offset_position);
    });

    //TODO : placer ça à un endroit qui nous permettrait de faire le décalage
    //on ajoute la nouvelle première frame
    new_html.insertBefore(frame_li.children().first());

  } else {
    //on ajoute la nouvelle première frame
    new_html.insertBefore(frame_li.children().first());
  }
};


//Cache un bouton et tous ses cousins
Frrame.hide_buttons_and_cousins = function(button){
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

//Position d'une frame. Renvoie central, left ou right
Frrame.position_of_frame = function(frame) {  
  if(frame.hasClass("left_frame")) {
    return "left";
  } else if(frame.hasClass("right_frame")) {
    return "right";
  } else {
    return "central";
  }
};

//Position d'un bouton. Renvoie central, left ou right
Frrame.position_of = function(button) {
  frame = button.parents(".frame").first();
  return Frrame.position_of_frame(frame);
};

//Suprimme l'autre colonne de frames par rapport a la position donnee
Frrame.delete_other_column = function(position) {
  if(position == "left" || position == "right"){

    //On cache les frames de la colonne opposée
    frames_to_delete = $(".double_frame").children("."+ Frrame.opposite(position) +"_frame");
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

//Révèle les cousins cachés et enlève l'offset sur les parents
Frrame.show_hidden_cousins = function(position){
  cousins = $("." + Frrame.opposite(position) + "_frame.hidden");
  parents = $("." + position + "_frame.col-md-offset-3");
  cousins.each( function(){
    $(this).toggleClass("hidden");
  });
  parents.each( function(){
    $(this).toggleClass("col-md-offset-3");
  });
};

//Renvoie l'opposé de la string pour "left" ou "right". renvoie "central" sinon.
Frrame.opposite = function(position){
  if(position == "left"){
    return "right";
  } else if(position == "right"){
    return "left";
  } else {
    return "central";
  }
};


//Décale une frame à la position donnée
Frrame.offset_central_frame = function(frame, position){
  if(!frame.hasClass("central")){
    frame = frame.children(".central").first();
  }
  if(position == "right"){
    frame.removeClass("col-md-offset-3");
    frame.addClass("col-md-offset-6");
    frame.removeClass("central");
    frame.addClass("right_frame");
    frame.addClass("with_offset");
  } else if(position =="left"){
    frame.removeClass("col-md-offset-3"); 
    frame.addClass("left_frame")
    frame.removeClass("central");
    frame.addClass("with_offset");
  } else {
    console.log("This is not a central frame");
  }
};

//Replace au milieu une central_frame décalée
Frrame.remove_offset_central_frame = function(frame, position){
  if(frame.hasClass("left_frame")){
    frame.removeClass("left_frame");
    frame.addClass("central");
    frame.addClass("col-md-offset-3");
    frame.removeClass("with_offset");
  } else if(frame.hasClass("right_frame")){
    frame.removeClass("right_frame");
    frame.addClass("central");
    frame.removeClass("col-md-offset-6");
    frame.addClass("col-md-offset-3");
    frame.removeClass("with_offset");
  } else {
    console.log("This was not an offset central frame");
  }
};

