import axios from 'axios';

// axios interceptors
axios.interceptors.request.use(
  function(req) {
    // request start time
    req.time = {startTime: new Date()};
    return req;
  },
  error => {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  function(res) {
    // total duration to get response
    res.config.time.endTime = new Date();
    res.duration = res.config.time.endTime - res.config.time.startTime;
    return res;
  },
  error => {
    // error handling in case of api failure and rate limiting
    let errorText = 'Something went wrong!';
    let errorCode;
    if (error.response) {
      const {status} = error.response;

      //status code for rate limiting
      if (status === 429) {
        errorText = 'Too many requests. Please try again later.';
      } else if (status == 408) {
        errorText = 'Request Timeout';
      } else {
        errorText = 'Code: ' + status + ' Error fetching data';
      }
      errorCode = status;
    } else {
      // device offline
      errorText = 'Network Error!';
    }

    return Promise.reject({error: error, errorText: errorText, errorCode});
  },
);

export default axios;
