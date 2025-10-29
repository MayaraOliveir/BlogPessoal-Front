import type Postagem from './Postagem' // importa apenas os tipos Typescript e não valores ou funções.

export default interface Usuario {
  id: number
  nome: string
  usuario: string
  senha: string
  foto?: string
  postagem?: Postagem[] | null //operador de encadeamento '?' sinaliza o preenchimento como opcional. 
}