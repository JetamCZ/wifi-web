import React from 'react';
import Text from "../components/Text";
import setHeader from "../utils/setHeader";
import Breadcrumbs from "../components/Breadcrumbs";

const Dashboard = () => {
    setHeader('Dashboard')

    return (
        <div className="page-dashboard w-page-800">
            <Breadcrumbs items={[
                {href: '', item: <Text id={'menu.dashboard'}>Dashboard</Text>}
            ]}/>

            <div className="jumbotron shadow">
                <div className="text">
                    <h3><Text id={'dashboard.welcome'}>Vítej, zpět</Text> <span className="underline">Matěji</span>!</h3>
                    <p>
                        Quisque tincidunt scelerisque libero. Nam libero tempore, cum soluta nobis est
                        eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.
                    </p>

                    <a href="/"><Text id={"moreinfo"}>Vice info</Text></a>
                </div>
                <div className="image">
                    <img src='/img/people/094.png' className="u--pulse animation-infinite"/>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;