export const notFound = (request, response, next) => {
  const error = new Error(`Not found: ${request.originalUrl}`);
  response.status(404);
  next(error);
};

export const errorHandler = (error, _request, response, _next) => {
  const statusCode = response.statusCode === 200 ? 500 : response.statusCode;

  response.status(statusCode).json({
    message: error.message,
  });
};
