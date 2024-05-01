// const parent = document.getElementById("root");
// const heading = document.createElement('h1');
// heading.innerText = 'Programming World!';
// parent.appendChild(heading);


// const React = require('react');
// const ReactDOM = require('react-dom/client');
// const parent = document.getElementById("root");
// const root = ReactDOM.createRoot(parent);
// const heading1 = <h1>Programming World Again!</h1>
// const heading2 = () => {
//     return <h1>Programming World Again!</h1>
// }
// root.render(heading2());



// const React = require('react');
// const ReactDOM = require('react-dom/client');
// const parent = document.getElementById("root");
// const root = ReactDOM.createRoot(parent);
// const Heading1 = <h1>Programming World Again!</h1>
// const Heading2 = () => {
//     return <h1>Programming World!</h1>
// }
// // root.render(Heading2());
// // root.render(Heading1);
// root.render(<Heading2/>);



// import React from "react";
// import ReactDOM from 'react-dom/client';
// const parent = document.getElementById("root");
// const root = ReactDOM.createRoot(parent);
// const App = () => {
//     return <h1>Programming World!</h1>
// }
// root.render(<App/>);



// import React from "react";
// import ReactDOM from 'react-dom/client';
// const parent = document.getElementById("root");
// const root = ReactDOM.createRoot(parent);
// const Navbar = () => {
//     return(
//         <div class='navbar'>
//             <a>Home</a>
//             <a>Image generator</a>
//             <a>Contact Us</a>
//         </div>
//     )
// }
// const App = () => {
//     return (
//         <div>
//             <Navbar />
//         </div>
//     )
// }
// root.render(<App/>);


import React from "react";
import ReactDOM from 'react-dom/client';

import Navbar from "./src/components/Navbar.js";
import ImageGenerator from "./src/components/ImageGenerator.js";
import History from "./src/components/History.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const parent = document.getElementById("root");
const root = ReactDOM.createRoot(parent);

const router = createBrowserRouter([
    {
        path: "/",
        element: <>
            <Navbar />
            <ImageGenerator />
        </>
    },
    {
        path: "/image-generator",
        element: <>
            <Navbar />
            <ImageGenerator />
        </>,
    },
    {
        path: "/history",
        element: <>
            <Navbar />
            <History />
        </>,
    },
    {
        path: "/contact-us",
        element: <>
            <Navbar />
            <div>Contact US</div>
        </>,
    }
]);

const App = () => {
    return (
        <RouterProvider router={router} />
    )
}
root.render(<App/>);



