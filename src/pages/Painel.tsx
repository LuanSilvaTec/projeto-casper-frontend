import { useHistory } from 'react-router-dom'
import { useEffect,FormEvent, useState } from 'react';
import Modal, { ModalHeader, ModalBody, ModalFooter, useModal } from '../components/Modal'
import '../styles/painel.css'
import api from '../services/api'


import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';

const columns = [
    { field: 'id', headerName: 'ID', width: 130 },
    { field: 'titulo', headerName: 'Título', width: 200 },
    { field: 'url_imagem', headerName: 'Imagem', width: 200 },
    { field: 'descricao', headerName: 'Descrição', width: 200 },
    { field: 'tema', headerName: 'Tema', width: 200 },
    { field: 'url_noticia', headerName: 'Link da noticia', width: 200 },
];

const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];


export function Painel() {
    const history = useHistory()
    const { isShowing, toggle } = useModal();
    const [linkImagem, setLinkImagem] = useState('')
    const [titulo, setTitulo] = useState('')
    const [descricao, setDescricao] = useState('')
    const [tema, setTema] = useState('')
    const [link, setLink] = useState('')
    const[rows,setRows]=useState([])
    
    useEffect(() => {
        async function teste(){
            await api.get('/noticia',{ 
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token'),
              }
            }
            ).then(response => {
                setRows(response.data);
                console.log("TABELA")
                console.log(rows)
            })
        }
        teste()
    }, [])
    function logout() {
        localStorage.removeItem('token');
        history.push('/')
    }
    function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setTema(event.target.value);

    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const noticia = {
            url_imagem: linkImagem,
            titulo: titulo,
            descricao: descricao,
            tema: tema,
            url_noticia: link
        }
        //console.log(noticia)
        const token = localStorage.getItem('token')
        console.log(token)
        try {
            await api.post('/noticia', noticia, {
                headers: {
                    Authorization: "Bearer " + token,
                }
            })
            setLinkImagem("")
            setDescricao("")
            setTitulo("")
            setLink("")
            setTema("")
            history.push('/painel');

        } catch (err) {
            alert('Erro ao cadastrar a notícia, tente novamente.');
        }
    }
    return (
        <div id="page-painel">
            <header>
                <h1>Painel Administrativo do Casper</h1>
                <button onClick={logout}>
                    Logout
                </button>
            </header>
            <div id="main-content">
                <h2>Notícias</h2>
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
                </div>


                <div id="modal">
                    <button id="button-modal" onClick={toggle}>
                        +
                    </button>
                    <Modal {...{ isShowing, toggle }}>
                        <ModalHeader {...{ toggle }}>
                            Adicionar noticia
                        </ModalHeader>
                        <ModalBody>
                            <form onSubmit={handleSubmit}>
                                <span>Link para imagem da noticia</span>
                                <input
                                    type="text"
                                    placeholder="Digite o link da imagem"
                                    onChange={event => setLinkImagem(event.target.value)}
                                    value={linkImagem}
                                />
                                <span>Título da notícia</span>
                                <input
                                    type="text"
                                    placeholder="Digite o Título da notícia"
                                    onChange={event => setTitulo(event.target.value)}
                                    value={titulo}
                                />
                                <span>Descrição</span>
                                <input
                                    type="text"
                                    placeholder="Adicione a descrição"
                                    onChange={event => setDescricao(event.target.value)}
                                    value={descricao}
                                />
                                <br /><br />
                                <span>Tema</span>

                                <select value={tema} onChange={handleChange}>
                                    <option value="">Selecione um tema</option>
                                    <option value="Esportes">Esportes</option>
                                    <option value="Política">Política</option>
                                    <option value="Entretenimento">Entretenimento</option>
                                    <option value="Famosos">Famosos</option>
                                </select>
                                <br />
                                <br />
                                <span>Link da notícia</span>
                                <input
                                    type="text"
                                    placeholder="Insira o link"
                                    onChange={event => setLink(event.target.value)}
                                    value={link}
                                />
                                <button>
                                    Cadastrar notícia
                                </button>

                            </form>
                        </ModalBody>
                        <ModalFooter>
                            <button onClick={toggle}>
                                Sair
                            </button>
                        </ModalFooter>
                    </Modal>
                </div>

            </div>
        </div>
    )
}