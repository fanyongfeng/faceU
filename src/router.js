import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

import Dashboard from './pages/dashboard';
import AsmVideo from './pages/asmVideo';

export default () => (
  <Router basename="/">
    <Switch>
      <Route path='/js' component={Dashboard} />
      <Route path='/asm' component={AsmVideo} />
    </Switch>
  </Router>
)

// export default routes
