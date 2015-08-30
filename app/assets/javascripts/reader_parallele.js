

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
  this.frame_rows = this.element.children(".frame_row").map( function(i, elem){ return new FrameRow(elem) }).get();

  //Methods
  this.add_first_frame=function(){

  };
  this.add_last_frame=function(){

  };
  this.reorganize=function(){

  };

  console.log( "Reader up !");
};



// FRAMEROW OBJECT -----------------------------------------------------------------------
function FrameRow(elem)
{
  //Atributes & Init
  this.element=elem;
  this.type=this.elem.hasClass(".double_frame") ? "double" : this.elem.hasClass("solo_frame") ? "solo" : "unknown";
  

  console.log("FrameRow up !");
};




