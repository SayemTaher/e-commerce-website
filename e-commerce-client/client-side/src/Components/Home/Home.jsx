import React from 'react';
import { Outlet } from 'react-router';
import Footer from '../Footer/Footer';
import NavBar from '../NavBar/NavBar';

const Home = () => {
    return (
        <div>
            <NavBar></NavBar>
            <div>
                <Outlet>
                    

            </Outlet> 
            </div>
            <Footer></Footer>
            
        </div>
    );
};

export default Home;