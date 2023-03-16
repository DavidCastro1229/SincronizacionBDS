const BD = require('./database');

const Conectar = async (req, res) => {
  const { BDS } = req.body;
  const { origin } = req.query;
  console.log(req.body)
  try {
    const DataBase = new BD(BDS.host, BDS.user, BDS.bd, BDS.port, BDS.password);
    if (origin == 1) {
      const tablas = await DataBase.conection.query(`
      SELECT table_name
  FROM information_schema.tables
  WHERE table_schema='public'
  AND table_type='BASE TABLE';
      `)
      console.log(tablas.rows);
      return res.json({ access: true, tablasBd: tablas.rows })
    }
    await DataBase.conection.query(`
      SELECT table_name
  FROM information_schema.tables
  WHERE table_schema='public'
  AND table_type='BASE TABLE';
      `)
    return res.json({ access: true })

  } catch (error) {
    console.log(error.message)
    return res.json({ access: false, mensaje: error.message })
  }
}

const crearExtencion = async (req, res) => {
  try {
    const { BDS } = req.body;
    const DataBase = new BD(BDS.host, BDS.user, BDS.bd, BDS.port, BDS.password);
    const response = await DataBase.conection.query(`create extension dblink;`);
    console.log(response)
    res.json({ access: true, mensaje: "Extencion Creada" })
  } catch (error) {
    console.log(error.message)
    res.json({ access: false, mensaje: error.message })
  }
}

const Sincronizar = async (req, res) => {
  try {
    const { BD1, BD2, tablas } = req.body;
    this.DataBaseUno = new BD(BD1.host, BD1.user, BD1.bd, BD1.port, BD1.password);
    this.DataBaseDos = new BD(BD2.host, BD2.user, BD2.bd, BD2.port, BD2.password);

    console.log('inicia')
    for (let name of tablas) {
      console.log(name)
      const infoTabla = await this.DataBaseUno.conection.query(`
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
      console.log('pasa infoTabla')

      const datos = []
      if(infoTabla.rows[0].nombre_columna === infoTabla.rows[1].nombre_columna){
        infoTabla.rows.shift()
      }
      infoTabla.rows.forEach((data) => {
        datos.push(`${data.nombre_columna} ${data.tipo}`)
      })
      const columns = datos.toString();
      console.log(columns)
      console.log('se crea la columna en cadena')

      const validarExistencia = await this.DataBaseDos.conection.query(`
    SELECT table_name FROM information_schema.columns 
    WHERE table_name = '${name}' 
`);
      console.log('pasa validar existencia')
      if (validarExistencia.rowCount === 0) {
        console.log('la tabla no exise entonces se crea')
        await this.DataBaseDos.conection.query(`
  CREATE TABLE "${name}"
  AS select * from dblink('dbname=${BD1.bd} user=${BD1.user} password=${BD1.password}',
  'select * from "${name}"')					 
  as "${name}" (${columns})     
  `);
        console.log('Exitoso tabla', name)
      } else {
        console.log('la tabla si existe se actualiza')
        await this.DataBaseDos.conection.query(`
        drop table "${name}";
        CREATE TABLE "${name}"
        AS select * from dblink('dbname=${BD1.bd} user=${BD1.user} password=${BD1.password}',
        'select * from "${name}"')					 
        as "${name}" (${columns})
        
        `);
        console.log('Exitoso tabla', name)
      }
    }
    console.log('termina')
    return res.json({ access: true, mensaje: "Sincronizacion exitosa" })
  } catch (error) {

    console.log(error.code)
    console.log(error.message)
    return res.json({ access: false, mensaje: error.message })
  }
}

module.exports = { Conectar, crearExtencion, Sincronizar };
