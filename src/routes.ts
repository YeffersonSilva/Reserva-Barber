
import { Router } from 'express';
import authRoutes from './modules/auth/routes';


import path from 'path';
import express from 'express';


const routes = Router();
routes.use('/uploads', express.static(path.join(__dirname, '..', 'uploads'))); 


routes.use('/auth', authRoutes);




export default routes;
