var response = function (data, status, message) {
    var result = {
        data: data || {},
        status: status || "OK",
        message: message || ""
    };
    return result;
};

module.exports = response;