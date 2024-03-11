const sendResponse = (message: string, statusCode: number, res: any) => {
  //Response
  res.status(statusCode).json({
    ok: true,
    message,
  });
};

export default sendResponse;
