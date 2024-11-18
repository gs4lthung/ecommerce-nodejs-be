const StatusCode = {
  OK: 200,
  CREATED: 201,
};

const ReasonStatusCode = {
  OK: "Success",
  CREATED: "Created",
};

class SuccessResponse {
  constructor({
    message,
    status = StatusCode.OK,
    reason = ReasonStatusCode.OK,
    metadata = {},
  }) {
    this.message = !message ? reason : message;
    this.status = status;
    this.metadata = metadata;
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}

class CREATED extends SuccessResponse {
  constructor({ message, metadata }) {
    super({
      message,
      status: StatusCode.CREATED,
      reason: ReasonStatusCode.CREATED,
      metadata,
    });
  }
}

module.exports = {
  OK,
  CREATED,
};
