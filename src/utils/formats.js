class Format {
    time(date) {
        return new Intl.DateTimeFormat('cs', {
            hour: "numeric",
            minute: "numeric",
            second: "numeric"
        }).format(date).toString()
    }

    dateTime(date) {
        return new Intl.DateTimeFormat('cs', {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            day: "numeric",
            month: "numeric",
            year: "numeric",
        }).format(date).toString()
    }

    toHHMMSS(secs) {
        const sec_num = parseInt(secs, 10);
        const hours   = Math.floor(sec_num / 3600);
        const minutes = Math.floor(sec_num / 60) % 60;
        const seconds = sec_num % 60;

        return [hours,minutes,seconds]
            .map(v => v < 10 ? "0" + v : v)
            .filter((v,i) => v !== "00" || i > 0)
            .join(":")
    }

    diffInSeconds(date) {
        return Math.floor((new Date().getTime() - date.getTime()) / 1000);
    }


    diff(date) {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

        if(seconds < 0) {
            return this.toHHMMSS(0)
        }

        return this.toHHMMSS(seconds)
    }
}

export default new Format()