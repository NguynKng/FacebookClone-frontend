import { Link } from "react-router-dom"
import PropTypes from 'prop-types';
import { useState } from "react";
import Navbar from "./Navbar";
import Header from "./Header";
import Meta from "./Meta";
import Footer from "./Footer";

function MainLayout({ Element }) {
    return (
        <>
            <Meta title={`Facebook`} />
            <Header />
            <div className={`relative z-10`}>
                <Navbar />
                <div className={`absolute w-full top-[8vh] right-0 lg:w-[75%]`}>
                    <div className="p-6">
                        <Element />
                    </div>
                </div>
            </div>
        </>
    )
}

MainLayout.propTypes = {
    Element: PropTypes.elementType.isRequired,
};

export default MainLayout