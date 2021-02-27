inditrends.factory('AuthInterceptor', () => {
    return {
        request: function (config) {
            // console.log("@", localStorage.USERINDITREND);
            if (localStorage.USERINDITREND && !config.noAuth) {
                // console.log("yes1");
                config.headers['x-csrf-token'] = JSON.parse(localStorage.USERINDITREND);
            }
            else {
                // console.log("yes");
                config.headers['x-csrf-token'] = ("nothing");
            }
            // console.log(config)
            return config;
        },
        requestError: function (config) {
            // console.log(config)
            return config;
        },

        response: function (res) {
            // console.log(res)
            return res;
        },

        responseError: function (res) {
            // console.log(res)
            return res;
        }
    }
})