import http from 'k6/http';
import { group, check } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';


//Workload:
export const options = {
  thresholds: {
    http_req_failed: ['rate<0.01'], //http erros devem ser abaixo de 1%
    http_req_duration: ['p(95)<200'] ///95$ das requisições devem ser abaixo de 200
  },
  cenarios: {
    cenario1: {
      executor: 'constant-arrival-rate',
      duration: '5s',
      preAllocatedVUs: 50,
      rate: 50,
      timeUnit: '1s'
    }
  },
  vus: 5,  //Usuarios virtuais simultanêos para smoke-test é até de +-5 (recomendação do k6)
  duration: '5s', // Duração para smoke-test é de alguns segundos a poucos minutos(recomendação do k6)
};
//Casos de testes
export default function () {
  let valorToken
  let produtoId
  let componenteId
  const url = "http://165.227.93.41/lojinha/v2/"
  group('Login com usuario valido', () => {
    const respostaLogin = http.post(`${url}login`, JSON.stringify({
      usuarioLogin: 'carlos2025',
      usuarioSenha: 'carlos2025'
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    check(respostaLogin, {
      'Status code é igual a 200': r => r.status === 200
    })
    valorToken = respostaLogin.json('data.token')
  })
  group('Criar um novo produto', () => {
    const respostaCriarProduto = http.post(`${url}produtos`, JSON.stringify({
      produtoNome: 'Teste de performance',
      produtoValor: 2000,
      produtoCores: ['Preto', 'Vermelho'],
      produtoUrlMock: "",
      componentes: [{
        componenteNome: "string",
        componenteQuantidade: 1
      }
      ]

    }), {
      headers: {
        'Content-Type': 'application/json',
        'token': valorToken
      }
    })
    check(respostaCriarProduto, {
      'Status code é 201': r => r.status === 201
    })
    produtoId = respostaCriarProduto.json('data.produtoId')
  })
  group('Adicionar um novo usuario', () => {
    const usuarioNome = `Usuario_${randomString(10)}`
    const usuarioLogin = `login_${randomString(8)}`
    const usuarioSenha = randomString(12)
    const respostaCriarProduto = http.post(`${url}usuarios`, JSON.stringify({
      usuarioNome: usuarioNome,
      usuarioLogin: usuarioLogin,
      usuarioSenha: usuarioSenha
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    check(respostaCriarProduto, {
      'Status code é 201': (r) => r.status === 201,
    });
  })
  group('Buscar os produtos do usuário', () => {
    const buscarProduto = http.get(`${url}produtos`, {
      headers: {
        'Content-Type': 'application/json',
        token: valorToken
      }
    })
    check(buscarProduto, {
      'Status code é 200': r => r.status === 200
    })
  })
  group('Buscar um dos produtos do usuário', () => {
    const buscarumdosProdutos = http.get(`${url}produtos/${produtoId}`, {
      headers: {
        'Content-Type': 'application/json',
        token: valorToken
      }
    })
    check(buscarumdosProdutos, {
      'Status code é 200': r => r.status === 200
    })
  })
  group('Adicionar um novo componente ao produto', () => {
    const respostaAdicionarComponente = http.post(`${url}produtos/${produtoId}/componentes`, JSON.stringify({
      componenteNome: "Adicionar Componente",
      componenteQuantidade: 7,
    }), {
      headers: {
        'Content-Type': 'application/json',
        'token': valorToken
      }
    })
    check(respostaAdicionarComponente, {
      'Status code é igual a 201': r => r.status === 201
    })
    componenteId = respostaAdicionarComponente.json('data.componentes.componenteId')
  })
  group('Buscar dados dos componentes de um produto', () => {
    const respostaBuscarDadosComponente = http.get(`${url}produtos/${produtoId}/componentes`,{
      headers: {
        'Content-Type': 'application/json',
        'token': valorToken
      }
    })
    check(respostaBuscarDadosComponente, {
      'Status code é igual a 200': r => r.status === 200,
    })
  })
  
}




















