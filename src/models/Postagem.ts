// importando tema e usuario por conta do relacionamento existente no Backend entre as 3 classes.
import type Tema from './Tema';
import type Usuario from './Usuario';

export default interface Postagem{
  id: number;
  titulo: string;
  texto: string;
  data: string; // sera string porque não faremos nenhuma manipulação com datas apenas exibiremos o valor recebido. 
  tema: Tema | null; //ambos tema e usuario representam o relacionamento que existe no backend 
  usuario: Usuario | null;
}