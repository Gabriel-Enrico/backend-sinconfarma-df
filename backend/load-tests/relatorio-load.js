import autocannon from 'autocannon';

// Load test: simula múltiplas requisições de envio de relatório
const url = process.env.TARGET_URL || 'http://localhost:8000/api/avaliacoes/1/email';

const connections = parseInt(process.env.CONNS || '30', 10);
const duration = parseInt(process.env.DURATION || '10', 10);

const instance = autocannon({
  url,
  connections,
  duration,
  method: 'POST',
  headers: (function () {
    const h = { 'content-type': 'application/json' };
    if (process.env.AUTH_HEADER) h['authorization'] = process.env.AUTH_HEADER;
    return h;
  })(),
  body: process.env.BODY ? process.env.BODY : JSON.stringify({ dummy: true }),
});

autocannon.track(instance, { renderProgress: true });

instance.on('done', (summary) => {
  console.log('\nLoad test finished');
  console.log(summary);
  process.exit(0);
});
