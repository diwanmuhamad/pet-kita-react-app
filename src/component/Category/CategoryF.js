import React from "react";
import './CategoryF.css'

const CategoryF = () =>{
    return(
    <div className="sort">
        <div>
            <h2 className="text-sort">Sort</h2>
            <div className="button-sort">
                <button className="button-new">Newest</button>
                <button className="button-OHL">Older</button>
                <button className="button-OHL">High Price</button>
                <button className="button-OHL">Low Price</button>
            </div>
        </div>
        <div>
            <h2 className="text-filter">Filter</h2>
            <div>
                <div className="Range-Price">
                    <label className="text-range">Range Price</label>
                    <div className="button-min-max">
                        <div className="min">
                            <label>Min</label>
                            <input style={{height:'40px'}} placeholder="  Rp"></input>
                        </div>
                        <div className="max">
                            <label>Max</label>
                            <input style={{height:'40px'}} placeholder="  Rp"></input>
                        </div>
                    </div>
                
                <div className="button-checkbox">
                    <button className="button-clear">Clear</button>
                    <button className="button-apply">Apply</button>
                </div>

                </div>
            </div>
        </div>
    </div>
    )
}

export default CategoryF