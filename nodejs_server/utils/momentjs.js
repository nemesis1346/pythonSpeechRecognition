
"use strict";
const moment = require('moment');

module.exports={

    calculateDuration: function (duration) {
        let recordDurationMoment = moment(duration, "HH:mm:ss")
        let recordDurationString = recordDurationMoment.format("HH:mm:ss")
        //we convert it to seconds
        var a = recordDurationString.split(':');
        let secondsDuration = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
        console.log('MOMENT DURATION')
        console.log(recordDurationString.toString())
        console.log(secondsDuration)
        return secondsDuration;
    }

}

