import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // ✅ Uses localStorage for web
import rootReducer from './rootReducer';

const persistConfig = {
  key: 'root',
  storage, // ✅ Web localStorage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // ✅ Needed for redux-persist
    }),
});

const persistor = persistStore(store);

export { store, persistor };

// ✅ TypeScript support (optional, remove if using JS only)
export const AppDispatch = store.dispatch;
export const AppRootState = store.getState;
