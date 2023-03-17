
const { Pool } = require('pg');

class BD {
    constructor(HOST, USER, DATABASE, PORT, PASSWORD) {
        this.HOST = HOST
        this.USER = USER
        this.DATABASE = DATABASE
        this.PORT = PORT
        this.PASSWORD = PASSWORD
        this.conection = new Pool({
            host: HOST,
            user: USER,
            database: DATABASE,
            port: PORT,
            password: PASSWORD
        })
    }

    async tablasExistentes(tablas, longitud){
        let long = 0;
        let tablasExistentes = []
        let tablasNoExistentes = []
        for(let name of tablas){
            long = long +1
            const validarExistencia = await this.conection.query(`
            SELECT table_name FROM information_schema.columns 
            WHERE table_name = '${name}' 
        `);
        if(validarExistencia.rowCount > 0) tablasExistentes.push(name);
        if(validarExistencia.rowCount === 0) tablasNoExistentes.push(name);
        if(long === longitud) return {existentes: tablasExistentes, noExistentes:tablasNoExistentes }
          }
    }

    async crearTabla(tablas, longitud, conexionBD1, bd, user, password ) {
        let long = 0;
        for (let name of tablas) {
            long = long + 1;
console.log(long)
        console.log('inicia la tabla', name)
        const infoTabla = await conexionBD1.conection.query(`
      SELECT DISTINCT 
      a.attnum as no,
      a.attname as nombre_columna,
      format_type(a.atttypid, a.atttypmod) as tipo,
      a.attnotnull as notnull, 
      com.description as descripcion,
      coalesce(i.indisprimary, false) as llave_primaria
  FROM pg_attribute a 
  JOIN pg_class pgc ON pgc.oid = a.attrelid
  LEFT JOIN pg_index i ON 
      (pgc.oid = i.indrelid AND i.indkey[0] = a.attnum)
  LEFT JOIN pg_description com on 
      (pgc.oid = com.objoid AND a.attnum = com.objsubid)
  LEFT JOIN pg_attrdef def ON 
      (a.attrelid = def.adrelid AND a.attnum = def.adnum)
  WHERE a.attnum > 0 AND pgc.oid = a.attrelid
  AND pg_table_is_visible(pgc.oid)
  AND NOT a.attisdropped
   AND pgc.relname = '${name}'  -- Nombre de la tabla
  ORDER BY a.attnum;
      `);

        const datos = []
        if (infoTabla.rows[0].nombre_columna === infoTabla.rows[1].nombre_columna) {
          infoTabla.rows.shift()
        }
        infoTabla.rows.forEach((data) => {
          datos.push(`${data.nombre_columna} ${data.tipo}`)
        })
        const columns = datos.toString();
        await this.conection.query(`
        CREATE TABLE "${name}"
        AS select * from dblink('dbname=${bd} user=${user} password=${password}',
        'select * from "${name}"')					 
        as "${name}" (${columns})     
        `);
        console.log('se cero la tabla', name)
        if(long === longitud) return true

    }




    
    }
    async actualizarTabla(tablas, longitud, conexionBD1, bd, user, password ) {
        let long = 0;
        for (let name of tablas) {
            long = long + 1;
console.log(long)
        console.log('inicia la tabla', name)
        const infoTabla = await conexionBD1.conection.query(`
      SELECT DISTINCT 
      a.attnum as no,
      a.attname as nombre_columna,
      format_type(a.atttypid, a.atttypmod) as tipo,
      a.attnotnull as notnull, 
      com.description as descripcion,
      coalesce(i.indisprimary, false) as llave_primaria
  FROM pg_attribute a 
  JOIN pg_class pgc ON pgc.oid = a.attrelid
  LEFT JOIN pg_index i ON 
      (pgc.oid = i.indrelid AND i.indkey[0] = a.attnum)
  LEFT JOIN pg_description com on 
      (pgc.oid = com.objoid AND a.attnum = com.objsubid)
  LEFT JOIN pg_attrdef def ON 
      (a.attrelid = def.adrelid AND a.attnum = def.adnum)
  WHERE a.attnum > 0 AND pgc.oid = a.attrelid
  AND pg_table_is_visible(pgc.oid)
  AND NOT a.attisdropped
   AND pgc.relname = '${name}'  -- Nombre de la tabla
  ORDER BY a.attnum;
      `);

        const datos = []
        if (infoTabla.rows[0].nombre_columna === infoTabla.rows[1].nombre_columna) {
          infoTabla.rows.shift()
        }
        infoTabla.rows.forEach((data) => {
          datos.push(`${data.nombre_columna} ${data.tipo}`)
        })
        const columns = datos.toString();
        await this.conection.query(`
        drop table "${name}";
        CREATE TABLE "${name}"
        AS select * from dblink('dbname=${bd} user=${user} password=${password}',
        'select * from "${name}"')					 
        as "${name}" (${columns})
        
        `);

        console.log('se actualizo la tabla', name)
        if(long === longitud) return true

    }




    
    }
    async agregarForanea(tablas, llaves, logitud) {
        let long = 0;
        console.log(logitud)

        for(let name of tablas ){
            for (let e of llaves) {
                if (name === e.tabla) {
                    long = long + 1;
                    console.log(long)
                    console.log(e.tabla)
                    await this.conection.query(`
                  ALTER TABLE "${name}" 
             ADD CONSTRAINT ${e.llave} 
             FOREIGN KEY (${e.nombre_columna}) REFERENCES "${e.referencia_table}"(${e.referencia_columna})
                  `)
                    console.log('Exito, foranea agregada a la tabla ,', name)
                }
            }
        }
        if (long === logitud) return true
    }
    async eliminarForaneas(tablas, llaves, logitud) {
        let long = 0;
        for(let name of tablas){
        for (let e of llaves) {
            if (name === e.tabla) {
                long = long + 1;
                console.log(long)
                await this.conection.query(`
        ALTER TABLE "${name}" DROP CONSTRAINT ${e.llave};
              `)
                console.log('se elimino foranea de la tabla', name)
            }
        }
    }
        if (long === logitud) return true
    }

