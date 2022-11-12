export const changeRupiah = (price) => {
    price = price.toString().split("").reverse().join("");
    let result = "";
    for (let i = 0; i < price.length; i+=3) {
        if (i+3 < price.length) {
            result += price.substring(i, i+3) + ".";
        }
        else {
            result += price.substring(i, i+3);
        }
    }
    return "Rp. " + result.split("").reverse().join("");
}

export const changeFirstLetter = (text) => {
    return text.substring(0,1).toUpperCase() + text.substring(1);
}

export const generateInvoice = (order) => {
    order = order.toString()
    let zero = "";
    for (let i = 0; i < 5 - order.length; i++) {
        zero += "0";
    }

    return "PKA" + zero + order;
    
}

export const formatDate = (date) => {
    let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Agu", "Okt", "Nov", "Des"];
    date = date.split(" ");
    date = date[0].split("/");

    let result = "";
    for (let i = 0; i < date.length; i++) {
        if (i == 1) {
            result += month[date[i]-1] + "-";
        }
        else if (i == 2) {
            result += date[i].toString();
        }
        else {
            result += date[i].toString() + "-";
        }
    }

    return result;

}