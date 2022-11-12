import React, {useState, useEffect} from "react";
import './invoicedetails.css';
import "../invoice/Invoice.css"
import { APIrequest } from "../axios/axios";
import { changeRupiah, formatDate } from "../../function/priceRupiah";
import { useLocation } from "react-router-dom";


const Data = (props)=>{
    const {item} = props;
    return(
    <tr>
        <td className="data-invoice-td-no">{item.no}</td>
        <td className="data-invoice-td">{item.name}</td>
        <td className="data-invoice-td">{item.category}</td>
        <td className="data-invoice-td">{item.quantity}</td>
        <td className="data-invoice-td">{changeRupiah(item.price)}</td>
    </tr>
    )
}

const InvDetails = ()=>{
    const location = useLocation();
    const [list, setList] = useState([]);

    useEffect(()=> {
        APIrequest({
            method: "GET",
            url: "/api/Data/GetInvoiceDetails",
            params: {
                user_id: location.state.user_id,
                order: location.state.order
            }
        }).then((res) => {
            if (res.status == 200) {
                setList(res.data);
            }
        }).catch((err) => {
            console.log(err.response.data);
        })
    }, [])
    return(
        <div className="invoice-container">
            <div className="invoice-directory-dt">
                <h2 className="invoice-home-dt">Home</h2>
                <h2 className="invoice-arrow-dt">{'>'}</h2>
                <h2 className="invoice-home-dt">Invoice</h2>
                <h2 className="invoice-arrow-dt">{'>'}</h2>
                <h2 className="invoice-title-dt">Details Invoice</h2>
            </div>
            <div>
                <h3 className="invoice-menu-dt">Details Invoice</h3>
            </div>
            <div className="container-detailsinv">
                <div className="container-notgl">
                    <div className="container-noinv">
                        <h3 className="font-details">No. Invoice :</h3>
                        <h3 className="font-details">{list.length == 0 ? "" : list[0].no_invoice}</h3>
                    </div>

                    <div className="container-noinv-tb">
                        <h3 className="font-details">Tanggal Beli :</h3>
                        <h3 className="font-details">{list.length == 0 ? "" : formatDate(list[0].buy_date)} </h3>
                    </div>
                </div>
                <div className="container-totprice">
                    <h3 className="invoice-menu-dt">Total Price</h3>
                    <h3 className="invoice-menu-dt">{list.length == 0 ? "" : changeRupiah(list[0].total_price)}</h3>
                </div>
            </div>
            <div className="table-container-mb">
                <table className="table-invoice">
                        <tr className="data-invoice-th">
                            <th className="data-invoice-th-no">No</th>
                            <th className="data-invoice-th">Product Name</th>
                            <th className="data-invoice-th">Category</th>
                            <th className="data-invoice-th">Total Product</th>
                            <th className="data-invoice-th">Price</th>
                        </tr>
                        {
                            list.length == 0? null :
                            list.map(item => <Data item={item}/> )
                        }
                     
                </table>
            </div>
        </div>
    )
}

export default InvDetails;