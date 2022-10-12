import { Request, Response } from 'express';
import path from 'path'

const getModel = (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'models', 'caxdz2.caxdz'))
};

export default {
  'GET /api/caxviewmodel': getModel,
};
