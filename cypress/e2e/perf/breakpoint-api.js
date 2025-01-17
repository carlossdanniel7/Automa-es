import http from 'k6/http';
import { sleep } from 'k6';

//Workload:
export const options = {
  executador: 'ramping-arrival-rate',
  stages: [
    {duration: '1m', target: 100}, // Ramp-up, maior quantidade de VUs possiveis até achar a quebra do sistema.
    
  ]
}
//Casos de testes
export default function () {
  http.get('https://test.k6.io'); // Entrando no endpoint
  sleep(1); // User thinking time // Usuario não vai ficar entrando diretamente.
}
