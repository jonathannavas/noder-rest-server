/*=============================
            PUERTO
==============================*/
process.env.PORT = process.env.PORT || 3000;


/*=============================
            ENTORNO
==============================*/

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


/*=============================
     VENCIMIENTO DEL TOKEN
==============================*/
//60 seg
//60 min
//24 horas
//30 dias

process.env.CADUCIDAD_TOKEN = '48h';



/*=============================
    SEED DE VERIFICACION
==============================*/
process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo';

/*=============================
        BASE DE DATOS
==============================*/
let urlDB;
if (process.env.NODE_ENV == 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

/*=============================
        GOOGLE CLIENT ID
==============================*/
process.env.CLIENT_ID = process.env.CLIENT_ID || '1057420145920-cqri6ls14coil3pcanp437kb4uqhuvm1.apps.googleusercontent.com';