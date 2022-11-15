import { useState, useContext } from 'react';

import './profile.css';

import Header from '../../components/Header';
import Title from '../../components/Title';

import avatar from '../../assets/avatar.png';

import firebase from '../../services/firebaseconection';
import { AuthContext } from '../../contexts/auth';

import { FiSettings, FiUpload } from 'react-icons/fi';

import { toast } from 'react-toastify';


export default function Profile(){
    const { user, signOut, setUser, storageUser } = useContext(AuthContext);

    const [nome, setNome] = useState(user && user.nome);
    const [email, setEmail] = useState(user && user.email);
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [imgAvatar, setImgAvatar] = useState(null);

    //função que altera imagem de perfil passando um evento e
    function handleFile(e){

        //aqui ele verifica se há uma imagem, se tem, ele entra no if
        if(e.target.files[0]){
            //aqui criamos uma variavel image para guardar a imagem que o usuario passou, assim
            //facilita na hora de codar, pra não ter que ficar escrevendo essa linha gigante: e.target.files[0]
            const image = e.target.files[0];

            //aqui verifica se o arquivo escolhido é do tipo jpeg ou png, caso seja...
            if(image.type === 'image/jpeg' || image.type === 'image/png'){
                //...ele altera a imagem e...
                setImgAvatar(image);
                //...cria uma pré-visualização no input
                setAvatarUrl(URL.createObjectURL(e.target.files[0]))
            }
            //...caso não seja...
            else{
                //...ele mostra um toast de alerta falando o tipo de arquivo que deve ser escolhido...
                toast.error('Escolha apenas arquivos PNG ou JPEG');
                //...garante que a imagem de avatar fique aquela padrão, definida por null...
                setImgAvatar(null);
                //...e retorna null para evitar que mais códigos abaixo sejam lidos e compilados!
                return null;
            }
        }

        //console.log(e.target.files[0]);
    }

    async function handleUpload(){
        const currentUid = user.uid;

        //acessamos o storage do banco de dados
        const uploadTark = await firebase.storage()
        //aqui criamos uma referencia com uma nova pasta chamada images -> uid do usuario (para cada usuario ter sua propria pasta)
        // -> imgAvatar.name para salvar o arquivo com o nome de origem...
        .ref(`images/${currentUid}/${imgAvatar.name}`)
        //aqui damos o .put para subir essa foto escolhida para o storage...
        .put(imgAvatar)
        //caso de tudo certo, entra aqui...
        .then(async ()=>{
            //aqui mostra uma notificação falando que a foto foi enviada com sucesso
            toast.success('Foto enviada com sucesso!');

            //aqui eu vou buscar a url da foto que foi evniada. Nesse caso acessamos o storage, vamos ate a img
            await firebase.storage().ref(`images/${currentUid}`)
            //damos um getdownload url (função disponibilizada pelo firebase)
            .child(imgAvatar.name).getDownloadURL()
            //se deu tudo certo em pegar o url, passamos como parametro para uma função anonima assincrona
            .then(async (url)=>{
                //salvamos a url que pegamos em uma nova variavel
                let urlFoto = url;

                //acesso o firestore ->usuario
                await firebase.firestore().collection('users')
                .doc(user.uid)
                //atualizo a propriedade avatar url com a url da foto que fizemos o upload
                .update({
                    avatarUrl: urlFoto,
                    nome: nome
                })
                .then(()=>{
                    let data = {
                        ...user,
                        avatarUrl: urlFoto,
                        nome: nome
                    };
                    setUser(data);
                    storageUser(data);
                })
            })

        })
    }

    //função que atualiza o nome
    async function handleSave(e){
        //essa linha permite que atualizemos sem recarregar a página
        e.preventDefault();

        //aqui verifica se a foto de avatar é nula e o nome é diferente de vazio...
        if(imgAvatar == null && nome != ''){
            //...caso seja, acessa o banco de dados na coleção de usuarios...
            await firebase.firestore().collection('users')
            //...pega o uid do usuario que esta logado tentando mudar o nome...
            .doc(user.uid)
            //...chama a função de atualizar do proprio firebase (TEM QUE ESTAR IMPORTADO!!!)...
            .update({
                //...atualiza somente o nome passando nome (que é o parametro que passamos no input)...
                nome: nome
            })
            //...caso de tudo certo, entra no caso de sucesso (.then)...
            .then(()=>{
                toast.success('Nome atualizado com sucesso!');
                //...aqui criamos um novo objeto chamado data...
                let data = {
                    //...esse objeto recebe tudo que um usuario tem (...user)...
                    ...user,
                    //...e depois altera o nome desse usuario...
                    nome: nome
                };

                //...após atualizado o nome do usuario, ele atualiza a state passando a variavel data como parametro...
                setUser(data);
                //...e por ultimo atualiza o storage com os novos dados do usuario (PARA ISSO, O STORAGE TEM QUE SER IMPORTADO!!!)
                storageUser(data);
            })
            .catch(()=>{
                toast.error('Erro ao atualizar o nome');
                console.log("Erro ao atualizar nome");
            })
        }

        else if(nome !== '' && imgAvatar !== null){
            handleUpload();
        }

    }

    return(
        <div>
            <Header/>

            <div className='content'>
                <Title name="Meu perfil">
                    <FiSettings size={25}/>
                </Title>

                <div className='container'>
                    <form className='form-profile' onSubmit={handleSave}>
                        <label className='label-avatar'>
                            <span>
                                <FiUpload color='#fff' size={25}/>
                            </span>
                            <input type="file" accept="image" onChange={handleFile}/><br/>
                            {
                                avatarUrl === null ?
                                <img src={avatar} width="250" height="250" alt="Foto de perfil" />
                                :
                                <img src={avatarUrl} width="250" height="250" alt="Foto de perfil" />
                            }
                        </label>

                        <label>Nome</label>
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)}/>

                        <label>Email</label>
                        <input type="text" value={email} disabled={true}/>

                        <button type="submit">Salvar</button>
                    </form>
                </div>

                <div className='container'>
                    <button className='logout-btn' onClick={() => signOut()}>Sair</button>
                </div>
            </div>
        </div>
    )
}