import React, {useEffect, useState} from "react";
import AxiosInstance from "../../utils/AxiosInstance";
import T from "../../components/T";
import MiniChart from "react-mini-chart"
import formats from "../../utils/formats";
import {Sparklines, SparklinesLine} from "react-sparklines";

function ViewDeviceModalOld() {
    const [data, setData] = useState(null)
    const [oldData, setOldData] = useState(null)


    useEffect(() =>{
        const int = setInterval(update, 2000)

        return () => {
            clearInterval(int)
        }
    }, [])

    const update = () => {
        AxiosInstance.get('/devices/60181fd484a2081728b69fc9')
            .then(res => {
                setData(res.data)
                console.log(oldData)
                setOldData(res.data)
/*
                const newOldRSSI = {...oldRSSI}

                console.log(newOldRSSI)

                for (const meet of res.data.meets) {
                    if(!newOldRSSI[meet.deviceKey]) {
                        newOldRSSI[meet.deviceKey] = []
                    }

                    newOldRSSI[meet.deviceKey].push(meet.rssi)
                }

                setOldRSSI(newOldRSSI)
                console.log(newOldRSSI)*/


            })
            .catch(err => {

            })
    }

    if(!data) {
        return (
            <h2>
                <T id="loading" />
            </h2>
        )
    }

    console.log(oldData)

    return (
        <div></div>
    )
}

class ViewDeviceModal extends React.Component{
    constructor(props) {
        super(props);

        this.state = {data: null}

        this.inv = setInterval(this.update.bind(this), 1000)

        this.oldRSSI = {}
    }

    componentWillUnmount() {
        clearInterval(this.inv)
    }

    update() {
        AxiosInstance.get('/devices/'+this.props.id)
            .then(res => {
                this.setState({data: res.data})

                for (const meet of res.data.meets) {
                    if(!this.oldRSSI[meet.deviceKey]) {
                        this.oldRSSI[meet.deviceKey] = []
                    }

                    if(this.oldRSSI[meet.deviceKey].length >= 20) {
                        this.oldRSSI[meet.deviceKey].shift()
                    }

                    this.oldRSSI[meet.deviceKey].push(meet.rssi*(-1))
                }

                console.log(this.oldRSSI)


            })
            .catch(err => {

            })
    }


    render() {
        if(!this.state.data) {
            return (
                <h2>
                    <T id="loading" />
                </h2>
            )
        }

        return (
            <div>
                <h1>{this.state.data.name}</h1>
                <br/>
                <div className="summary">
                    <div className="item">
                        <div className="title">MAC adresa:</div>
                        <div className="value">{this.state.data.mac}</div>
                    </div>
                    <div className="item">
                        <div className="title">Vlastník:</div>
                        <div className="value">{this.state.data.user.name}</div>
                    </div>
                </div>

                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Maják</th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.data.meets.map(meet =>
                            <tr key={meet._id}>
                                <td>{meet.name}</td>
                                <td>
                                    <Sparklines data={this.oldRSSI[meet.deviceKey] ?? []} style={{height: "50px"}}>
                                        <SparklinesLine color="#32d893" />
                                    </Sparklines>
                                </td>
                                <td>{meet.rssi}</td>
                                <td>
                                    {formats.toHMSWords(new Date(meet.lastSeenDate))}
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default ViewDeviceModal