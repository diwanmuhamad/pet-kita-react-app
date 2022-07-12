import React, {useState,useEffect} from "react";
import { APIrequest } from '../axios/axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import './Product.css';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { changeRupiah, formatDate } from "../../function/priceRupiah";
import { useLocation, useHistory } from "react-router-dom";



const ListProduct = (props) => {
    const {offset, item, getItem, setProductList, open, setOpen} = props;
    const history = useHistory();

    const deleteProduct = () => {
        APIrequest({
            method: 'POST',
            url: "/api/Data/PostProduct",
            data: {...item, action_type: "delete"}
        }).then((res) => {
            if (res.status === 200) {
                APIrequest({
                    method: 'GET',
                    url: '/api/Data/GetProductAdmin',
                    params: {
                        offset: offset
                    }
                }).then((res) => {
                    if (res.status === 200) {
                        setProductList(res.data);   
                    }
                }).catch((err) => {
                    console.log(err.response.data);
                })
            }
        }).catch((err) => {
            console.log(err.response.data);
        })
    }

    return (
        <tr key={item.id}>
            <td className="id-table">{item.product_id}</td>
            <td>{item.name}</td>
            <td>{item.category}</td>
            <td>{changeRupiah(item.price)}</td>
            <td>{item.quantity}</td>
            <td className="button-list-edit">
                <button onClick={(e) => {e.preventDefault(); setOpen(true); getItem(item)}}>Edit</button>
                <button onClick={(e) => {e.preventDefault(); deleteProduct()}}>Delete</button>
                {/* <button onClick={(e) => {e.preventDefault(); history.push(`/details/${item.product_id}`)}}>Details</button> */}
            </td>
        </tr>
    )
}

const ListProductInvoice = (props) => {
    const {item, index} = props;

    return (
        <tr key={item.no}>
            <td className="id-table">{index+1}</td>
            <td className="id-table">{item.fk_user_id}</td>
            <td>{item.no_invoice}</td>
            <td>{formatDate(item.buy_date)}</td>
            <td>{item.total_product}</td>
            <td>{changeRupiah(item.total_price)}</td>
            <td>{item.address}</td>
            <td>{item.number}</td>
            <td>{item.payment}</td>
        </tr>
    )
}


