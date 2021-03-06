class Format {
    toHHMMSS(secs) {
        const sec_num = parseInt(secs, 10)
        const hours = Math.floor(sec_num / 3600)
        const minutes = Math.floor(sec_num / 60) % 60
        const seconds = sec_num % 60

        return [hours, minutes, seconds]
            .map((v) => (v < 10 ? "0" + v : v))
            .filter((v, i) => v !== "00" || i > 0)
            .join(":")
    }

    diffInSeconds(date) {
        return Math.floor((new Date().getTime() - date.getTime()) / 1000)
    }

    diff(date) {
        const seconds = this.diffInSeconds(date)

        if (seconds < 0) {
            return this.toHHMMSS(0)
        }

        return this.toHHMMSS(seconds)
    }

    getHM(date) {
        return this._num2(date.getHours())+
            ":"+this._num2(date.getMinutes())
    }

    toHMSWords(date) {
        const seconds = this.diffInSeconds(date)

        if (seconds < 60) {
            return seconds + "s"
        } else if (seconds < 60 * 60) {
            return Math.round(seconds / 60) + "min"
        } else if (seconds < 60 * 60 * 60) {
            return Math.round(seconds / 60 / 60) + "h"
        } else if (seconds < 60 * 60 * 60 * 24) {
            return Math.round(seconds / 60 / 60 / 24) + "d"
        }

        return Math.round(seconds / 60 / 60 / 24 / 7) + "w"
    }

    toDMYHMS(date) {
        return (
            date.getDate() +
            ". " +
            (date.getMonth() + 1) +
            ". " +
            date.getFullYear() +
            " " +
            this._num2(date.getHours()) +
            ":" +
            this._num2(date.getMinutes()) +
            ":" +
            this._num2(date.getSeconds())
        )
    }

    _num2(num) {
        if (num.toString().length < 2) {
            return "0" + num
        }

        return num
    }
}

export default new Format()
