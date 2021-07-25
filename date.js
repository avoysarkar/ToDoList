//module.exports.functionname = functionname;

exports.getDate = function(){
    const today = new Date();
    // for getiing current date and day
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    return today.toLocaleDateString("en-US",options);
};

exports.getDay = function(){
    const today = new Date();
    const options = {
        weekday: "long"
    }
    return today.toLocaleDateString("en-US",options);
};
