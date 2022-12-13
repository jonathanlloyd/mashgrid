import * as React from 'react';
import {useState, useEffect} from 'react';
import './App.css';
import logo from './assets/images/logo.svg';
import {GetStartupScreen, OnCreateAccountClicked} from '../wailsjs/go/main/App';
import * as runtime from '../wailsjs/runtime';

interface Screen {
  code: string;
  element: () => React.ReactNode;
}

interface Context {
  loadScreen: (code: string) => void;
}

const SCREENS = [
  {
    code: 'login',
    element: (c: Context) => <LoginScreen context={c} />,
  },
  {
    code: 'create_account',
    element: (c: Context) => <CreateAccountScreen context={c} />,
  },
  {
    code: 'account_created',
    element: (c: Context) => <AccountCreatedScreen context={c} />,
  },
  {
    code: 'main_screen',
    element: (c: Context) => <MainScreen context={c} />,
  },
];

const SCREEN_MAP: Map<string, (c: Context) => React.ReactNode> = SCREENS.reduce(
  (acc, cur) => acc.set(cur.code, cur.element),
  new Map(),
);

function App() {
  const [screenCode, setScreenCode] = useState('');
  useEffect(() => {
    GetStartupScreen().then(screenCode => setScreenCode(screenCode));
    runtime.EventsOn('load_screen', screenCode => { setScreenCode(screenCode) });
  }, []);
  if (screenCode === '') {
    return <></>;
  }

  const elementConstructor = SCREEN_MAP.get(screenCode);
  if (!elementConstructor) {
    throw new Error('Whoops');
  }
  const context: Context = {
    loadScreen: setScreenCode,
  };
  const element = elementConstructor(context);
  return <div className="container">{element}</div>;
}

interface LoginScreenProps {
  context: Context;
}

function LoginScreen(props: LoginScreenProps) {
  const loadCreateAccountScreen = () => {
    props.context.loadScreen('create_account');
  };
  return (
    <>
      <div className="login-header">
        <img className="login-header__logo" src={logo} />
      </div>
      <div className="login-buttons">
        <button
          onClick={OnCreateAccountClicked}
          className="login-buttons__button">
          Create new account
        </button>
        <button className="login-buttons__button">Login with passphrase</button>
      </div>
    </>
  );
}

interface CreateAccountScreenProps {
  context: Context;
}

function CreateAccountScreen(props: CreateAccountScreenProps) {
  const loadAccountCreatedScreen = () => {
    props.context.loadScreen('account_created');
  };
  return (
    <>
      <div className="card-container">
        <div className="card">
          <div className="card__header">Create an account</div>
          <label className="card__label" htmlFor="display_name">
            Display name
          </label>
          <input className="card__input" name="display_name" type="text" />
          <button onClick={loadAccountCreatedScreen} className="card__button">
            Continue
          </button>
        </div>
      </div>
    </>
  );
}

function AccountCreatedScreen(props: CreateAccountScreenProps) {
  const loadMainScreen = () => {
    props.context.loadScreen('main_screen');
  };
  return (
    <>
      <div className="card-container">
        <div className="card">
          <div className="card__header">Account created</div>
          <div className="card__label">Mashgrid address</div>
          <div className="card__copyable">
            foobar
            <span className="address__pubkey">
              #3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy
            </span>
          </div>
          <div className="card__label">Backup passphrase</div>
          <div className="card__copyable">
            hotel obvious agent lecture gadget evil jealous keen fragile before
            damp clarify
          </div>
          <div className="card__helptext">
            Please store your passphrase somewhere safe - it cannot be changed
            and you will not be able to recover your account without it.
          </div>
          <button onClick={loadMainScreen} className="card__button">
            Continue
          </button>
        </div>
      </div>
    </>
  );
}

function MainScreen(props: CreateAccountScreenProps) {
  return (
    <>
      <div className="main__address">
        foobar
        <span className="address__pubkey">
          #3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy
        </span>
      </div>
    </>
  );
}

export default App;
