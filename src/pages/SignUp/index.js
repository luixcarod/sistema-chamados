import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';

//aqui não realizamos a importação de um novo arquivo css, porque no react
//todo arquivos relacionam as mesmas classes...

//importação do icone da logo
import logo from '../../assets/logo.png';

function SignUp() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');

  const { signUp, loadingAuth } = useContext(AuthContext);

  function handleSubmint(e){
    e.preventDefault();
    if(nome !== '' && email !== '' && senha !== ''){
      signUp(email, senha, nome);
    }
  }

  return (
    <div className='container-center'>
      <div className='login'>
        <div className='logo-area'>
          <img src={logo} alt="Logo do sistema"/>
        </div>

        <form onSubmit={handleSubmint}>
          <h1>Criar sua conta</h1>
          <input type="text" placeholder="Entre com seu nome" value={nome} onChange={(e) => setNome(e.target.value)}/>
          <input type="text" placeholder="Entre com seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <input type="password" placeholder="Entre com sua senha" value={senha} onChange={(e) => setSenha(e.target.value)}/>
          <button type="subbmit">{loadingAuth ? 'Carregando...' : 'Cadastrar'}</button>
        </form>

        <Link to="/">Já possui uma conta? Faça o login!</Link>
      </div>
    </div>
  );
}
  
export default SignUp;