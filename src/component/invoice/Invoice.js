import React, {useState, useEffect} from "react";
import './Invoice.css';
import { useHistory } from "react-router-dom";
import { changeRupiah, formatDate } from "../../function/priceRupiah";
import { APIrequest } from "../axios/axios";


const Data = (props) =>{
    const {item, index} = props;
    const history = useHistory();
    
    return(
        <tr key={item.order_invoice}>
        <td className="data-invoice-td-no">{index+1}</td>
        <td className="data-invoice-td">{item.no_invoice}</td>
        <td className="data-invoice-td">{formatDate(item.buy_date)}</td>
        <td className="data-invoice-td">{item.total_product}</td>
        <td className="data-invoice-td">{changeRupiah(item.total_price)}</td>
        <td className="data-invoice-td">
        <button onClick={(e) => {
            e.preventDefault();
            history.push("/invoicedetails", {order: item.order_invoice, user_id: item.fk_user_id});
            
        }} className="invoice-det">Details</button>
        </td>
    </tr>
    )
}


const Inv = () =>{
    const [list, setList] = useState([]);

    useEffect(() => {
        APIrequest({
            method: "GET",
            url: "/api/Data/GetInvoice",
            params : {
                user_id : localStorage.getItem("@user")
            }
        }).then((res) => {
            if (res.status == 200) {
                setList(res.data.reverse());
            }
            
        }).catch((err) => {
            console.log(err.response.data);
        })
    }, [])
    return(
        <div className="invoice-container">
            <div className="Invoice-directory">
                <h2 className="invoice-home">Home</h2>
                <h2 className="invoice-arrow">{'>'}</h2>
                <h2 className="invoice-title">Invoice</h2>
            </div>
            <div>
                <h3 className="invoice-menu">Invoice Menu</h3>
            </div>
            <div className="table-container-mb">
                <table className="table-invoice">
                    <tr>
                        <th className="data-invoice-th-no">No</th>
                        <th className="data-invoice-th">No. Invoice</th>
                        <th className="data-invoice-th">Buy Date</th>
                        <th className="data-invoice-th pro">Total Product</th>
                        <th className="data-invoice-th">Total Price</th>
                        <th className="data-invoice-th act">Action</th>
                    </tr>
                    {
                        list.length == 0 ? null :
                        list.map((item, index) => {
                            return <Data index={index} item={item}/>;
                        })
                        
                    }
                </table>
            </div>
        </div>
    )
}

export default Inv