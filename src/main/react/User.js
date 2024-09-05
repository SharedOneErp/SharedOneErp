import React from "react";
import ReactDOM from 'react-dom/client';

function User() {

    return (
        <div>
            <h3>유저페이지 입니다</h3>
        </div>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <User />
);