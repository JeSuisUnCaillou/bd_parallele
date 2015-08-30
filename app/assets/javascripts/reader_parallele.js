

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
  this.framerows=this.element.children(".frame_row").map(function(i,e){ return new FrameRow(e) }).get();
  this.framerows=this.framerows;
  this.frames=$(this.framerows).map(function(i,row){ return row.frames }).get();
  var reader = this; //needed into events where "this" refers to a button

  //Methods

  this.organize_frames=function(){

  };

  this.add_last_framerow=function(html){
    //Creates the framerow
    framerow=new FrameRow(html); 
    //Appends the framerow
    this.element.append(framerow.element); 
    //Adds the framrow object to the list
    this.framerows.push(framerow);
    //Binds the new buttons
    this.assign_buttons(framerow.element);
  };

  this.remove_first_framerow=function(html){
    this.element.children().first().remove();
    this.framerows.shift();//.shift() pops the first element
  };

  this.add_first_framerow=function(html){
    
  };

  //NEXT EVENT FOR BUTTON
  this.next_event=function(){
    button=$(this);
    frame_id=button.attr("data-next");
    $.ajax({ 
             method: "GET",
             url: "/ajax_next",
             data: {frame_id: frame_id}
           }
    ).done(function(html) {
      console.log("next !");
      //Hides the button of the last row
      last_framerow=reader.framerows[reader.framerows.length - 1];//can only use "last" on jQuery Arrays
      last_framerow.hide_buttons();
      //Creates and adds the new FrameRow
      reader.add_last_framerow(html);
      //Removes the first framerow if there is more than nb_max_vertical, and reveals the first button
      if(reader.framerows.length > reader.max_nb_vertical){
        reader.remove_first_framerow(); 
      }
    });
  };

  //PREV EVENT FOR BUTTON
  this.prev_event=function(){
    button=$(this);
    frame_id=button.attr("data-prev");
    $.ajax({ 
             method: "GET",
             url: "/ajax_prev",
             data: {frame_id: frame_id}
           }
    ).done(function(html) {
      console.log("prev !");
      
    });
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
  this.hide_buttons=function(){
    for(index = 0; index < this.frames.length; index++) {
      this.frames[index].hide_buttons();
    };
  };

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
  this.hide_buttons=function(){
    this.next_button.addClass("hidden");
    this.prev_button.addClass("hidden");
  };


  ////////////////////////////////
  // Init after defining functions;
  
  console.log("Frame up !");
  console.log(this);
}



