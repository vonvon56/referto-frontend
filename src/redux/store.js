import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

// 디버깅을 위한 미들웨어
const loggerMiddleware = store => next => action => {
  console.log('[Redux] Previous State:', store.getState());
  console.log('[Redux] Action:', action);
  const result = next(action);
  console.log('[Redux] Next State:', store.getState());
  return result;
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(loggerMiddleware),
});
