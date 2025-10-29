/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, type ReactNode } from 'react';
import type UsuarioLogin from '../models/UsuarioLogin';
import { login } from '../services/Service';

// tipagem das funcionalidades que eu vou querer no meu contexto, essa é a ultima parte a ser preenchida, de acordo com o que eu precisar no projeto
interface AuthContextProps {
  usuario: UsuarioLogin;
  handleLogout(): void;
  handleLogin(usuario: UsuarioLogin): Promise<void>;
  isLoading: boolean;
}

// interface de tipagem padrão do context, esse cara sempre vai precisar estar aqui, desse jeito
interface AuthProviderProps {
  children: ReactNode;
}

// criação do contexto em si, é uma const que sempre vai receber o "createContext({} as AuthContextProps)"
export const AuthContext = createContext({} as AuthContextProps);

// criação da função de provedor do context, sempre vai receber o "({ children }: AuthProviderProps)"
export function AuthProvider({ children }: AuthProviderProps) {

  // criação do estado que vai armazenar os dados do usuário que vai fazer o login
  const [usuario, setUsuario] = useState<UsuarioLogin>({
    id: 0,
    nome: '',
    usuario: '',
    senha: '',
    foto: '',
    token: '',
  });

  // estado pra fazer o esqueminha de loading do botão
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // função que envia os dados do usuario para o backend, e se tudo der certo, da msg de ok, senão, da msg de erro
  async function handleLogin(usuarioLogin: UsuarioLogin) {
    setIsLoading(true);

    try {
      await login('/usuarios/logar', usuarioLogin, setUsuario);
      alert('Usuario logado com sucesso');
    } catch (error) {
      alert('Senha e email não estão batendo..');
      console.log(error);
    }

    setIsLoading(false);
  }

  // função para deslogar o usuario, que simplesmente limpa todos os dados do estado, voltando ele pro estado original (sem token de acesso == não logado)
  function handleLogout() {
    setUsuario({
      id: 0,
      nome: '',
      usuario: '',
      senha: '',
      foto: '',
      token: '',
    });
  }

  return(
    <AuthContext.Provider value={{usuario, handleLogin, handleLogout, isLoading}}>
      {children}
    </AuthContext.Provider>
  )
}