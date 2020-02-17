const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class SpeechFile extends Model{}

SpeechFile.init({
    // attributes
    uui:{
        primaryKey: true,
        type: Sequelize.UUID
    },
    transcribed: {
      type: Sequelize.BOOLEAN,  
      defaultValue: false
    },
  }, {
    sequelize,
    modelName: 'speechFile'
    // options
  });


module.exports = SpeechFile;
