export const validateEmail = (email : string) => {
    const pattern : string =  "\[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]\.[a-zA-Z]{2,}";

    if(!email.match(pattern)){
        return false
    }

    return true;
}


export const validatePhone = (phone : string) => {
    const pattern : string =  "0+[0-9]{9}";

    if(!phone.match(pattern)){
        return false
    }

    return true;
}