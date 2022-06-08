const moment = require('moment');

const datetimediff = (start,end) => {
    var duration = moment.duration(moment(start).diff(end));
    return {
        days : duration.days(),
        hours : duration.hours(),
        minutes:duration.minutes(),
        seconds:duration.seconds(),
        weeks: duration.weeks(),
        months:duration.months(),
        years: duration.years()
    }
}

module.exports = {
    datetimediff
}