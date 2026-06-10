import { Response } from 'express';

export const success = (res: Response, data: unknown, message = 'Operación exitosa', status = 200) => {
  return res.status(status).json({ success: true, message, data });
};

export const fail = (res: Response, message = 'Solicitud inválida', status = 400) => {
  return res.status(status).json({ success: false, message });
};
