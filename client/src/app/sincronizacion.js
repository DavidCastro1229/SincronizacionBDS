import React from 'react'
import Axios from "axios";
import { Input, Grid, Text, Button, Spacer, Table, Checkbox, Container, Collapse } from '@nextui-org/react'
export default function Form() {
    const [BD1, setBD1] = React.useState({
        host: 'localhost',
        port: '5432',
        bd: 'pop_prod',
        user: 'postgres',
        password: 'Xara0325',
    })
    const [BD2, setBD2] = React.useState({
        host: 'localhost',
        port: '5432',
        bd: 'pop_prod_tarifas',
        user: 'postgres',
        password: 'Xara0325',
    })
    const [estado, setEstado] = React.useState({
        BD2: null,
        BD1: null,
        tablasE: [],
        tablasNoE: [],
        vistasE: [],
        vistasnoE: [],
        indicesE: [],
        indicesNoE: [],
    })
    const [tablasSelecionadas, setTablas] = React.useState({
        actualizar: [],
        agregar: []
    })
    const [vistasSelecionadas, setVistas] = React.useState({
        actualizar: [],
        agregar: []
    })
    const [indicesSelecionados, setIndices] = React.useState({
        actualizar: [],
        agregar: []
    })
    const [estadoComparacion, setComparacion] = React.useState(false)
    const CBD1 = (e) => {
        const name = e.target.name;
        setBD1({ ...BD1, [name]: e.target.value })
    }
    const CBD2 = (e) => {
        const name = e.target.name;
        setBD2({ ...BD2, [name]: e.target.value })
    }
    const [selectedT, setSelectedT] = React.useState({
        actualizar: false,
        agregar: false
    })
    const [selectedV, setSelectedV] = React.useState({
        actualizar: false,
        agregar: false
    })
    const [selectedI, setSelectedI] = React.useState({
        actualizar: false,
        agregar: false
    })
    React.useEffect(() => {
        setEstado({ ...estado, BD1: null })
    }, [BD1])

    React.useEffect(() => {
        setEstado({ ...estado, BD2: null })
    }, [BD2])

    const comparacion = async () => {
        const res = await Axios.post('http://75.119.150.110:3012/comparacion', { BD1, BD2 });
        const {
            indicesExistentes, indicesNoExistentes, tablasExistentes, tablasNoExistentes,
            vistasExistentes, vistasNoExistentes } = res.data.comparacion
        console.log(res.data);
        if (res.data.access === false) return alert(res.data.mensaje)
        setEstado({
            ...estado, tablasE: tablasExistentes, tablasNoE: tablasNoExistentes,
            vistasE: vistasExistentes, vistasnoE: vistasNoExistentes, indicesE: indicesExistentes,
            indicesNoE: indicesNoExistentes
        });
        return setComparacion(true);
    }
    const Conect = async (origin) => {
        if (origin === 1) {
            const res = await Axios.post('http://75.119.150.110:3012/conectarbd', { BDS: BD1 });
            if (res.data.access === false) {
                setEstado({ ...estado, BD1: false });
                return alert(res.data.mensaje)
            }
            return setEstado({ ...estado, BD1: true });
        }
        if (origin === 2) {
            const res = await Axios.post('http://75.119.150.110:3012/conectarbd', { BDS: BD2 });
            console.log(res.data)
            if (res.data.access === false) {
                setEstado({ ...estado, BD2: false });
                return alert(res.data.mensaje);
            }
            return setEstado({ ...estado, BD2: true })
        }
    }
    const Extencion = async () => {
        const res = await Axios.post('http://75.119.150.110:3012/crearExtencion', { BDS: BD2 });
        console.log(res.data)
        if (res.data.access === false) return alert(res.data.mensaje)
        alert(res.data.mensaje)
    }
    const Sincronizar = async () => {
        const res = await Axios.post('http://75.119.150.110:3012/sincronizar', { BD1, BD2, tablasSelecionadas });
        console.log(res.data)
        if (res.data.access === false) return alert(res.data.mensaje)
        alert(res.data.mensaje)
    }
    const seleccionarTablas = (e, origin, metodo) => {

        switch (origin) {
            case 'tablas':
                if (metodo === 'allTablasE') {
                    if (selectedT.actualizar) {
                        setSelectedT({ ...selectedT, actualizar: false });
                        return setTablas({ ...tablasSelecionadas, actualizar: [] })
                    }
                    setSelectedT({ ...selectedT, actualizar: true });
                    return setTablas({ ...tablasSelecionadas, actualizar: estado.tablasE })
                }
                if (metodo === 'allTablasNoE') {
                    if (selectedT.agregar) {
                        setSelectedT({ ...selectedT, agregar: false });
                        return setTablas({ ...tablasSelecionadas, agregar: [] })
                    }
                    setSelectedT({ ...selectedT, agregar: true });
                    return setTablas({ ...tablasSelecionadas, agregar: estado.tablasNoE })
                }
                if (metodo === "actualizar") {
                    setTablas({ ...tablasSelecionadas, actualizar: e })
                    return setSelectedT({ ...selectedT, actualizar: false })
                }
                if (metodo === "agregar") {
                    setTablas({ ...tablasSelecionadas, agregar: e })
                    return setSelectedT({ ...selectedT, agregar: false })
                }

                break;
            case 'vistas':
                if (metodo === 'allVistasE') {
                    if (selectedV.actualizar) {
                        setSelectedV({ ...selectedV, actualizar: false });
                        return setVistas({ ...vistasSelecionadas, actualizar: [] })
                    }
                    setSelectedV({ ...selectedV, actualizar: true });
                    return setVistas({ ...vistasSelecionadas, actualizar: estado.vistasE })
                }
                if (metodo === 'allVistasNoE') {
                    if (selectedV.agregar) {
                        setSelectedV({ ...selectedV, agregar: false });
                        return setVistas({ ...vistasSelecionadas, agregar: [] })
                    }
                    setSelectedV({ ...selectedV, agregar: true });
                    return setVistas({ ...vistasSelecionadas, agregar: estado.vistasnoE })
                }
                if (metodo === "actualizar") {
                    setVistas({ ...vistasSelecionadas, actualizar: e })
                    return setSelectedV({ ...selectedV, actualizar: false })
                }
                if (metodo === "agregar") {
                    setVistas({ ...vistasSelecionadas, agregar: e })
                    return setSelectedV({ ...selectedV, agregar: false })
                }

                break;
            case 'indice':
                if (metodo === 'allIndiceE') {
                    if (selectedI.actualizar) {
                        setSelectedI({ ...selectedI, actualizar: false });
                        return setIndices({ ...indicesSelecionados, actualizar: [] })
                    }
                    setSelectedI({ ...selectedI, actualizar: true });
                    return setIndices({ ...indicesSelecionados, actualizar: estado.indicesE })
                }
                if (metodo === 'allIndiceNoE') {
                    if (selectedI.agregar) {
                        setSelectedI({ ...selectedI, agregar: false });
                        return setIndices({ ...indicesSelecionados, agregar: [] })
                    }
                    setSelectedI({ ...selectedI, agregar: true });
                    return setIndices({ ...indicesSelecionados, agregar: estado.indicesNoE })
                }
                if (metodo === "actualizar") {
                    setIndices({ ...indicesSelecionados, actualizar: e })
                    return setSelectedI({ ...selectedI, actualizar: false })
                }
                if (metodo === "agregar") {
                    setIndices({ ...indicesSelecionados, agregar: e })
                    return setSelectedI({ ...selectedI, agregar: false })
                }

                break;

            default:
                break;
        }
    }
    return (
        <>
            <Grid.Container css={{ height: "50vh", width: "100vw" }}>
                <Grid xs={12} sm={12} md={12} lg={12} justify="center" ><Text h1>BD 1</Text></Grid>
                <Grid justify='center' xs={12} sm={6} md={6} lg={6} xl={6}>
                    <Input
                        name="host"
                        clearable
                        size="xl"
                        onChange={CBD1}
                        type="text"
                        aria-label="host"
                        labelLeft="Host"
                    />
                </Grid>
                <Grid justify='center' xs={12} sm={6} md={6} lg={6} xl={6}>
                    <Input
                        name="port"
                        clearable
                        size="xl"
                        onChange={CBD1}
                        type="number"
                        aria-label="port"
                        labelLeft="Port"
                    />
                </Grid>
                <Grid justify='center' xs={12} sm={6} md={6} lg={6} xl={6}>
                    <Input
                        name="bd"
                        clearable
                        size="xl"
                        onChange={CBD1}
                        type="text"
                        aria-label="Data Base"
                        labelLeft="BD"
                    />
                </Grid>
                <Grid justify='center' xs={12} sm={6} md={6} lg={6} xl={6}>
                    <Input
                        name="user"
                        clearable
                        size="xl"
                        onChange={CBD1}
                        type="text"
                        aria-label="username"
                        labelLeft="User"
                    />
                </Grid>
                <Grid justify='center' xs={12} sm={6} md={6} lg={6} xl={6}>
                    <Input
                        name="password"
                        clearable
                        size="xl"
                        onChange={CBD1}
                        type="password"
                        aria-label="password"
                        labelLeft="Password"
                    />
                </Grid>
                <Grid justify='center' xs={12} sm={6} md={6} lg={6} xl={6}>
                    <Button flat color={estado.BD1 === false ? 'error' : estado.BD1 === true ? 'success' : 'primary'}
                        onPress={() => Conect(1)}>{estado.BD1 === false ? 'Conexion fallida' : estado.BD1 === true ? 'Conectado' : 'Conectar'}</Button>
                </Grid>
            </Grid.Container>

            <Grid.Container css={{ height: "50vh", width: "100vw" }}>

                <Grid xs={12} sm={12} md={12} lg={12} justify="center" ><Text h1>BD 2</Text></Grid>

                <Grid justify='center' xs={12} sm={6} md={6} lg={6} xl={6}>
                    <Input
                        name="host"
                        clearable
                        size="xl"
                        onChange={CBD2}
                        type="text"
                        aria-label="host"
                        labelLeft="Host"
                    />
                </Grid>
                <Grid justify='center' xs={12} sm={6} md={6} lg={6} xl={6}>
                    <Input
                        name="port"
                        clearable
                        size="xl"
                        onChange={CBD2}
                        type="number"
                        aria-label="port"
                        labelLeft="Port"
                    />
                </Grid>
                <Grid justify='center' xs={12} sm={6} md={6} lg={6} xl={6}>
                    <Input
                        name="bd"
                        clearable
                        size="xl"
                        onChange={CBD2}
                        type="text"
                        aria-label="Data Base"
                        labelLeft="BD"
                    />
                </Grid>
                <Grid justify='center' xs={12} sm={6} md={6} lg={6} xl={6}>
                    <Input
                        name="user"
                        clearable
                        size="xl"
                        onChange={CBD2}
                        type="text"
                        aria-label="username"
                        labelLeft="User"
                    />
                </Grid>
                <Grid justify='center' xs={12} sm={6} md={6} lg={6} xl={6}>
                    <Input
                        name="password"
                        clearable
                        size="xl"
                        onChange={CBD2}
                        type="password"
                        aria-label="password"
                        labelLeft="Password"
                    />
                </Grid>
                <Grid justify='center' xs={12} sm={6} md={6} lg={6} xl={6}>
                    <Button flat color={estado.BD2 === false ? 'error' : estado.BD2 === true ? 'success' : 'primary'} onPress={() => Conect(2)} >
                        {estado.BD2 === false ? 'Conexion fallida' : estado.BD2 === true ? 'Conectado' : 'Conectar'}
                    </Button>
                </Grid>
                <Grid justify='center' xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Button flat size="xs" disabled={estado.BD1 && estado.BD2 === false ? true : estado.BD1 && estado.BD2 === true ? false : true} color="primary" onPress={Extencion} >
                        Crear Extencion
                    </Button>
                </Grid>
                <Spacer x={15} />

                <Grid justify='center' xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Button flat disabled={estado.BD1 && estado.BD2 === false ? true : estado.BD1 && estado.BD2 === true ? false : true} color="warning"
                        onPress={comparacion} >
                        comparacion
                    </Button>
                </Grid>
                <Grid justify='center' xs={12} sm={12} md={12} lg={12} xl={12}>
                <Button flat disabled={estado.BD1 && estado.BD2 && estadoComparacion === false ? true : estado.BD1 && estado.BD2 === true ? false : true} color="primary"
                        onPress={Sincronizar} >
                        Sincronizar
                    </Button>
                    </Grid>

            </Grid.Container>


            <Spacer x={15} />
            <Grid.Container css={{width:"100vw"}}>
                <Grid justify='center' xs={12} ms={6} md={6} lg={6} xl={6}>
                    <Collapse.Group splitted css={{width:"100%"}}>
                        <Collapse title="Actualizar Tablas">
                            {
                                estadoComparacion ?
                                    <>
                                        <Checkbox value="allTablasE" isSelected={selectedT.actualizar} color="primary"
                                            onChange={() => seleccionarTablas('1', 'tablas', 'allTablasE')}>Seleccionar todas</Checkbox>
                                        <Checkbox.Group
                                            color="success"
                                            label="Selecionar tablas"
                                            value={tablasSelecionadas.actualizar}
                                            css={{ padding: "$1" }}
                                            onChange={(e) => seleccionarTablas(e, 'tablas', 'actualizar')}
                                        >
                                            <Table
                                                bordered
                                                aria-label="Actualizar tabla"
                                                css={{
                                                    height: "auto",
                                                    minWidth: "100%",
                                                    textAlign: "start"
                                                }}
                                                selectionMode="none"
                                                color="secondary"
                                            // onSelectionChange={(tabla) => tablasE(tabla, tablasE)}
                                            >
                                                <Table.Header>
                                                    <Table.Column key='tablasE'>Actualizar Tablas</Table.Column>
                                                </Table.Header>
                                                <Table.Body css={{ textAlign: "start" }} >
                                                    {estado.tablasE.map((t, i) => {
                                                        return (
                                                            <Table.Row key={`${i + 1}`} >
                                                                <Table.Cell><Checkbox value={t}>{t}</Checkbox></Table.Cell>
                                                            </Table.Row>

                                                        )
                                                    })}
                                                </Table.Body>
                                                <Table.Pagination
                                                    shadow
                                                    noMargin
                                                    color="secondary"
                                                    align="center"
                                                    rowsPerPage={7}
                                                />
                                            </Table>
                                        </Checkbox.Group>
                                    </>
                                    : ""
                            }
                        </Collapse>
                        <Collapse title="Agregar Tablas">
                            {
                                estadoComparacion ?
                                    <>
                                        <Checkbox value="allTablasNoE" isSelected={selectedT.agregar} color="primary"
                                            onChange={() => seleccionarTablas('2', 'tablas', 'allTablasNoE')}>Seleccionar todas</Checkbox>
                                        <Checkbox.Group
                                            color="success"
                                            label="tablas no existentes"
                                            value={tablasSelecionadas.agregar}
                                            css={{ padding: "$1" }}
                                            onChange={(e) => seleccionarTablas(e, 'tablas', 'agregar')}
                                        >
                                            <Table
                                                bordered
                                                aria-label="Agregar tabla"
                                                css={{
                                                    height: "auto",
                                                    minWidth: "100%",
                                                    textAlign: "start"
                                                }}
                                                selectionMode="none"
                                                color="secondary"
                                            // onSelectionChange={(tabla) => tablasE(tabla, tablasE)}
                                            >
                                                <Table.Header>
                                                    <Table.Column key='tablasE'>Agregar Tablas</Table.Column>
                                                </Table.Header>
                                                <Table.Body css={{ textAlign: "start" }} >
                                                    {estado.tablasNoE.map((t, i) => {
                                                        return (
                                                            <Table.Row key={`${i + 1}`} >
                                                                <Table.Cell><Checkbox value={t}>{t}</Checkbox></Table.Cell>
                                                            </Table.Row>

                                                        )
                                                    })}
                                                </Table.Body>
                                                <Table.Pagination
                                                    shadow
                                                    noMargin
                                                    color="secondary"
                                                    align="center"
                                                    rowsPerPage={7}
                                                />
                                            </Table>
                                        </Checkbox.Group>
                                    </>
                                    : ""
                            }
                        </Collapse>
                        <Collapse title="Actualizar Vistas">
                            {
                                estadoComparacion ?
                                    <>
                                        <Checkbox value="allVistasE" isSelected={selectedV.actualizar} color="primary"
                                            onChange={() => seleccionarTablas('3', 'vistas', 'allVistasE')}>Seleccionar todas</Checkbox>
                                        <Checkbox.Group
                                            color="success"
                                            label="Actualizar Vistas"
                                            value={vistasSelecionadas.actualizar}
                                            css={{ padding: "$1" }}
                                            onChange={(e) => seleccionarTablas(e, 'vistas', 'actualizar')}
                                        >
                                            <Table
                                                bordered
                                                aria-label="vistas Existentes"
                                                css={{
                                                    height: "auto",
                                                    minWidth: "100%",
                                                    textAlign: "start"
                                                }}
                                                selectionMode="none"
                                                color="secondary"
                                            // onSelectionChange={(tabla) => tablasE(tabla, tablasE)}
                                            >
                                                <Table.Header>
                                                    <Table.Column key='tablasE'>Actualizar vistas</Table.Column>
                                                </Table.Header>
                                                <Table.Body css={{ textAlign: "start" }} >
                                                    {estado.vistasE.map((t, i) => {
                                                        return (
                                                            <Table.Row key={`${i + 1}`} >
                                                                <Table.Cell><Checkbox value={t}>{t}</Checkbox></Table.Cell>
                                                            </Table.Row>

                                                        )
                                                    })}
                                                </Table.Body>
                                                <Table.Pagination
                                                    shadow
                                                    noMargin
                                                    color="secondary"
                                                    align="center"
                                                    rowsPerPage={7}
                                                />
                                            </Table>
                                        </Checkbox.Group>
                                    </>
                                    : ""
                            }
                        </Collapse>

                    </Collapse.Group>
                </Grid>
                <Grid justify='center' xs={12} ms={6} md={6} lg={6} xl={6}>
                    <Collapse.Group splitted css={{width:"100%"}}>
                            <Collapse title="Agregar Vistas">
                                {
                                    estadoComparacion ?
                                        <>
                                            <Checkbox value="allVistasE" isSelected={selectedV.agregar} color="primary"
                                                onChange={() => seleccionarTablas('4', 'vistas', 'allVistasNoE')}>Seleccionar todas</Checkbox>
                                            <Checkbox.Group
                                                color="success"
                                                label="Agregar Vistas"
                                                value={vistasSelecionadas.agregar}
                                                css={{ padding: "$1" }}
                                                onChange={(e) => seleccionarTablas(e, 'vistas', 'agregar')}
                                            >
                                                <Table
                                                    bordered
                                                    aria-label="vistas no existentes"
                                                    css={{
                                                        height: "auto",
                                                        minWidth: "100%",
                                                        textAlign: "start"
                                                    }}
                                                    selectionMode="none"
                                                    color="secondary"
                                                >
                                                    <Table.Header>
                                                        <Table.Column key='tablasE'>Agregar vistas</Table.Column>
                                                    </Table.Header>
                                                    <Table.Body css={{ textAlign: "start" }} >
                                                        {estado.vistasnoE.map((t, i) => {
                                                            return (
                                                                <Table.Row key={`${i + 1}`} >
                                                                    <Table.Cell><Checkbox value={t}>{t}</Checkbox></Table.Cell>
                                                                </Table.Row>

                                                            )
                                                        })}
                                                    </Table.Body>
                                                    <Table.Pagination
                                                        shadow
                                                        noMargin
                                                        color="secondary"
                                                        align="center"
                                                        rowsPerPage={7}
                                                    />
                                                </Table>
                                            </Checkbox.Group>
                                        </>
                                        : ""
                                }
                            </Collapse>
                            <Collapse title="Actualizar Indices">
                                {
                                    estadoComparacion ?
                                        <>
                                            <Checkbox value="allIndiceE" isSelected={selectedI.actualizar} color="primary"
                                                onChange={() => seleccionarTablas('5', 'indice', 'allIndiceE')}>Seleccionar todas</Checkbox>
                                            <Checkbox.Group
                                                color="success"
                                                label="Actualizar Indice"
                                                value={indicesSelecionados.actualizar}
                                                css={{ padding: "$1" }}
                                                onChange={(e) => seleccionarTablas(e, 'indice', 'actualizar')}
                                            >
                                                <Table
                                                    bordered
                                                    aria-label="indice existentes"
                                                    css={{
                                                        height: "auto",
                                                        minWidth: "100%",
                                                        textAlign: "start"
                                                    }}
                                                    selectionMode="none"
                                                    color="secondary"
                                                >
                                                    <Table.Header>
                                                        <Table.Column key='tablasE'>Actualizar indices</Table.Column>
                                                    </Table.Header>
                                                    <Table.Body css={{ textAlign: "start" }} >
                                                        {estado.indicesE.map((t, i) => {
                                                            return (
                                                                <Table.Row key={`${i + 1}`} >
                                                                    <Table.Cell><Checkbox value={t}>{t}</Checkbox></Table.Cell>
                                                                </Table.Row>

                                                            )
                                                        })}
                                                    </Table.Body>
                                                    <Table.Pagination
                                                        shadow
                                                        noMargin
                                                        color="secondary"
                                                        align="center"
                                                        rowsPerPage={7}
                                                    />
                                                </Table>
                                            </Checkbox.Group>
                                        </>
                                        : ""
                                }
                            </Collapse>
                            <Collapse title="Agregar Indices">
                                {
                                    estadoComparacion ?
                                        <>
                                            <Checkbox value="allIndiceNoE" isSelected={selectedI.agregar} color="primary"
                                                onChange={() => seleccionarTablas('6', 'indice', 'allIndiceNoE')}>Seleccionar todas</Checkbox>
                                            <Checkbox.Group
                                                color="success"
                                                label="agregar Indice"
                                                value={indicesSelecionados.agregar}
                                                css={{ padding: "$1" }}
                                                onChange={(e) => seleccionarTablas(e, 'indice', 'agregar')}
                                            >
                                                <Table
                                                    bordered
                                                    aria-label="indice no existentes"
                                                    css={{
                                                        height: "auto",
                                                        minWidth: "100%",
                                                        textAlign: "start"
                                                    }}
                                                    selectionMode="none"
                                                    color="secondary"
                                                >
                                                    <Table.Header>
                                                        <Table.Column key='indice'>Agregar indices</Table.Column>
                                                    </Table.Header>
                                                    <Table.Body css={{ textAlign: "start" }} >
                                                        {estado.indicesNoE.map((t, i) => {
                                                            return (
                                                                <Table.Row key={`${i + 1}`} >
                                                                    <Table.Cell><Checkbox value={t}>{t}</Checkbox></Table.Cell>
                                                                </Table.Row>

                                                            )
                                                        })}
                                                    </Table.Body>
                                                    <Table.Pagination
                                                        shadow
                                                        noMargin
                                                        color="secondary"
                                                        align="center"
                                                        rowsPerPage={7}
                                                    />
                                                </Table>
                                            </Checkbox.Group>
                                        </>
                                        : ""
                                }
                            </Collapse>
                    </Collapse.Group>
                </Grid>
            </Grid.Container>
       
        </>
    )
}