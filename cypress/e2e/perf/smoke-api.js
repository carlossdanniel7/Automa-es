import http from 'k6/http';
import { sleep } from 'k6';

//Workload:
export const options = {
  vus: 5,  //Usuarios virtuais simultanêos para smoke-test é até de +-5 (recomendação do k6)
  duration: '30s', // Duração para smoke-test é de alguns segundos a poucos minutos(recomendação do k6)
};
//Casos de testes
export default function () {
  http.get('https://test.k6.io'); // Entrando no endpoint
  sleep(1); // User thinking time // Usuario não vai ficar entrando diretamente.
}
