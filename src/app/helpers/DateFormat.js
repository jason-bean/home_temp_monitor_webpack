import ZeroFill from './ZeroFill.js'

export default class DateFormat {
    static toTimeString(date) {
        if (date instanceof Date) {
            var twelveHour = this.getAMPM(date)

            return twelveHour.hours + ':' + ZeroFill(date.getMinutes(), 2) + ' ' + twelveHour.ampm
        }

        return ''
    }

    static toDateTimeString(date) {
        if (date instanceof Date) {
            var twelveHour = this.getAMPM(date)

            return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + twelveHour.hours + ':' + ZeroFill(date.getMinutes(), 2) + ' ' + twelveHour.ampm
        }

        return ''
    }

    static toFullDateTimeString(date) {
        if (date instanceof Date) {
            var twelveHour = this.getAMPM(date)

            return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + twelveHour.hours + ':' + ZeroFill(date.getMinutes(), 2) + ':' + ZeroFill(date.getSeconds(), 2) + ' ' + twelveHour.ampm
        }
        
        return ''
    }

    static getAMPM(date) {
        var hours = date.getHours()
        var ampm

        if (hours > 11) {
            if (hours > 12) {
                hours = hours - 12
            }

            ampm = 'PM'
        } else {
            if (hours === 0) {
                hours = 12;
            }

            ampm = 'AM'
        }

        return { hours: hours, ampm: ampm }
    }
}