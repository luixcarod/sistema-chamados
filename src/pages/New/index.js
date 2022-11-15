//importes do react
import { useState, useEffect, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';

//importe dos icones
import { FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify'

//importes de banco de dados
import firebase from '../../services/firebaseconection';
import { AuthContext } from '../../contexts/auth';

//importes dos componentes
import Header from '../../components/Header';
import Title from '../../components/Title';

//importe do css
import './new.css';

export default function New() {

    const { id } = useParams();
    const history = useHistory();

    const [loadCustomers, setLoadCustomers] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [customerSelected, setCustomerSelected] = useState(0);

    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus] = useState('Aberto');
    const [complemento, setComplemento] = useState('');

    const [idCustomer, setIdCustomer] = useState(false);

    const { user } = useContext(AuthContext);

    useEffect(() => {
        async function loadCustomers() {
            await firebase.firestore().collection('customers')
                .get()
                .then((snapshot) => {
                    let lista = [];

                    snapshot.forEach((doc) => {
                        lista.push({
                            id: doc.id,
                            nomeFantasia: doc.data().nomeFantasia
                        })
                    })

                    if (lista.length === 0) {
                        console.log("Nenhuma empresa encontrada");
                        setCustomers([{ id: '1', nomeFantasia: 'Freela' }]);
                        setLoadCustomers(false);
                        return;
                    }

                    setCustomers(lista);
                    setLoadCustomers(false);

                    if (id) {
                        loadId(lista);
                    }
                })
                .catch((error) => {
                    console.log("Deu algum erro: ", error);
                    setLoadCustomers(false);
                    setCustomers([{ id: '1', nomeFantasia: '' }]);
                })
        }

        loadCustomers();

    }, [id])

    async function loadId(lista){
        await firebase.firestore().collection('chamados').doc(id)
        .get()
        .then((snapshot) => {
          setAssunto(snapshot.data().assunto);
          setStatus(snapshot.data().status);
          setComplemento(snapshot.data().complemento)
    
          let index = lista.findIndex(item => item.id === snapshot.data().clientesId );
          setCustomerSelected(index);
          setIdCustomer(true);
    
        })
        .catch((err)=>{
          console.log('ERRO NO ID PASSADO: ', err);
          setIdCustomer(false);
        })
      }

    //chamado quando clicar em registrar
    async function handleRegister(e) {
        e.preventDefault();

        if (idCustomer) {
            await firebase.firestore().collection('chamados')
                .doc(id)
                .update({
                    cliente: customers[customerSelected].nomeFantasia,
                    clientesId: customers[customerSelected].id,
                    assunto: assunto,
                    status: status,
                    complemento: complemento,
                    userId: user.uid
                })
                .then(() => {
                    toast.success("Atualizado com sucesso!");
                    setCustomerSelected(0);
                    setComplemento('');
                    history.push('/dashboard');
                })
                .catch((error) => {
                    toast.error("Erro ao atualizar! Tente novamente. ");
                    console.log("Error ao atualizar, erro: ", error);
                })

            return;
        }

        await firebase.firestore().collection('chamados')
            .add({
                created: new Date(),
                cliente: customers[customerSelected].nomeFantasia,
                clientesId: customers[customerSelected].id,
                assunto: assunto,
                status: status,
                complemento: complemento,
                userId: user.uid
            })
            .then(() => {
                toast.success("Cadastrado com sucesso!");
                setComplemento('');
                setCustomerSelected(0);
            })
            .catch((error) => {
                toast.error('Erro ao cadastrar, tente de novo!');
                console.log(error);

            })

    }

    //chamado quando troca o assunto
    function handleChangeSelect(e) {
        setAssunto(e.target.value);

    }

    //chamado quando troca o status
    function handleOptionChange(e) {
        setStatus(e.target.value);
    }

    //chamado quando troca de cliente
    function handleChangeCustomers(e) {
        setCustomerSelected(e.target.value);
    }

    return (
        <div>
            <Header />
            <div className='content'>
                <Title name="Novo chamado">
                    <FiPlus size={25} />
                </Title>

                <div className='container'>
                    <form className='form-profile' onSubmit={handleRegister}>

                        {/* Select com os clientes */}
                        <label>Cliente</label>

                        {/*  aqui verifica se o loadCustomers está true, de inicio ele estará 
                        pois estará trazendo os dados de forma assincrona do banco de dados, então
                        ele mostra um input falando que está carregando os clientes. Assim que o arrey de
                        customers for carregado, ele muda para o select com as opções de clientes */}
                        {loadCustomers ? (
                            <input type="text" disabled={true} Value="Carregando clientes..." />
                        ) : (
                            <select value={customerSelected} onChange={handleChangeCustomers}>
                                {customers.map((item, index) => {
                                    return (
                                        <option key={item.id} value={index}>
                                            {item.nomeFantasia}
                                        </option>
                                    )
                                })}
                            </select>
                        )}

                        {/* Select com os assuntos */}
                        <label>Assunto</label>
                        <select value={assunto} onChange={handleChangeSelect}>
                            <option value="Suporte">Suporte</option>
                            <option value="Visita tecnica">Visita técnica</option>
                            <option value="Financeiro">Financeiro</option>
                        </select>

                        {/* Radio com os status */}
                        <label>Status</label>
                        <div className='status'>
                            <input
                                type="radio"
                                name='radio'
                                value='Aberto'
                                onChange={handleOptionChange}
                                checked={status === "Aberto"}
                            />
                            <span>Em aberto</span>

                            <input
                                type="radio"
                                name='radio'
                                value='Progresso'
                                onChange={handleOptionChange}
                                checked={status === "Progresso"}
                            />
                            <span>Em progesso</span>

                            <input
                                type="radio"
                                name='radio'
                                value='Atendido'
                                onChange={handleOptionChange}
                                checked={status === "Atendido"}
                            />
                            <span>Atendido</span>
                        </div>

                        {/* Textarea para descrever o problema */}
                        <label>Complemento</label>
                        <textarea
                            type="text"
                            placeholder='Descreva seu problema (opcional)'
                            value={complemento}
                            onChange={(e) => setComplemento(e.target.value)}
                        />

                        <button type='submit'>Registrar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}