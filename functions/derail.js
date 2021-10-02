exports.handler = function (event, context, callback) {
  let url;
  try {
    url = JSON.parse(event.body).url;
    if (!url) {
      return { statusCode: 400, body: "url must be provided" };
    }
  } catch (ex) {
    return { statusCode: 400, body: "invalid/missing JSON body, url must be provided" };
  }

  callback(null, {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({url}),
  });
};
