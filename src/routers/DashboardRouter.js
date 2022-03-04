import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Navbar } from '../components/components/Navbar';


import {MenuScreen} from '../components/menu/MenuScreen';
import { RegisterAttendanceScreen } from '../components/register-attendance/RegisterAttendanceScreen';
import { RegisterMatriculaScreen } from '../components/register-matricula/RegisterMatriculaScreen';
import { EditMember } from '../components/register-member/EditMember';
import { RegisterMember } from '../components/register-member/RegisterMember';
import { AlumnosScreen } from '../components/tables/AlumnosScreen';
import { MatriculasScreen } from '../components/tables/MatriculasScreen';




export const DashboardRouter = () => {


    return (
        <>
            <Navbar/>

            <div className="container-flayer">
                <div className="container-dashboard">

                
                    <Switch>
                        <Route exact path="/menu" component={ MenuScreen }/>
                        <Route exact path="/register-matricula" component={ RegisterMatriculaScreen }/>
                        <Route exact path="/attendance" component={ RegisterAttendanceScreen }/>
                        <Route exact path="/register-member" component={ RegisterMember }/>
                        <Route exact path="/edit-member" component={ EditMember }/>
                        <Route exact path="/matriculas" component={ MatriculasScreen }/>
                        <Route exact path="/members" component={ AlumnosScreen }/>

                        <Redirect to="/menu"/>
                    </Switch>

                </div>
            </div>


        </>
    )
}
