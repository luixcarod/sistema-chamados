//importes do React
import React from 'react';
import ReactLoading from "react-loading";
import { useState, useEffect } from 'react';

//importe da folha de estilo css
import './dashboard.css';

//importe dos componentes
import Header from '../../components/Header';
import Title from '../../components/Title';
import Modal from '../../components/Modal';

//importe de bibliotecas
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { format } from 'date-fns'

//importes do banco de dados
import firebase from '../../services/firebaseconection';

const listRef = firebase.firestore().collection('chamados').orderBy('created', 'desc');

export default function Dashboard() {

    const [chamados, setChamados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [lastDocs, setLastDocs] = useState();

    const [showPostModal, setShowPostModal] = useState(false);
    const [detail, setDetail] = useState();

    useEffect(() => {

        loadChamados();

        return () => {

        }
    }, []);

    async function loadChamados() {
        await listRef.limit(5)
            .get()
            .then((snapshot) => {
                updateState(snapshot)
            })
            .catch((err) => {
                console.log('Deu algum erro: ', err);
                setLoadingMore(false);
            })

        setLoading(false);

    }

    async function updateState(snapshot) {
        const isCollectionEmpty = snapshot.size === 0;

        if (!isCollectionEmpty) {
            let lista = [];

            snapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    assunto: doc.data().assunto,
                    cliente: doc.data().cliente,
                    clienteId: doc.data().clientesId,
                    created: doc.data().created,
                    createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    status: doc.data().status,
                    complemento: doc.data().complemento
                })
            })

            //Pegando o último documento buscado
            const lastDoc = snapshot.docs[snapshot.docs.length - 1];

            setChamados(chamados => [...chamados, ...lista]);
            setLastDocs(lastDoc);

        } else {
            setIsEmpty(true);
        }

        setLoadingMore(false);
    }

    async function handleMore() {
        setLoadingMore(true);
        await listRef.startAfter(lastDocs).limit(5)
            .get()
            .then((snapshot) => {
                updateState(snapshot);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    function togglePostModal(item) {
        setShowPostModal(!showPostModal);
        setDetail(item);
    }

    if (loading) {
        return (
            <div>
                <Header />

                <div className='content'>

                    <Title name="Atendimentos">
                        <FiMessageSquare size={25} />
                    </Title>

                    <div className='container dashboard'>
                        <span>Buscando chamados...</span>
                        <ReactLoading type='bubbles' color='#83bf02' />
                    </div>

                </div>
            </div>
        )
    }

    return (
        <div>
            <Header />

            <div className='content'>

                <Title name="Atendimentos">
                    <FiMessageSquare size={25} />
                </Title>

                {chamados.length === 0 ? (
                    <div className='container dashboard'>
                        <span>Nenhum chamado registrado...</span>
                        <Link to="/new" className='new'>
                            <FiPlus size={25} color="#fff" />
                            Novo chamado
                        </Link>
                    </div>
                ) : (
                    <>
                        <Link to="/new" className='new'>
                            <FiPlus size={25} color="#fff" />
                            Novo chamado
                        </Link>

                        <table>

                            <thead>
                                <tr>
                                    <th scope='col'>Cliente</th>
                                    <th scope='col'>Assunto</th>
                                    <th scope='col'>Status</th>
                                    <th scope='col'>Cadastrado em</th>
                                    <th scope='col'>#</th>
                                </tr>
                            </thead>

                            <tbody>
                                {chamados.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td data-label='Cliente'>{item.cliente}</td>
                                            <td data-label='Assunto'>{item.assunto}</td>
                                            <td data-label='Status'>
                                                <div className='badge' style={{
                                                    backgroundColor: item.status === 'Aberto' ? '#5cb85c' : item.status === 'Progresso' ? '#d29804' : '#767676'
                                                }}>
                                                    <span>
                                                        {item.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td data-label='Cadastrado'>{item.createdFormated}</td>
                                            <td data-label='#'>
                                                <button className='action' style={{ backgroundColor: '#3583f6' }} onClick={() => togglePostModal(item)}>
                                                    <FiSearch color='#fff' size={17} />
                                                </button>

                                                <Link to={`/new/${item.id}`} className='action' style={{ backgroundColor: '#f6a935' }}>
                                                    <FiEdit2 color='#fff' size={17} />
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>

                        {loadingMore && <h3 style={{ textAlign: 'center', marginTop: 15 }} >Buscando dados...</h3>}
                        {!loadingMore && !isEmpty && <button className='btn-more' onClick={handleMore}>Buscar mais</button>}


                    </>
                )}

            </div>

            {showPostModal && (
                <Modal
                    conteudo={detail}
                    close={togglePostModal} />
            )}

        </div>
    )
}