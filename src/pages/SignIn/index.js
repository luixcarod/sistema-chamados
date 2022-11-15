import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

//importação do arquivo de estilos css
import './signin.css';

import { AuthContext } from '../../contexts/auth'

//importação do icone da logo
import logo from '../../assets/logo.png';

function SignIn() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const { signIn, loadingAuth } = useContext(AuthContext);

  function handleSubmint(e){
    e.preventDefault();

    if(email !== '' && senha !== ''){
      signIn(email, senha);
    }
    
  }

  return (
    <div className='container-center'>
      <div className='login'>
        <div className='logo-area'>
          <img src={logo} alt="Logo do sistema"/>
        </div>

        <form onSubmit={handleSubmint}>
          <h1>Entrar</h1>
          <input type="text" placeholder="Entre com seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <input type="password" placeholder="Entre com sua senha" value={senha} onChange={(e) => setSenha(e.target.value)}/>
          <button type="subbmit">{loadingAuth ? 'Carregando...' : 'Fazer login'}</button>
        </form>

        <Link to="/register">Criar sua conta</Link>
      </div>
    </div>
  );
}
  
export default SignIn;