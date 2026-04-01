const catchAsync = (fn) => {
  return (req, res, next) => {
    // Nếu hàm fn (controller) bị lỗi, nó sẽ tự động gọi next(err)
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
