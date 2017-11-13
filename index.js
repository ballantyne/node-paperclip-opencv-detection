const cv                  = require('opencv');

// This is mostly just an example showing how opencv can be integrated.  I think that
// there must be some other really interesting applications of opencv and better ways 
// of configuring if you have any suggestions, please feel from to make a pull request.

module.exports            = function(paperclip) {
  var obj = {};
  obj.paperclip           = paperclip;
  obj.perform             = function(options, next) {
    if (options.object_type == undefined) {
      options.object_type = 'FACE_CASCADE';
    }
    if (options.dataset == undefined) {
      options.dataset = cv[options.object_type];
      options.custom  = false;
    } else {
      options.custom  = true;
      if (options.attribute == undefined) {
        options.attribute = 'objects';
        console.log('');
        console.log('NODE-PAPERCLIP-OPENCV-DETECTION:');
        console.log('You can set the attribute option in the before_save task to save the information with a custom key.')
        console.log('');
      }
    }

    cv.readImage(this.paperclip.file().file.buffer, function(err, im){
      im.detectObject(options.dataset, {}, function(err, objects){
        if (options.custom == true) {
          var object = {};
	  object[options.attribute] = {count: objects.length, data: objects}
          next(err, object);
        } else {
          if (objects && objects.length > 0) {
            switch(options.object_type) { 
              case 'FACE_CASCADE':
                next(err, {objects: {count: objects.length, data: faces}});
                break;
              case 'EYE_CASCADE':
                next(err, {eyes: {count: objects.length, data: objects}});
                break;
              case 'EYEGLASSES_CASCADE':
                next(err, {glasses: {count: objects.length, data: objects}});
                break;
              case 'FULLBODY_CASCADE':
                next(err, {cars: {count: objects.length, data: objects}});       
                break;
              case 'CAR_SIDE_CASCADE':
                next(err, {car_profiles: {count: objects.length, data: objects}});      
                break;
            }
          } else {
            next(err, {});
          }
        }
      });
    })
  }
  return obj;
}
