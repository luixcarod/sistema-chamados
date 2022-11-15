import { useContext } from 'react';
import { Route, Redirect} from 'react-router-dom';
import { AuthContext } from '../contexts/auth';

export default function RouteWrapper({
    component: Component, 
    isPrivate,
    ...rest
}){
    const { signed, loading } = useContext(AuthContext);

    if(loading){
        <div></div>
    }

    //Caso o usuário tenta acessar uma rota privada mas não está logado
    //ele será redirecionado para a tela home
    if(!signed && isPrivate){
        return <Redirect to="/" />
    }

    //Caso o usuário esteja logado e tenta ir para uma rota que não
    //é privada, ele será redirecionado para o dashboard
    if(signed && !isPrivate){
        return <Redirect to="/dashboard" />
    }

    return(
        <Route
            {...rest}
            render={props =>(
                <Component {...props} />
            )}
        />
    )
}