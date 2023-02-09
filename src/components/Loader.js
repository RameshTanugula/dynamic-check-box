import * as React from 'react';
import "./common.css"

export default function Loader() {
    return (
        <div className="Loader" >
            <span className="spinner" >
                <img src="/images/loading.gif" style={{ height: "150px" }} />
                <br />
                <span style={{ fontSize: "25px", fontWeight: "bolder", marginLeft: "30px" }}>Loading...</span>
            </span>
        </div>
    )
}