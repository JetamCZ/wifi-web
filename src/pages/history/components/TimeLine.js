import React, {useEffect, useState} from "react";
import formats from "../../../utils/formats";

const TimeLine = (props) => {
    const today = () => {
        const t = new Date()
        t.setHours(0)
        t.setMinutes(0)
        t.setSeconds(0)

        return t
    }

    const [start, setStart] = useState(today())
    const [look, setLook] = useState("DAY")

    useEffect(() => {
        props.start && setStart(props.start)
        props.look && setLook(props.look)

        if(props?.look === "WEEK") {
            const resDate = props.start ? new Date(props.start.getTime()) : today()
            while (resDate.getDay() !== 1) {
                resDate.setDate(resDate.getDate() - 1)
            }
            setStart(resDate)
        }

        if(props?.look === "MONTH") {
            const resDate = props.start ? new Date(props.start.getTime()) : today()
            resDate.setDate(1)
            setStart(resDate)
        }
    }, [props])

    const getTime = (date, secMore) => {
        const resDate = new Date(date.getTime());

        resDate.setSeconds(resDate.getSeconds() + secMore)

        return resDate
    }

    const dmy = (date) => {
        return date.getDate() + ". " + (date.getMonth() + 1) + ". " + date.getFullYear()
    }

    const switchLook = (e) => {
        const look = e.target.value

        if(look === "MONTH") {
            setStart(new Date(start.getFullYear(), start.getMonth(), 1))
        }

        if(look === "WEEK") {
            const resDate = new Date(start.getTime());
            while (resDate.getDay() !== 1) {
                resDate.setDate(resDate.getDate() - 1)
            }
            console.log(resDate.toString())
            setStart(resDate)
        }

        setLook(look)
    }

    const handlePrevNext = (move) => {
        const resDate = new Date(start.getTime());

        switch (look) {
            case "DAY_DETAIL":
            case "DAY":
                resDate.setDate(start.getDate() + move)
                break
            case "WEEK":
                resDate.setDate(start.getDate() + move*7)
                break
            case "MONTH":
                resDate.setMonth(start.getMonth() + move)
                break
        }

        setStart(resDate)
    }

    const getTimesProps = () => {
        const num2 = (num) => {
            if (num < 10) {
                return "0" + num
            }

            return num
        }

        switch (look) {
            case "MONTH":
                return {
                    timeSpan: 60 * 60 * 6,
                    count: 30 * 4 + 1,
                    formatTime: (e) => {
                        return num2(e.getHours()) + ":00"
                    },
                    bottomLine: 4,
                    bottomLineFormat: (e) => {
                        return e.getDate() + ". " + (e.getMonth() + 1) + "."
                    },
                    formatTitle: (e) => {
                        return (e.getMonth() + 1) + "/" + e.getFullYear()
                    },
                }
            case "WEEK":
                return {
                    timeSpan: 60 * 60 * 3,
                    count: 7 * 8 + 1,
                    formatTime: (e) => {
                        return num2(e.getHours()) + ":00"
                    },
                    bottomLine: 8,
                    bottomLineFormat: (e) => {
                        return e.getDate() + ". " + (e.getMonth() + 1) + "."
                    },
                    formatTitle: (e) => {
                        return start.getDate() + ". " + (start.getMonth() + 1) + ". - " + dmy(end)
                    },
                }
            case "DAY_DETAIL":
                return {
                    timeSpan: 60 * 5,
                    count: 24 * 60 / 5 + 1,
                    formatTime: (e) => formats.getHM(e),
                    formatTitle: (e) => {
                        return dmy(e)
                    },
                }
            case "DAY":
            default:
                return {
                    timeSpan: 60 * 15,
                    count: 24 * 60 / 15 + 1,
                    formatTime: (e) => formats.getHM(e),
                    formatTitle: (e) => {
                        return dmy(e)
                    },
                }
        }
    }

    const getEnd = () => {
        const resDate = new Date(start.getTime());

        resDate.setSeconds(resDate.getSeconds() + (timeProps.count) * timeProps.timeSpan)

        return resDate
    }

    const timeProps = getTimesProps()
    const end = getEnd()

    const getItemActivities = (item) => {
        return item.activities.filter(activity => activity.from > start && activity.to < end)
    }

    const getLength = (activity) => {
        const diff = Math.floor((activity.to.getTime() - activity.from.getTime()) / 1000)
        return diff / timeProps.timeSpan * 50
    }

    const getStart = (activity) => {
        const diff = Math.floor((activity.from.getTime() - start.getTime()) / 1000)
        return diff / timeProps.timeSpan * 50
    }

    const getNow = () => {
        const diff = Math.floor((new Date().getTime() - start.getTime()) / 1000)
        return diff / timeProps.timeSpan * 50 + 25
    }

    return (
        <div className="timeline-wrapper">
            <div className="title">
                <h1>{props.title}
                    <div className="sub-h1">{timeProps.formatTitle(start)}</div>
                </h1>

                <div className="select">
                    <div className="prev" onClick={() => handlePrevNext(-1)}>-</div>
                    <div className="sel">
                        <select value={look} onChange={switchLook}>
                            <option value="DAY_DETAIL">Den (podrobněji)</option>
                            <option value="DAY">Den</option>
                            <option value="WEEK">Týden</option>
                            <option value="MONTH">Měsíc</option>
                        </select>
                    </div>
                    <div className="next" onClick={() => handlePrevNext(1)}>+</div>
                </div>
            </div>

            <div className="timeline">
                <div className="left">
                    <div className="time"></div>
                    {
                        props.items.map(item =>
                            <div className="item" key={item.name}>
                                <div className="name">{item.name}</div>
                                <div className="sub">{item.sub}</div>
                            </div>
                        )
                    }
                    {
                        timeProps?.bottomLine && <div className="time"></div>
                    }
                </div>
                <div className="right">
                    {
                        start < new Date() && new Date() < end &&
                            <div className="now" style={{left: getNow()}}></div>
                    }

                    <div className="time">
                        {
                            [...Array(timeProps.count)].map((t, index) =>
                                <div className="item" key={index}>
                                    {
                                        timeProps.formatTime(getTime(start, timeProps.timeSpan * index))
                                    }
                                </div>
                            )
                        }
                    </div>
                    {
                        props.items.map(item =>
                            <div className="activity">
                                <div className="boxes">
                                    {
                                        [...Array(timeProps.count)].map((t, index) =>
                                            <div className="box" key={index}></div>
                                        )
                                    }
                                </div>
                                {
                                    getItemActivities(item).map((activity) =>
                                        activity.tooltip ? (
                                            <div className="timeStamp tooltip-bottom-right" data-tooltip={activity.tooltip} style={{
                                                width: getLength(activity),
                                                left: getStart(activity)
                                            }}></div>
                                        ) : (
                                            <div className="timeStamp" style={{
                                                width: getLength(activity),
                                                left: getStart(activity)
                                            }}></div>
                                        )
                                    )
                                }
                            </div>
                        )
                    }
                    {
                        timeProps?.bottomLine && <div className="time">
                            {
                                [...Array(timeProps.count)].map((t, index) =>
                                    <div className="item" key={index}>
                                        {
                                            index % timeProps.bottomLine === 0 && timeProps.bottomLineFormat(getTime(start, timeProps.timeSpan * index))
                                        }
                                    </div>
                                )
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default TimeLine