import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Route, Routes, Link} from "react-router-dom";


function FrontPage() {
    return <div>
        <div><Link to="/login">Login</Link></div>
        <div><Link to="/profile">Profile</Link></div>
    </div>;
}

function Application() {
    return <BrowserRouter>
        <Routes>
            <Route path={"/"} element={<FrontPage/>} />
            <Route path={"/login"} element={<h1>Login</h1>} />
            <Route path={"/login/callback"} element={<h1>Login Callback</h1>} />
            <Route path={"/profile"} element={<h1>Profile</h1>} />
        </Routes>
    </BrowserRouter>;
}

ReactDOM.render(<Application/>, document.getElementById("app"));