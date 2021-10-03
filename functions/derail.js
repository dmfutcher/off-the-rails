const axios = require('axios');
const {parse, format} = require('url');

const stripQuery = (url) => {
  const parsed = parse(url, true);
  parsed.search = undefined;
  parsed.query = undefined;
  return format(parsed);
}


const fetchRedirect = async (url) => {
  const stripped = stripQuery(url);
  const response = await axios.get(stripped);
  return stripQuery(response.request.res.responseUrl);
}

exports.handler = function (event, context, callback) {
  let url;
  try {
    url = JSON.parse(event.body).url;
    if (!url || !(parse(url).protocol)) {
      return callback(null, {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({error: "url must be provided"}),
      });
    }
  } catch (ex) {
      return callback(null, {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({error: "invalid/missing JSON body, url must be provided"}),
      });
  }

  fetchRedirect(url).then(response => {
    callback(null, {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({url: response}),
    });
  }).catch(e => {
    console.error(e);
    callback(null, {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({error: 'Failed to resolve redirection'}),
    });
  });
};
