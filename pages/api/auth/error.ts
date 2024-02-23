export default function errorHandler(req:any, res:any):any {
    res.status(500).json({
      error: `Authentication error: ${req.query.error}`,
      description: `${req.query.error_description}`,
    });
  }
  