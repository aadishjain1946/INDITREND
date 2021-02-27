const tokenOpr = require('./jwt');
function checkToken(request, response, next) {
    // console.log(request.headers)
    var token = request.headers['x-csrf-token'];
    // console.log(token)
    if (token) {
        let decoded = tokenOpr.verifyToken(token);
        // console.log('After Token Verified ',decoded)
        if (!decoded) {
            response.status(200).json({ status: 'E', message: 'Invalid Token', token_result: false })

        }
        else {
            next();
        }
    }
    else {
        response.status(200).json({ status: "E", message: 'U r UnAuthorized to access this Page', token_result: false })
    }

}
module.exports = checkToken;