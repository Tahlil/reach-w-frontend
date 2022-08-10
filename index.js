import React from 'react';
import AppViews from './views/AppViews';
import DeployerViews from './views/DeployerViews';
import AttacherViews from './views/AttacherViews';
import {renderDOM, renderView} from './views/render';
import './index.css';
import * as backend from './build/index.main.mjs';
import { loadStdlib } from '@reach-sh/stdlib';
const reach = loadStdlib(process.env);

const handToInt = {'ROCK': 0, 'PAPER': 1, 'SCISSORS': 2};
const intToOutcome = ['Bob wins!', 'Draw!', 'Alice wins!'];
const {standardUnit} = reach;
const defaults = {defaultFundAmt: '10', defaultWager: '3', standardUnit};

class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {view: 'ConnectAccount', ...defaults};
    }
    async componentDidMount() {
      const acc = await reach.getDefaultAccount();
      const balAtomic = await reach.balanceOf(acc);
      const bal = reach.formatCurrency(balAtomic, 4);
      this.setState({acc, bal});
      if (await reach.canFundFromFaucet()) {
        this.setState({view: 'FundAccount'});
      } else {
        this.setState({view: 'DeployerOrAttacher'});
      }
    }
    async fundAccount(fundAmount) {
      await reach.fundFromFaucet(this.state.acc, reach.parseCurrency(fundAmount));
      this.setState({view: 'DeployerOrAttacher'});
    }
    async skipFundAccount() { this.setState({view: 'DeployerOrAttacher'}); }
    selectAttacher() { this.setState({view: 'Wrapper', ContentView: Attacher}); }
    selectDeployer() { this.setState({view: 'Wrapper', ContentView: Deployer}); }
    render() { return renderView(this, AppViews); }
  }

renderDOM(<App />);