import { lazy, Suspense } from 'react';
import React, { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Spin } from 'antd';
import LoginPage from '../views/login';

const MapPage = lazy(() => import('../views/map'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="loading">
            <Spin />
          </div>
        }>
        <Switch>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route exact path="/">
            <MapPage />
          </Route>
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
}
