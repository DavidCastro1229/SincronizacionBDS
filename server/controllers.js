const { Connection } = require('pg');
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

    let llavesForaneas = []
    const Llaves = await this.DataBaseUno.conection.query(`
    SELECT
    (SELECT relname FROM pg_catalog.pg_class c
    LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
     WHERE c.oid=r.conrelid) as nombre_tabla
    ,conname as nombre_llave,pg_catalog.pg_get_constraintdef(oid, true) as relacion_tipo_llave
    FROM pg_catalog.pg_constraint r
    WHERE r.conrelid in
    (SELECT c.oid FROM pg_catalog.pg_class c
    LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname !~ 'pg_' and c.relkind = 'r'  AND pg_catalog.pg_table_is_visible(c.oid))
     AND r.contype = 'f';
    `);
    for (let name of tablas) {
      for (let valor of Llaves.rows) {
        if (name === valor.nombre_tabla) {
          llavesForaneas.push({
            tabla: valor.nombre_tabla,
            llave: valor.nombre_llave,
            relacion: valor.relacion_tipo_llave
          });
        }
      }
    }
    console.log(llavesForaneas)

    // return res.json({ access: true, mensaje: "Sincronizacion exitosa" })



    const Existencia = await this.DataBaseDos.tablasExistentes(tablas, tablas.length);
    console.log(Existencia)




    if (Existencia.noExistentes.length > 0) {
      const crear = await this.DataBaseDos.crearTabla(Existencia.noExistentes, Existencia.noExistentes.length,
        this.DataBaseUno, BD1.bd, BD1.user, BD1.password);
      console.log(crear);
      const agregarPrimaryKey = await this.DataBaseDos.agregarPrimaryKey(tablas, this.DataBaseUno);
      console.log(agregarPrimaryKey)

      const agregarForaneas = await this.DataBaseDos.agregarForanea(tablas, Llaves.rows, llavesForaneas.length);
      console.log(agregarForaneas)
    }
    // if (Existencia.existentes) {
    //   const eliminarForaneas = await this.DataBaseDos.eliminarForaneas(tablas, Llaves.rows, llavesForaneas.length)
    //   console.log("eliminar foraneas", eliminarForaneas)

    //   const actualizar = await this.DataBaseDos.actualizarTabla(Existencia.existentes, Existencia.existentes.length,
    //     this.DataBaseUno, BD1.bd, BD1.user, BD1.password);
    //   console.log(actualizar);

    //   const agregarPrimaryKey = await this.DataBaseDos.agregarPrimaryKey(tablas, this.DataBaseUno);
    //   console.log(agregarPrimaryKey)

    //   const agregarForaneas = await this.DataBaseDos.agregarForanea(tablas, Llaves.rows, llavesForaneas.length);
    //   console.log(agregarForaneas)


    // }



    return res.json({ access: true, mensaje: "Sincronizacion exitosa" })
  } catch (error) {

    console.log(error.code)
    console.log(error.message)
    return res.json({ access: false, mensaje: error.message })
  }
}

module.exports = { Conectar, crearExtencion, Sincronizar };