const Prod = () => {
    const location = useLocation();
    if (location.state == undefined) {
        location.state = {
            product: "on",
            invoice: "off"
        }
    }
    const [wordSearch, setWordSearch] = useState("");
    const [productList, setProductList] = useState([]);
    const [open, setOpen] = useState(false);
    const [offset, setOffset] = useState(1);
    const [productData, setProductData] = useState({
        product_id: 0,
        name: "",
        category: "",
        desc: "",
        image_content: "",
        quantity: 0,
        price: 0,
        keywords: "",
        action_type: ""
    });
    const [invoiceList, setInvoiceList] = useState([]);

    useEffect(() => {
        APIrequest({
            method: "GET",
            url: "/api/Data/GetInvoiceAdmin",
            params: {
                offset: offset
            }
        }).then((res) => {
            if (res.status == 200) {
                setInvoiceList(res.data);
            }
        }).catch((err) => console.log(err.response.data))
    },[offset])

    useEffect(() => {
        APIrequest({
            method: 'GET',
            url: '/api/Data/GetProductAdmin',
            params: {
                offset: offset
            }
        }).then((res) => {
            if (res.status === 200) {
                setProductList(res.data);
            }
        }).catch((err) => {
            console.log(err.response.data);
        })
    }, [offset])
    
    const getItem = (item) => {
        setProductData({...item, action_type: "edit"});
    }

    const getProduct = (word) => {
        APIrequest({
            method: "GET",
            url: "/api/Data/GetProductAdmin",
            params: {
                offset: offset,
                search: word
            }
        }).then((res) => {
            if (res.status == 200) {
                setProductList(res.data);
            }
        }).catch((err) => console.log(err.response.data))
    }

    const handleClose = () => {
    setOpen(false);
    setProductData({
        product_id: 0,
        name: "",
        category: "",
        desc: "",
        image_content: "",
        quantity: 0,
        price: 0,
        keywords: "",
        action_type: ""
    });
    };
    
    const postProduct = () => {
        APIrequest({
            method: 'POST',
            url: "/api/Data/PostProduct",
            data: productData
        }).then((res) => {
            if (res.status === 200) {
                APIrequest({
                    method: 'GET',
                    url: '/api/Data/GetProductAdmin',
                    params: {
                        offset: offset
                    }
                }).then((res) => {
                    if (res.status === 200) {
                        setProductList(res.data);
                    }
                }).catch((err) => {
                    console.log(err.response.data);
                })
            }
        }).catch((err) => {
            console.log(err.response.data);
        })
    }

    return(
<div>
    {
        location.state.product == "on" && location.state.invoice == "off" ? 
        <div>
            <div className="container">
        <div className="title">
            <div style={{display: 'flex'}}>
                <h1>Pets</h1>
                <TextField onChange={(e) => getProduct(e.target.value)} id="outlined-search" label="Search Pets" type="search" sx={{width: "400px"}}></TextField>
                <Button onClick={(e) => {e.preventDefault(); setOpen(true); setProductData({...productData, action_type: "add"})}} variant="contained" sx={{backgroundColor: '#F99941', marginLeft:'10px', width:'50px', height:'55px', padding:'5px'}}>
                    Add
                </Button>

            </div>
           
            <div style={{display: "flex", marginTop: "15px", gap: "6px"}}>
                <button onClick={(e) => {
                    e.preventDefault();
                    if (offset - 1 >= 1) {
                        setOffset(offset-1);
                    }
                    
                }} className="buttonarrowadmin">&lt;</button>
                <h3 style={{color: "#F99941"}}>{offset}</h3>
                <button onClick={(e) => {
                    e.preventDefault();
                    setOffset(offset+1);
                }} className="buttonarrowadmin">&gt;</button>
            </div>
          
        </div>
        <div className="data">
            <table className="table-title">
                <tr>
                    <th className="id-table">Id</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Action</th>
                </tr>
                {
                    productList.length > 0 ? 
                    productList.map(item => {
                        return <ListProduct offset={offset} getItem={getItem} open={open} setOpen={setOpen} item={item} setProductList={setProductList}/>
                    })
                    : 
                    null
                }
            </table>
        </div>
    </div>
    <Dialog open={open} onClose={handleClose}>
            <div style={{width: '500px', height: '500px', padding: '20px'}}>

                <p style={{marginBottom: '5px', marginLeft: "38%", fontFamily: 'Nunito Sans'}}>Upload Gambar</p>
                <div style={{
                     border: "1px solid #ccc",
                     width: "100px",
                     height: "100px",
                     display: "inline-block",
                     overflow: "hidden",
                     cursor: "pointer",
                     marginBottom: '20px',
                     marginLeft: '39%',
                     
                     background: "center center no-repeat",
                     backgroundSize: "75% 75%",
                     backgroundImage:  "url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBoZWlnaHQ9IjUxMnB4IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9Ii01MyAxIDUxMSA1MTEuOTk5MDYiIHdpZHRoPSI1MTJweCI+CjxnIGlkPSJzdXJmYWNlMSI+CjxwYXRoIGQ9Ik0gMjc2LjQxMDE1NiAzLjk1NzAzMSBDIDI3NC4wNjI1IDEuNDg0Mzc1IDI3MC44NDM3NSAwIDI2Ny41MDc4MTIgMCBMIDY3Ljc3NzM0NCAwIEMgMzAuOTIxODc1IDAgMC41IDMwLjMwMDc4MSAwLjUgNjcuMTUyMzQ0IEwgMC41IDQ0NC44NDM3NSBDIDAuNSA0ODEuNjk5MjE5IDMwLjkyMTg3NSA1MTIgNjcuNzc3MzQ0IDUxMiBMIDMzOC44NjMyODEgNTEyIEMgMzc1LjcxODc1IDUxMiA0MDYuMTQwNjI1IDQ4MS42OTkyMTkgNDA2LjE0MDYyNSA0NDQuODQzNzUgTCA0MDYuMTQwNjI1IDE0NC45NDE0MDYgQyA0MDYuMTQwNjI1IDE0MS43MjY1NjIgNDA0LjY1NjI1IDEzOC42MzY3MTkgNDAyLjU1NDY4OCAxMzYuMjg1MTU2IFogTSAyNzkuOTk2MDk0IDQzLjY1NjI1IEwgMzY0LjQ2NDg0NCAxMzIuMzI4MTI1IEwgMzA5LjU1NDY4OCAxMzIuMzI4MTI1IEMgMjkzLjIzMDQ2OSAxMzIuMzI4MTI1IDI3OS45OTYwOTQgMTE5LjIxODc1IDI3OS45OTYwOTQgMTAyLjg5NDUzMSBaIE0gMzM4Ljg2MzI4MSA0ODcuMjY1NjI1IEwgNjcuNzc3MzQ0IDQ4Ny4yNjU2MjUgQyA0NC42NTIzNDQgNDg3LjI2NTYyNSAyNS4yMzQzNzUgNDY4LjA5NzY1NiAyNS4yMzQzNzUgNDQ0Ljg0Mzc1IEwgMjUuMjM0Mzc1IDY3LjE1MjM0NCBDIDI1LjIzNDM3NSA0NC4wMjczNDQgNDQuNTI3MzQ0IDI0LjczNDM3NSA2Ny43NzczNDQgMjQuNzM0Mzc1IEwgMjU1LjI2MTcxOSAyNC43MzQzNzUgTCAyNTUuMjYxNzE5IDEwMi44OTQ1MzEgQyAyNTUuMjYxNzE5IDEzMi45NDUzMTIgMjc5LjUwMzkwNiAxNTcuMDYyNSAzMDkuNTU0Njg4IDE1Ny4wNjI1IEwgMzgxLjQwNjI1IDE1Ny4wNjI1IEwgMzgxLjQwNjI1IDQ0NC44NDM3NSBDIDM4MS40MDYyNSA0NjguMDk3NjU2IDM2Mi4xMTMyODEgNDg3LjI2NTYyNSAzMzguODYzMjgxIDQ4Ny4yNjU2MjUgWiBNIDMzOC44NjMyODEgNDg3LjI2NTYyNSAiIHN0eWxlPSIgZmlsbC1ydWxlOm5vbnplcm87ZmlsbC1vcGFjaXR5OjE7IiBzdHJva2U9IiMwMDAwMDAiIGZpbGw9IiMwMDAwMDAiLz4KPHBhdGggZD0iTSAzMDUuMTAxNTYyIDQwMS45MzM1OTQgTCAxMDEuNTM5MDYyIDQwMS45MzM1OTQgQyA5NC43MzgyODEgNDAxLjkzMzU5NCA4OS4xNzE4NzUgNDA3LjQ5NjA5NCA4OS4xNzE4NzUgNDE0LjMwMDc4MSBDIDg5LjE3MTg3NSA0MjEuMTAxNTYyIDk0LjczODI4MSA0MjYuNjY3OTY5IDEwMS41MzkwNjIgNDI2LjY2Nzk2OSBMIDMwNS4yMjY1NjIgNDI2LjY2Nzk2OSBDIDMxMi4wMjczNDQgNDI2LjY2Nzk2OSAzMTcuNTkzNzUgNDIxLjEwMTU2MiAzMTcuNTkzNzUgNDE0LjMwMDc4MSBDIDMxNy41OTM3NSA0MDcuNDk2MDk0IDMxMi4wMjczNDQgNDAxLjkzMzU5NCAzMDUuMTAxNTYyIDQwMS45MzM1OTQgWiBNIDMwNS4xMDE1NjIgNDAxLjkzMzU5NCAiIHN0eWxlPSIgZmlsbC1ydWxlOm5vbnplcm87ZmlsbC1vcGFjaXR5OjE7IiBzdHJva2U9IiMwMDAwMDAiIGZpbGw9IiMwMDAwMDAiLz4KPHBhdGggZD0iTSAxNDAgMjY4Ljg2MzI4MSBMIDE5MC45NTMxMjUgMjE0LjA3NDIxOSBMIDE5MC45NTMxMjUgMzQ5LjEyNSBDIDE5MC45NTMxMjUgMzU1LjkyNTc4MSAxOTYuNTE5NTMxIDM2MS40OTIxODggMjAzLjMyMDMxMiAzNjEuNDkyMTg4IEMgMjEwLjEyNSAzNjEuNDkyMTg4IDIxNS42ODc1IDM1NS45MjU3ODEgMjE1LjY4NzUgMzQ5LjEyNSBMIDIxNS42ODc1IDIxNC4wNzQyMTkgTCAyNjYuNjQwNjI1IDI2OC44NjMyODEgQyAyNjkuMTEzMjgxIDI3MS40NTcwMzEgMjcyLjMzMjAzMSAyNzIuODIwMzEyIDI3NS42Njc5NjkgMjcyLjgyMDMxMiBDIDI3OC42MzY3MTkgMjcyLjgyMDMxMiAyODEuNzMwNDY5IDI3MS43MDcwMzEgMjg0LjA3ODEyNSAyNjkuNDgwNDY5IEMgMjg5LjAyNzM0NCAyNjQuNzgxMjUgMjg5LjM5ODQzOCAyNTYuOTg4MjgxIDI4NC42OTkyMTkgMjUyLjA0Mjk2OSBMIDIxMi4yMjY1NjIgMTc0LjI1MzkwNiBDIDIwOS44NzUgMTcxLjc4MTI1IDIwNi42NjAxNTYgMTcwLjI5Njg3NSAyMDMuMTk5MjE5IDE3MC4yOTY4NzUgQyAxOTkuNzM0Mzc1IDE3MC4yOTY4NzUgMTk2LjUxOTUzMSAxNzEuNzgxMjUgMTk0LjE3MTg3NSAxNzQuMjUzOTA2IEwgMTIxLjY5OTIxOSAyNTIuMDQyOTY5IEMgMTE3IDI1Ni45ODgyODEgMTE3LjM3MTA5NCAyNjQuOTAyMzQ0IDEyMi4zMTY0MDYgMjY5LjQ4MDQ2OSBDIDEyNy41MTE3MTkgMjc0LjE3OTY4OCAxMzUuMzAwNzgxIDI3My44MDg1OTQgMTQwIDI2OC44NjMyODEgWiBNIDE0MCAyNjguODYzMjgxICIgc3R5bGU9IiBmaWxsLXJ1bGU6bm9uemVybztmaWxsLW9wYWNpdHk6MTsiIHN0cm9rZT0iIzAwMDAwMCIgZmlsbD0iIzAwMDAwMCIvPgo8L2c+Cjwvc3ZnPgo=)"
                }}>
                    
                    <input style={{
                         height: "100%",
                         width: "100",
                         opacity: "0",
                         cursor: "pointer"
                    }}type='file'
                    onChange={(e) => {
                        let tempImage=e.target.files[0];
                        let reader = new FileReader();
                        reader.readAsDataURL(tempImage);
                        reader.onload = () => {
                            setProductData({...productData, image_content: reader.result});
                        }
                        
                   
                    }}
                    
                    />
                </div>
                
                    
                

                <TextField value={productData.name} onChange={(e) => {setProductData({...productData, name: e.target.value})}} fullWidth id="fullWidth" label="Name" variant="outlined" />
                <FormControl sx={{marginTop: '20px'}} fullWidth>
                    <InputLabel id="demo-simple-select-label">Category</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    
                    label="Category"
                    value={productData.category}
                    onChange={(e) => {setProductData({...productData, category: e.target.value})}}
                    >
                    <MenuItem value={"Cat"}>Cat</MenuItem>
                    <MenuItem value={"Dog"}>Dog</MenuItem>
                    <MenuItem value={"Bird"}>Bird</MenuItem>
                    <MenuItem value={"Hamster"}>Hamster</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    value={productData.desc}
                    onChange={(e) => {setProductData({...productData, desc: e.target.value})}}
                    id="outlined-multiline-static"
                    label="Description"
                    multiline
                    rows={4}
                    sx={{width: '100%', marginTop: '20px'}}
                    />
                <TextField type="number" value={productData.price == 0? "" : productData.price} onChange={(e) => {
                    e.target.value != "" ? setProductData({...productData, price: parseInt(e.target.value)})
                    : setProductData({...productData, price: 0})
                    }} sx={{marginTop: '20px'}} fullWidth id="fullWidth" label="Price" variant="outlined" />
                <TextField type="number" value={productData.quantity == 0? "" : productData.quantity} onChange={(e) => {
                    e.target.value != "" ? setProductData({...productData, quantity: parseInt(e.target.value)})
                    : setProductData({...productData, quantity: 0})
                    }} sx={{marginTop: '20px'}} fullWidth id="fullWidth" label="Quantity" variant="outlined" />
                <TextField value={productData.keywords} onChange={(e) => {setProductData({...productData, keywords: e.target.value})}} sx={{marginTop: '20px', marginBottom: "20px"}} fullWidth id="fullWidth" label="Keywords" variant="outlined" />
                <Button onClick={(e) => {e.preventDefault(); handleClose(); postProduct()}} variant="contained" sx={{marginLeft: '41%', marginTop: '20px', marginBottom: "20px", backgroundColor: '#F99941', width:'80px', height:'40px', padding:'5px', marginTop:'5px'}}>
                    Submit
                </Button>

            </div>
    
        
        </Dialog> 
        </div>
        :
        location.state.invoice == "on" && location.state.product == "off" ? 
        
        <div className="container">
            <div className="title">
                <div style={{display: 'flex'}}>
                    <h1>Invoice</h1>

                </div>
            
                <div style={{display: "flex", marginTop: "15px", gap: "6px"}}>
                    <button onClick={(e) => {
                        e.preventDefault();
                        if (offset - 1 >= 1) {
                            setOffset(offset-1);
                        }
                        
                    }} className="buttonarrowadmin">&lt;</button>
                    <h3 style={{color: "#F99941"}}>{offset}</h3>
                    <button onClick={(e) => {
                        e.preventDefault();
                        setOffset(offset+1);
                    }} className="buttonarrowadmin">&gt;</button>
                </div>
            
            </div>
            <div className="data">
                <table className="table-title">
                    <tr>
                        <th className="id-table">No</th>
                        <th className="id-table">User ID</th>
                        <th>No. Invoice</th>
                        <th>Buy Date</th>
                        <th>Total Product</th>
                        <th>Total Price</th>
                        <th>Address</th>
                        <th>Number</th>
                        <th>Payment</th>
                    </tr>
                    {
                        invoiceList.length > 0 ? 
                        invoiceList.map((item, index) => {
                            return <ListProductInvoice index={index} item={item}/>
                        })
                        : 
                        null
                    }
                </table>
            </div>
        </div>
        : null

        
    }
    
</div>
    )
}

export default Prod