import React, {useState} from "react";
import { useHistory, useLocation } from "react-router-dom";
import './SecondContentPS.css'

const Lpsearch2 = () =>{
    const [boxSearch, setBoxSearch] = useState(false);
    const history = useHistory();
    const location = useLocation();
    
    if (location.state != undefined) {
        if (location.state.sort == undefined) {
            location.state.sort = "";
        }
        if (location.state.data == undefined) {
            location.state.data = "";
        }
        if (location.state.min == undefined) {
            location.state.min = 0;
        }
        if (location.state.max == undefined) {
            location.state.max = 0;
        }
        if (location.state.all == undefined) {
            location.state.all = "";
        }
        if (location.state.dog == undefined) {
            location.state.dog = "";
        }
        if (location.state.cat == undefined) {
            location.state.cat = "";
        }
        if (location.state.bird == undefined) {
            location.state.bird = "";
        }
        if (location.state.hamster == undefined) {
            location.state.hamster = "";
        }

    }

    if (location.state == undefined) {
        location.state = {
            search: "",
            sort: "",
            min: 0,
            max: 0,
            all: "",
            cat: "",
            dog: "",
            bird: "",
            hamster: ""
        }
    }

    const [all, setAll] = useState(false);
    const [bird, setBird] = useState(false);
    const [cat, setCat] = useState(false);
    const [dog, setDog] = useState(false);
    const [hamster, setHamster] = useState(false);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);
    const [change1, setChange1] = useState(false);
    const [change2, setChange2] = useState(false);
    const [change3, setChange3] = useState(false);
    const [change4, setChange4] = useState(false);
  
    return(
    <div  className="sort">
        <div onClick={(e) => {
                    e.preventDefault();
                    setBoxSearch(!boxSearch);
        }} className={boxSearch ? "filterblur-image-search" : "displayMissing"}></div>
        <div>
            <h2 className="text-sort">Sort</h2>
            <div className="button-sort">
                <button onClick={(e) => {
                    e.preventDefault();
                    setBoxSearch(!boxSearch);
                }} className="filterbutton-mobile">
                    <img style={{marginRight: "5px"}} src={require("../../sourceImage/filter.png")}></img>
                    Filter</button>
                <button onClick={() => {
                    history.push("/search", {data: location.state.data, sort: "new", min: location.state.min, max: location.state.max, all: location.state.all, bird: location.state.bird, dog: location.state.dog, cat: location.state.cat, hamster: location.state.hamster, categoryPage: location.state.categoryPage});
                    setChange1(!change1); setChange2(false); setChange3(false); setChange4(false)}} className={change1? "button-new" : "button-OHL"}>Newest</button>
                <button onClick={() => {
                    history.push("/search", {data: location.state.data, sort: "old", min: location.state.min, max: location.state.max, all: location.state.all, bird: location.state.bird, dog: location.state.dog, cat: location.state.cat, hamster: location.state.hamster, categoryPage: location.state.categoryPage});
                    setChange2(!change2); setChange1(false); setChange3(false); setChange4(false)}} className={change2? "button-new" : "button-OHL"}>Older</button>
                <button onClick={() => {
                    history.push("/search", {data: location.state.data, sort: "high", min: location.state.min, max: location.state.max, all: location.state.all, bird: location.state.bird, dog: location.state.dog, cat: location.state.cat, hamster: location.state.hamster, categoryPage: location.state.categoryPage});
                    setChange3(!change3); setChange1(false); setChange2(false); setChange4(false)}} className={change3? "button-new" : "button-OHL"}>High Price</button>
                <button onClick={() => {
                    history.push("/search", {data: location.state.data, sort: "low", min: location.state.min, max: location.state.max, all: location.state.all, bird: location.state.bird, dog: location.state.dog, cat: location.state.cat, hamster: location.state.hamster, categoryPage: location.state.categoryPage});
                    setChange4(!change4); setChange2(false); setChange3(false); setChange1(false)}} className={change4? "button-new" : "button-OHL"}>Low Price</button>
            </div>
        </div>
        <div className={boxSearch? "filter-box-inmobile": "displayMissing"}>
            <h2 className="text-filter">Filter</h2>
            {
                location.state.categoryPage == "on" ? null :
                <div className="Pet-Checkbox">
                    <label className="text-category">Category</label>
                        <div className="Pet-checkbox-label">
                            <div onClick={() => {
                                setAll(!all);
                            }} className={all ? "checkboxchecked":"checkboxdiv"}><p className="checklistmark">&#10004;</p></div>
                            
                            <label>All Category</label>
                        </div>
                        <div className="Pet-checkbox-label">
                        <div onClick={() => {
                                setBird(!bird);
                            }} className={bird ? "checkboxchecked":"checkboxdiv"}><p className="checklistmark">&#10004;</p></div>
                            
                            <label>Bird</label>
                        </div>
                        <div className="Pet-checkbox-label">
                        <div onClick={() => {
                                setCat(!cat);
                            }} className={cat ? "checkboxchecked":"checkboxdiv"}><p className="checklistmark">&#10004;</p></div>
                            <label >Cat</label>
                            </div>
                        <div className="Pet-checkbox-label">
                        <div onClick={() => {
                                setDog(!dog);
                            }} className={dog ? "checkboxchecked":"checkboxdiv"}><p className="checklistmark">&#10004;</p></div>
                            <label>Dog</label>
                        </div>
                        <div className="Pet-checkbox-label">
                        <div onClick={() => {
                                setHamster(!hamster);
                            }} className={hamster ? "checkboxchecked":"checkboxdiv"}><p className="checklistmark">&#10004;</p></div>
                            <label>Hamster</label>
                        </div>
                    <div className="button-checkbox">
                        <button onClick={(e) => {
                            e.preventDefault();
                            setAll(false); setBird(false); setCat(false); setDog(false); setHamster(false);
                            history.push("/search", {data: location.state.data, sort: location.state.sort, min: location.state.min, max: location.state.max, all: "", bird: "", dog: "", cat: "", hamster: "", categoryPage: location.state.categoryPage})
                        }} className="button-clear">Clear</button>
                        <button onClick={(e) => {
                            e.preventDefault();
                            if (all) {
                                history.push("/search", {data: location.state.data, sort: location.state.sort, min: location.state.min, max: location.state.max, all: "all", bird: location.state.bird, dog: location.state.dog, cat: location.state.cat, hamster: location.state.hamster, categoryPage: location.state.categoryPage})
                            }
                            else {
                                if (cat && dog && hamster && bird) {
                                    history.push("/search", {data: location.state.data, sort: location.state.sort, min: location.state.min, max: location.state.max, all: "", bird: "bird", dog: "dog", cat: "cat", hamster: "hamster", categoryPage: location.state.categoryPage})
                                }
                                else if (cat && dog && hamster) {
                                    history.push("/search", {data: location.state.data, sort: location.state.sort, min: location.state.min, max: location.state.max, all: "", bird: "", dog: "dog", cat: "cat", hamster: "hamster", categoryPage: location.state.categoryPage})
                                }
                                else if (cat && dog && bird) {
                                    history.push("/search", {data: location.state.data, sort: location.state.sort, min: location.state.min, max: location.state.max, all: "", bird: "bird", dog: "dog", cat: "cat", hamster: "", categoryPage: location.state.categoryPage})
                                }
                                else if (hamster && dog && bird) {
                                    history.push("/search", {data: location.state.data, sort: location.state.sort, min: location.state.min, max: location.state.max, all: "", bird: "bird", dog: "dog", cat: "", hamster: "hamster", categoryPage: location.state.categoryPage})
                                }
                                else if (cat && dog) {
                                    history.push("/search", {data: location.state.data, sort: location.state.sort, min: location.state.min, max: location.state.max, all: "", bird: "", dog: "dog", cat: "cat", hamster: "", categoryPage: location.state.categoryPage})
                                }
                                else if (cat && bird) {
                                    history.push("/search", {data: location.state.data, sort: location.state.sort, min: location.state.min, max: location.state.max, all: "", bird: "bird", dog: "", cat: "cat", hamster: "", categoryPage: location.state.categoryPage})
                                }
                                else if (cat && hamster) {
                                    history.push("/search", {data: location.state.data, sort: location.state.sort, min: location.state.min, max: location.state.max, all: "", bird: "", dog: "", cat: "cat", hamster: "hamster", categoryPage: location.state.categoryPage})
                                }
                                else if (dog && hamster) {
                                    history.push("/search", {data: location.state.data, sort: location.state.sort, min: location.state.min, max: location.state.max, all: "", bird: "", dog: "dog", cat: "", hamster: "hamster", categoryPage: location.state.categoryPage})
                                }
                                else if (dog && bird) {
                                    history.push("/search", {data: location.state.data, sort: location.state.sort, min: location.state.min, max: location.state.max, all: "", bird: "bird", dog: "dog", cat: "", hamster: "", categoryPage: location.state.categoryPage})
                                }
                                else if (hamster && bird) {
                                    history.push("/search", {data: location.state.data, sort: location.state.sort, min: location.state.min, max: location.state.max, all: "", bird: "bird", dog: "", cat: "", hamster: "hamster", categoryPage: location.state.categoryPage})
                                }
                                else if (bird) {
                                    history.push("/search", {data: location.state.data, sort: location.state.sort, min: location.state.min, max: location.state.max, all: "", bird: "bird", dog: "", cat: "", hamster: "", categoryPage: location.state.categoryPage})
                                }
                                else if (hamster) {
                                    history.push("/search", {data: location.state.data, sort: location.state.sort, min: location.state.min, max: location.state.max, all: "", bird: "", dog: "", cat: "", hamster: "hamster", categoryPage: location.state.categoryPage})
                                }
                                else if (dog) {
                                    history.push("/search", {data: location.state.data, sort: location.state.sort, min: location.state.min, max: location.state.max, all: "", bird: "", dog: "dog", cat: "", hamster: "", categoryPage: location.state.categoryPage})
                                }
                                else if (cat) {
                                    history.push("/search", {data: location.state.data, sort: location.state.sort, min: location.state.min, max: location.state.max, all: "", bird: "", dog: "", cat: "cat", hamster: "", categoryPage: location.state.categoryPage})
                                }
                            }
                        }}className="button-apply">Apply</button>
                        </div>
                </div>

            }
            
            <div>
                <div className="Range-Price">
                    <label className="text-range">Range Price</label>
                    <div className="button-min-max">
                        <div className="min">
                            <label>Min</label>
                            <input type="number" value={min == 0 ? "" : min} onChange={(e) => {
                                setMin(parseInt(e.target.value))

                            }
                            } style={{height:'40px', paddingLeft: '5px'}} placeholder="Rp"></input>
                        </div>
                        <div className="max">
                            <label>Max</label>
                            <input type="number" value={max == 0? "" : max} onChange={(e) => 
                                 setMax(parseInt(e.target.value))
                             } style={{height:'40px', paddingLeft: '5px'}} placeholder="Rp"></input>
                        </div>
                    </div>
                
                    <div className="button-checkbox">
                        <button onClick={(e) => {e.preventDefault(); setMin(0); setMax(0); history.push("/search", {data: location.state.data, sort: location.state.sort, min: 0, max: 0, all: location.state.all, bird: location.state.bird, dog: location.state.dog, cat: location.state.cat, hamster: location.state.hamster, categoryPage: location.state.categoryPage})}} className="button-clear clear22">Clear</button>
                        <button onClick={(e) => {e.preventDefault(); 
                            history.push("/search", {data: location.state.data, sort: location.state.sort, min: min, max: max, all: location.state.all, bird: location.state.bird, dog: location.state.dog, cat: location.state.cat, hamster: location.state.hamster, categoryPage: location.state.categoryPage})
                        }}className="button-apply apply22">Apply</button>
                    </div>

                </div>
            </div>
        </div>
    </div>
    )
}

export default Lpsearch2