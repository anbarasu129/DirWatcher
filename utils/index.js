const apiErrorBuilder = (err) => {
  return {
    status: "error",
    reason: err.code || err.statusCode || err.reason || err.message || err,
    message:
      (err.__numberMsg && +err.message ? +err.message : err.message) || err,
    messageAr:
      err.__numberMsg && +err.messageAr ? +err.messageAr : err.messageAr,
    data: err.data,
    stack: err.stack || "No error stack",
  };
};

module.exports = {
  apiErrorBuilder,
};
