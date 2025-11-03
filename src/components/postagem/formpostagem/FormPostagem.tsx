import { useContext, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { AuthContext } from "../../../contexts/AuthContext";
import type Postagem from "../../../models/Postagem";
import type Tema from "../../../models/Tema";
import { atualizar, buscar, cadastrar } from "../../../services/Service";

function FormPostagem() {
    
    const navigate = useNavigate(); 
    // apenas para mostrar o loading de carregamento ao enviar algo etc.
    const [isLoading, setIsLoading] = useState<boolean>(false)
    // guarda os dados que vem do backend (lista inteira) [{id:1, desc:'React'}, {id:2, desc:'TS'}]
    const [temas, setTemas] = useState<Tema[]>([]) 
    //Guarda o tema que o usuário escolheu no select (único) {id:2, desc:'TS'}
    const [tema, setTema] = useState<Tema>({ id: 0,  descricao: '', })
    const [postagem, setPostagem] = useState<Postagem>({} as Postagem)
    // pega dados do usuário logado (token, nome, foto etc...)
    const { usuario, handleLogout } = useContext(AuthContext)
    const token = usuario.token 
    const { id } = useParams<{ id: string }>() // pega o id que está na url (ex: /editarpostagem/7)
     const carregandoTema = tema.descricao === '';

    async function buscarPostagemPorId(id: string) { // vai na api e pega postagem especifica 
        try {
            await buscar(`/postagens/${id}`, setPostagem, { //joga as postagens especificas dentro de setPostagem que atualiza a variavel postagem que fica com {id:7, titulo:'...', texto:'...', tema:{...}, usuario:{...}} dentro.
                headers: { Authorization: token }
            })
        } catch (error: any) {
            if (error.toString().includes('401')) {
                handleLogout()
            }
        }
    }

    async function buscarTemaPorId(id: string) { 
        try {
            await buscar(`/temas/${id}`, setTema, { // você escolhe um tema no select, busca esse tema e joga dentro de setTemas  e a variavel tema fica com {id:3, descricao:'Java'} dentro.
                headers: { Authorization: token }
            })
        } catch (error: any) {
            if (error.toString().includes('401')) {
                handleLogout()
            }
        }
    }

    async function buscarTemas() { // vai na api pega todos os temas 
        try {
            await buscar('/temas', setTemas, { // joga os temas dentro de setTemas e o resultado vai ser a variavel Temas com [{id:1, descricao:'React'}, {id:2, descricao:'TS'}, ...] dentro.
                headers: { Authorization: token }
            })
        } catch (error: any) {
            if (error.toString().includes('401')) {
                handleLogout()
            }
        }
    }

    useEffect(() => { //Verifica se o usuário está logado 
        if (token === '') { // caso não esteja ou não tenha token ele manda para o login atraves do (navigate('/'))
            alert('Você precisa estar logado');
            navigate('/');
        }
    }, [token])

    useEffect(() => {
        buscarTemas()

        if (id !== undefined) {
            buscarPostagemPorId(id)
        }
    }, [id])

    useEffect(() => {
        setPostagem({
            ...postagem,
            tema: tema,
        })
    }, [tema])

    // quando o usuario digita no campo titulo ou texto, essa  função atualiza o objeto postagem em tempo real
    function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
        setPostagem({
            ...postagem,
            [e.target.name]: e.target.value,
            tema: tema,
            usuario: usuario,
        });
    }
    // retorna para postagens
    function retornar() {
        navigate('/postagens');
    }

    async function gerarNovaPostagem(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)

        // se tem id atualiza a postagem
        if (id !== undefined) {
            try {
                await atualizar(`/postagens`, postagem, setPostagem, {
                    headers: {
                        Authorization: token,
                    },
                });

                alert('Postagem atualizada com sucesso')

            } catch (error: any) {
                if (error.toString().includes('401')) {
                    handleLogout()
                } else {
                    alert('Erro ao atualizar a Postagem')
                }
            }
            // se não tem id cria a postagem!
        } else {
            try {
                await cadastrar(`/postagens`, postagem, setPostagem, {
                    headers: {
                        Authorization: token,
                    },
                })

                alert('Postagem cadastrada com sucesso');

            } catch (error: any) {
                if (error.toString().includes('401')) {
                    handleLogout()
                } else {
                    alert('Erro ao cadastrar a Postagem');
                }
            }
        }

        setIsLoading(false)
        retornar()
    }



  return (
    <>
      <div className="container flex flex-col mx-auto items-center">
        <h1 className="text-4xl text-center my-8"> {id !== undefined ? 'Editar Postagem' : 'Cadastrar Postagem'}</h1>
        <form className="flex flex-col  gap-4" onSubmit={gerarNovaPostagem}>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="titulo"> Titulo da Postagem</label>
            <input type="text"
              placeholder="Titulo"
              name="titulo"
              required
              className="border-2 border-slate-700 rounded p-2"
              value={postagem.titulo}
              onChange={(e: ChangeEvent<HTMLInputElement>)=> atualizarEstado(e)}
            />
          </div>  
          <div className="flex flex-col gap-2"> 
            <label htmlFor="titulo">Texto da Postagem</label>
            <input type="text"
              placeholder="Texto "
              name="texto"
              required
              className="border-2 border-slate-700 rounded p-2"
              value={postagem.texto}
              onChange={(e: ChangeEvent<HTMLInputElement>)=> atualizarEstado(e)}
            />
          </div> 
          <div className="flex flex-col gap-2">
            <p>Tema da Postagem</p>
            <select name="tema" id="tema" className="border p-2 border-slate-800  rounded" onChange={(e) => buscarTemaPorId(e.currentTarget.value)}>
              <option value="" selected disabled> Selecione um Tema</option>
                {temas.map((tema: Tema) => (
                <>
                  <option value={tema.id}>{tema.descricao}</option>
                </>
                ))}
              
            </select>
          </div>
          <button type="submit" className="rounded disabled:bg-slate-200 bg-indigo-400 hover:bg-indigo-800 text-white font-bold w-1/2 mx-auto py-2 flex justify-center" disabled={carregandoTema}>
            
            {isLoading ?
              <ClipLoader
                color="#ffffff"
                size={24} /> :
              <span>{ id === undefined 
                ? 'Cadastrar' : 'Atualizar' }</span>
          }
          </button>
        </form>
      </div>
    </>
  )
  
}
export default FormPostagem