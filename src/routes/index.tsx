import { DefaultLayout } from 'layouts/DefaultLayout'
import { Contribute } from 'pages/Contribute'
import { PlinkoGamePage } from 'pages/Games/Plinko'
import { Gifts } from 'pages/Gifts'
import { LoginPage } from 'pages/Login'
import { ScoreBoardPage } from 'pages/ScoreBoard'
import { BrowserRouter, Routes as Switch, Route } from 'react-router-dom'

import { NotFound } from './components/NotFound'
import { RequireAuth } from './components/RequireAuth'
import Result from 'pages/Result'
import Deposite from 'pages/Contribute/Deposite'
import Withdraw from 'pages/Contribute/Withdraw'

export function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route element={<DefaultLayout />}>
          <Route element={<RequireAuth />}>
            <Route path="/plinko" element={<PlinkoGamePage />} />
            <Route path="/gifts" element={<Gifts />} />
            <Route path="/contribute" element={<Contribute />} />
            <Route path="/results" element={<Result />} />
            <Route path="/deposite" element={<Deposite />} />
            <Route path="/withdraw" element={<Withdraw />} />
            <Route path="/scores" element={<ScoreBoardPage />} />
          </Route>
          <Route path="/" element={<ScoreBoardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}
