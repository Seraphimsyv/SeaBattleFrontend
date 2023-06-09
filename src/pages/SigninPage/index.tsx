import {
  useState,
  useEffect,
  useContext
} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import AuthComponent from '../../components/AuthComponent';
import AuthService from '../../service/auth-service';
import AuthManager from '../../manager/auth-manager';
import { AlertContext } from '../../manager/alert-manager';
import { EnumAlertType } from '../../enum/main.enum';
import { ErrorAlertText } from '../../constants';

const SigninPage = () => {
  const { addAlert } = useContext(AlertContext);
  const [username, setUsername] = useState('');
  const [nameValid, setNameValid] = useState(true);
  const [login, setLogin] = useState('');
  const [loginValid, setLoginValid] = useState(true);
  const [password, setPassword] = useState('');
  const [passValid, setPassValid] = useState(true);
  /**
   * User input save handler for username field
   * @param evt 
   */
  const handleChangeUsername = (evt: any) : void => {
    setUsername(evt.currentTarget.value);
    setNameValid(true);
  }
  /**
   * User input save handler for login field
   * @param evt 
   */
  const handleChangeLogin = (evt: any) : void => {
    setLogin(evt.currentTarget.value);
    setLoginValid(true);
  }
  /**
   * User input save handler for password field
   * @param evt 
   */
  const handleChangePassword = (evt: any) : void => {
    setPassword(evt.currentTarget.value);
    setPassValid(true);
  }
  /**
   * User registration handler
   */
  const handleRegistartion = () => {
    if (!nameValid || !loginValid || !passValid) {
      addAlert(EnumAlertType.error, ErrorAlertText.auth.signin.validation)
      return;
    }

    AuthManager.validateSign({ username, login, password })
    .then(() => {
      AuthService.signIn({ username, login, password })
      .then(() => {
        window.location.href = '/log-in';
      })
      .catch(err => {
        if (err === 'ERROR:USER_EXISTS') {
          setNameValid(false);
          setLoginValid(false);
          addAlert(EnumAlertType.error, ErrorAlertText.auth.signin.exists)
        } else {
          setNameValid(false);
          setLoginValid(false);
          setPassValid(false);
          addAlert(EnumAlertType.error, ErrorAlertText.auth.signin.server)
        }
      })
    })
    .catch(err => {
      switch (err) {
        case 'username': {
          addAlert(EnumAlertType.error, 'Empty username');
          setNameValid(false);
          break;
        }
        case 'login': {
          addAlert(EnumAlertType.error, 'Empty login');
          setLoginValid(false);
          break;
        }
        case 'password': {
          addAlert(EnumAlertType.error, 'Empty password');
          setPassValid(false);
          break;
        }
      }
    })
  }
  /**
   * 
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleRegistartion();
      }
    }
    
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  })

  return (
    <>
      <AuthComponent title="Sign-in">
        <TextField
          autoFocus
          required
          fullWidth
          margin="normal"
          id="username"
          label="Username"
          error={!nameValid}
          onChange={handleChangeUsername}
        />
        <TextField
          required
          fullWidth
          margin="normal"
          id="login"
          label="Login"
          error={!loginValid}
          onChange={handleChangeLogin}
        />
        <TextField
          required
          fullWidth
          margin="normal"
          name="password"
          label="Password"
          type="password"
          id="password"
          error={!passValid}
          onChange={handleChangePassword}
        />
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleRegistartion}
        >
          Sign In
        </Button>
        <Grid container>
          <Grid item>
            <Link href="/log-in" variant="body2">
              {"Already have an account?"}
            </Link>
          </Grid>
        </Grid>
      </AuthComponent>
    </>
  )
}

export default SigninPage;