import axios from "axios";
const API_URL = "https://career.afganturkmaarif.org/test2/api/";
class Request {
    make_request_get(url, setResult) {

        return axios
            ({
                url: API_URL + url,
                method: 'get',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then(response => {
                setResult(response.data)
                return response.data;
            }).catch(function (error) {

                if (error.response) {
                    if (error.response.data) {
                        console.log(error.response.data.message)
                        console.log(error.response.status)
                  
                    } else {
                        console.log('There is a problem with your network')
                    }
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
            })
    }


    make_request_post(url, posted_data, setResult, isfile = false) {

        var isExcuted = false;
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            // 'Content-type': 'application/json; charset=UTF-8',
        };
        var data_for_post;
        if (isfile == false) {
            data_for_post = JSON.stringify({ posted_data })
        } else {
            data_for_post = posted_data
        }
        return axios.post(API_URL + url, data_for_post, {
            headers
        }).then(response => {
            setResult()
            isExcuted = true
            setResult(response.data)
            // console.table(response.data)
            return response.data;
        }).catch(function (error) {
            isExcuted = true
            console.log(error)
            setResult()
            if (error.response) {
                if (error.response.status) {
                    

                }
                if (error.response.status) {
                    if (error.response.status == 422) {
                        setResult({ error: error.response.data.message })
                        return false
                    }

                }
                if (error.response.data) {
                    setResult(error.response.data.message)
                    console.log(error.response.data.message)
                    console.log(error.response.status)
                } else {
                    setResult('There is a problem with your network')
                    console.log('There is a problem with your network')
                }
            } else if (error.request) {
                setResult(error.response)
                console.log(error.request);
            } else {
                setResult(error.message)
                console.log('Error', error.message);
            }
        }).then(function () {
            if (!isExcuted) {
                setResult()
            }
            // always executed
        });
    }
}

export default new Request();