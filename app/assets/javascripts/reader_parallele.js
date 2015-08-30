

//AU CHARGEMENT DE LA PAGE
$(document).on("ready page:load", function() {

  //Instanciate a reader with 3 frames max
  var reader=new Reader(3);
  console.log( "ready to read it !" ); 

});


// READER OBJECT -------------------------------------------------------------------------
function Reader(nb_vertical)
{
  //Attributes & Init
  this.element=$("#frames_vertical_list");
  this.max_nb_vertical=nb_vertical;
  this.frame_rows=this.element.children(".frame_row").map(function(i,e){ return new FrameRow(e) }).get();
  this.frames=$(this.frame_rows).map(function(i,row){ return row.frames }).get();

  //Methods
  this.add_first_framerow=function(){

  };
  this.add_last_framerow=function(){

  };
  this.organize_frames=function(){

  };

  //NEXT EVENT FOR BUTTON
  this.next_event=function(){
    button = $(this);
    console.log("next !");
  };

  //PREV EVENT FOR BUTTON
  this.prev_event=function(){
    button = $(this);
    console.log("prev !");
  };

  //Binds both events on buttons;
  this.assign_buttons=function(elem){
    elem.find(".next").on("click", this.next_event);
    elem.find(".prev").on("click", this.prev_event);
  };

  ////////////////////////////////
  // Init after defining functions;
  
  this.assign_buttons(this.element);
  console.log( "Reader up !");
  console.log(this);
};



// FRAMEROW OBJECT -----------------------------------------------------------------------
function FrameRow(elem)
{
  //Attributes & Init
  this.element=$(elem);
  this.frames=this.element.children(".frame").map(function(i,e){ return new Frrame(e) }).get();
  this.is_double=this.element.hasClass("double_frame");
  this.is_solo=this.element.hasClass("solo_frame");
  this.has_cousins=this.element.hasClass("cousins");
  this.has_siblings=this.element.hasClass("siblings");

  //Methods

  console.log("FrameRow up !");
  console.log(this);
};



// FRAMEROW OBJECT -----------------------------------------------------------------------
function Frrame(elem) // "Frame" est déjà pris :(
{
  //Attributes & Init
  this.element=$(elem);
  this.id=this.element.attr("data-id");
  this.parent_id=this.element.attr("data-parent_id");
  this.is_left=this.element.hasClass("left_frame");
  this.is_right=this.element.hasClass("right_frame");
  this.is_central=this.element.hasClass("central_frame");
  this.next_button=this.element.find(".next");
  this.prev_button=this.element.find(".prev");

  //Methods

  console.log("Frame up !");
  console.log(this);
}



