import qs from 'query-string';

class ApiClient {
  constructor(fetch, req) {
    ['get', 'post', 'put', 'patch', 'del'].
      forEach((method) => {
        this[method] = (path, options) => {
          let fetchUrl = this.formatUrl(path);
          if (options && options.params) {
            fetchUrl += "?";
            fetchUrl += qs.stringify(options.params);
          }
          let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          };
          if (options && options.token) {
            headers['Authorization'] = 'JWT ' + options.token;
          }
          if (__SERVER__ && req) {
            if (req.get('cookie')) {
              headers['cookie'] = req.get('cookie');
            }
          }
          let body = {};
          if (options && options.data) {
            body = JSON.stringify(options.data);
          }
          return new Promise((resolve, reject) => {
            fetch(fetchUrl, {
              method: method,
              headers: headers,
              credentials: 'same-origin',
              body: body
            }).then((response) => {
              let retVal = {};
              if (response.status == 204) { // No content
                return new Promise((res, rej) => {
                  return res({});
                });
              } else if (response.status >= 200 && response.status < 300) {
                return response.json();
              } else {
                return new Promise((res, rej) => {
                  return res(response.json());
                }).then((json) => {
                  let error = new Error(response.statusText);
                  error.response = response;
                  error.body = json;
                  throw error;
                })
              }
            }).then((json) => {
              return resolve(json);
            }).catch((error) => {
              return reject(error);
            });
          });
        };
      });
  }

  /* This was originally a standalone function outside of this class, but babel kept breaking, and this fixes it  */
  formatUrl(path) {
    const adjustedPath = path[0] !== '/' ? '/' + path : path;
    if (__SERVER__) {
      // Prepend host and port of the API server to the path.
      return 'http://localhost/api' + adjustedPath
    }
    // Prepend `/api` to relative URL, to proxy to API server.
    return '/api' + adjustedPath;
  }
}

export default ApiClient;
