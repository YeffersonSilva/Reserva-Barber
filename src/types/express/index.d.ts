// src/types/express/index.d.ts
declare namespace Express {
    export interface Request {
      user?: {
        id: number;
        role: 'ADMIN' | 'USER' | string;
        // Puedes agregar otros campos según necesites
      };
    }
  }
  