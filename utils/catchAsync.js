const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err)=>{
      console.log('brokje',err)
      next()
    });
  };
};

export default catchAsync;