    async agregarPrimaryKey(tablas,conexionBD1) {
        let long = 0;
      
        for(let name of tablas){
            const infoTabla = await conexionBD1.conection.query(`
            SELECT DISTINCT 
            a.attnum as no,
            a.attname as nombre_columna,
            format_type(a.atttypid, a.atttypmod) as tipo,
            a.attnotnull as notnull, 
            com.description as descripcion,
            coalesce(i.indisprimary, false) as llave_primaria
        FROM pg_attribute a 
        JOIN pg_class pgc ON pgc.oid = a.attrelid
        LEFT JOIN pg_index i ON 
            (pgc.oid = i.indrelid AND i.indkey[0] = a.attnum)
        LEFT JOIN pg_description com on 
            (pgc.oid = com.objoid AND a.attnum = com.objsubid)
        LEFT JOIN pg_attrdef def ON 
            (a.attrelid = def.adrelid AND a.attnum = def.adnum)
        WHERE a.attnum > 0 AND pgc.oid = a.attrelid
        AND pg_table_is_visible(pgc.oid)
        AND NOT a.attisdropped
         AND pgc.relname = '${name}'  -- Nombre de la tabla
        ORDER BY a.attnum;
            `);

            long = long + 1;
            console.log(long)
        for (let e of infoTabla.rows) {
            if (e.llave_primaria === true) {
                console.log(e.nombre_columna);
                await this.conection.query(`
                alter table "${name}" add primary key (${e.nombre_columna})`);
                console.log('se agrega llave primaria a la tabla', name)
            }
        }
    }

        if (long === tablas.lenght) return true
    }
}
module.exports = BD
