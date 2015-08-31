

//AU CHARGEMENT DE LA PAGE
$(document).on("ready page:load", function() {

  //Instanciate a reader with 3 frames max
  var reader=new Reader(3);
  console.log( "ready to read it !" ); 

});

 /////////////////////////////////////////////////////////////////////////////////////////
// READER OBJECT ------------------------------------------------------------------------
function Reader(nb_vertical)
{
   ///////////////////////////////
  //Attributes & Init

  this.element=$("#frames_vertical_list");
  this.max_nb_vertical=nb_vertical;
  this.framerows=this.element.children(".frame_row").map(function(i,e){ return new FrameRow(e) }).get();
  var reader = this; //needed into events where "this" refers to a button

   ///////////////////////////////
  //Methods

  //Returns an array of all the double framerows
  this.double_framerows=function(){
    var double_framerows=[];
    for(i=0; i < this.framerows.length; i++){
      var framerow=this.framerows[i];
      if(framerow.is_double){ double_framerows.push(framerow); };
    };
    return double_framerows;
  };

  //Returns the last brothers-framrow index
  this.last_siblings_framerow=function(){
    for(index=0; index < this.framerows.length; index++){ //TODO C'EST ICI BORDEL !
      var reverse_index = this.framerows.length - index - 1;
      var framerow=this.framerows[reverse_index];
      if(framerow.has_siblings){ return framerow; };
    };
    return null;
  };

  //TODO Organizes frames to be like they should. Yeah, that is quite vague...
  this.organize_frames=function(){
    var double_framerows=this.double_framerows();

    //If there is at least one double framerow, every frame is centered
    if(double_framerows.length == 0){
      console.log("tout le monde au centre");

    } else { //If there is at least one double framerow
      var last_siblings=this.last_siblings_framerow();

      // If there is at least a sibling
      if (last_siblings != null){
        console.log("le y à l'envers");

      } else { // If there is no siblings
        console.log("la double ligne, cassée et pas cassée");
        
      };
    };
    
  };

  //Add last framerow
  this.add_last_framerow=function(html){
    //Create the framerow
    var framerow=new FrameRow(html); 
    //Append the framerow
    this.element.append(framerow.element); 
    //Add the framrow object to the list
    this.framerows.push(framerow);
    //Bind the new buttons
    this.assign_buttons(framerow.element);
  };

  //Add first framerow
  this.add_first_framerow=function(html){
    //Create the framerow
    var framerow=new FrameRow(html);
    //Append the framerow
    framerow.element.insertBefore(this.element.children().first());
    //Add the framerow object to the list
    this.framerows.unshift(framerow);//unshift adds a first element
    //Bind the new buttons
    this.assign_buttons(framerow.element);
  };

  //Remove first framerow
  this.remove_first_framerow=function(html){
    //remove the first framerow element
    this.element.children().first().remove();
    //remove the first framerow form this.framerows
    this.framerows.shift();//shift removes the first element
    //Show the prev button of the new first framerow
    var new_first_framerow = this.framerows[0];
    new_first_framerow.show_prev_buttons();
  };

  //Remove last framerow
  this.remove_last_framerow=function(){
    //remove the last framerow element
    this.element.children().last().remove();
    //remove the last framerow form this.framerows
    this.framerows.pop();
    //Show the next button of the new last framerow
    var new_last_framerow = this.framerows[this.framerows.length - 1];
    new_last_framerow.show_next_buttons();
  }

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
      var last_framerow=reader.framerows[reader.framerows.length - 1];//can only use "last" on jQuery Arrays
      last_framerow.hide_buttons();
      //Creates and adds the new FrameRow
      reader.add_last_framerow(html);
      //Removes the first framerow if there is more than nb_max_vertical, and reveals the first prev button
      if(reader.framerows.length > reader.max_nb_vertical){ reader.remove_first_framerow(); };
      //Reorganizes frames
      reader.organize_frames();
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
      //Hides the button of the first row
      var first_framerow=reader.framerows[0];
      first_framerow.hide_buttons();
      //Creates and adds the new FrameRow
      reader.add_first_framerow(html);
      //Removes the first framerow if there is more than nb_max_vertical, and reveals the first prev button
      if(reader.framerows.length > reader.max_nb_vertical){ reader.remove_last_framerow(); };
      //Reorganizes frames
      reader.organize_frames();
    });
  };

  //Binds both events on buttons;
  this.assign_buttons=function(elem){
    elem.find(".next").on("click", this.next_event);
    elem.find(".prev").on("click", this.prev_event);
  };

   ///////////////////////////////
  // Init after defining functions 
  this.assign_buttons(this.element);
  console.log( "Reader up !");
  console.log(this);
};


 /////////////////////////////////////////////////////////////////////////////////////////
// FRAMEROW OBJECT ----------------------------------------------------------------------
function FrameRow(elem)
{
   ///////////////////////////////
  //Attributes & Init
  this.element=$(elem);
  this.frames=this.element.children(".frame").map(function(i,e){ return new Frame(e) }).get();
  this.is_double=this.element.hasClass("double_frame");
  this.is_solo=this.element.hasClass("solo_frame");
  this.has_cousins=this.element.hasClass("cousins");
  this.has_siblings=this.element.hasClass("siblings");


   ///////////////////////////////
  // Methods
  this.hide_buttons=function(){
    for(index = 0; index < this.frames.length; index++) {
      this.frames[index].hide_buttons();
    };
  };

  //un-hide prev buttons
  this.show_prev_buttons=function(){
    for(index = 0; index < this.frames.length; index++){
      this.frames[index].show_prev_button();
    };
  };

  //un-hide next buttons
  this.show_next_buttons=function(){
    for(index = 0; index < this.frames.length; index++){
      this.frames[index].show_next_button();
    };
  };

   ///////////////////////////////
  // Init after defining functions
  //console.log("FrameRow up !");
  //console.log(this);
};


 /////////////////////////////////////////////////////////////////////////////////////////
// FRAME OBJECT -------------------------------------------------------------------------
function Frame(elem)
{
   ///////////////////////////////
  //Attributes & Init
  this.element=$(elem);
  this.id=this.element.attr("data-id");
  this.parent_id=this.element.attr("data-parent_id");
  this.is_left=this.element.hasClass("left_frame");
  this.is_right=this.element.hasClass("right_frame");
  this.is_central=this.element.hasClass("central_frame");
  this.next_button=this.element.find(".next");
  this.prev_button=this.element.find(".prev");

   ///////////////////////////////
  //Methods
  this.hide_buttons=function(){
    this.next_button.addClass("hidden");
    this.prev_button.addClass("hidden");
  };

  //un-hide prev button
  this.show_prev_button=function(){
    this.prev_button.removeClass("hidden");
  };

  //un-hide next button
  this.show_next_button=function(){
    this.next_button.removeClass("hidden");
  };



   ///////////////////////////////
  // Init after defining functions
  console.log("Frame up !");
  console.log(this);
}



