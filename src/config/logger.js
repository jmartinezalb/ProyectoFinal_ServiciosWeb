const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Crea el directorio de logs si no existe
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

morgan.token('timestamp', () => {
  return new Date().toISOString();
});

morgan.token('user-agent', (req) => {
  return req.get('User-Agent') || 'Unknown';
});
// Formato recomendado?
const combinedFormat = ':timestamp :remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms';

// Stream de accesos
const accessLogStream = fs.createWriteStream(
  path.join(logDir, 'access.log'), 
  { flags: 'a' }
);

// Stream de errores
const errorLogStream = fs.createWriteStream(
  path.join(logDir, 'error.log'), 
  { flags: 'a' }
);

const morganDev = morgan('dev');

const morganCombined = morgan(combinedFormat, {
  stream: accessLogStream
});

// Logging de errores
const errorLogger = (err, req, res, next) => {
  const errorLog = `${new Date().toISOString()} - ${err.message}\n${err.stack}\n---\n`;
  errorLogStream.write(errorLog);
  next(err);
};

// Configuraciones
const setupMorgan = (app, env = 'development') => {
  if (env === 'production') {
    app.use(morganCombined);
    app.use(morgan('combined', {
      skip: (req, res) => res.statusCode < 400,
      stream: process.stdout
    }));
  } else {
    app.use(morganDev);
  }
  
  app.use(errorLogger);
};

module.exports = {
  setupMorgan,
  morganDev,
  morganCombined,
  errorLogger,
  logDir
};
