import React from 'react'
import Axios from "axios";
import { Input, Grid, Text, Button, Spacer, Table, Checkbox, Container } from '@nextui-org/react'
export default function Form() {
    const [BD1, setBD1] = React.useState({
        host: undefined,
        port: undefined,
        bd: undefined,
        user: undefined,
        password: undefined,
    })
    const [BD2, setBD2] = React.useState({
        host: undefined,
        port: undefined,
        bd: undefined,
        user: undefined,
        password: undefined,
    })
    const [estado, setEstado] = React.useState({
        BD1: null,
        existentes: null,
        noExistentes: null,
        BD2: null,
    })
    const [tablas, setTablas] = React.useState([])
    const [verTablasEstado, setVerTablas] = React.useState(false)
    const CBD1 = (e) => {
        const name = e.target.name;
        setBD1({ ...BD1, [name]: e.target.value })
    }
    const CBD2 = (e) => {
        const name = e.target.name;
        setBD2({ ...BD2, [name]: e.target.value })
    }
    const [selected, setSelected] = React.useState({
        actualizar:false,
        agregar:false
    })
    React.useEffect(() => {
        setEstado({ ...estado, BD1: null })
    }, [BD1])

    React.useEffect(() => {
        setEstado({ ...estado, BD2: null })
    }, [BD2])
    React.useEffect(() => {
        if (estado.BD1 === true && estado.BD2 === true) {
            verTablas()
        }
    }, [estado.BD1, estado.BD2])

    async function verTablas() {
        const res = await Axios.post('http://localhost:4000/verTablas', { BD1, BD2 });
        console.log(res.data)
        if (res.data.access === false) return alert(res.data.mensaje)
        console.log(res.data.table.existentes);
        setEstado({ ...estado, existentes: res.data.table.existentes, noExistentes: res.data.table.noExistentes });
        return setVerTablas(true);
    }
    const Conect = async (origin) => {
        if (origin === 1) {
            const res = await Axios.post('http://localhost:4000/conectarbd', { BDS: BD1 });
            if (res.data.access === false) {
                setEstado({ ...estado, BD1: false });
                return alert(res.data.mensaje)
            }
            return setEstado({ ...estado, BD1: true });
        }
        if (origin === 2) {
            const res = await Axios.post('http://localhost:4000/conectarbd', { BDS: BD2 });
            console.log(res.data)
            if (res.data.access === false) {
                setEstado({ ...estado, BD2: false });
                return alert(res.data.mensaje);
            }
            return setEstado({ ...estado, BD2: true })
        }
    }
    const Extencion = async () => {
        const res = await Axios.post('http://localhost:4000/crearExtencion', { BDS: BD2 });
        console.log(res.data)
        if (res.data.access === false) return alert(res.data.mensaje)
        alert(res.data.mensaje)
    }
    const Sincronizar = async () => {
        const res = await Axios.post('http://localhost:4000/sincronizar', { BD1, BD2, tablas });
        console.log(res.data)
        if (res.data.access === false) return alert(res.data.mensaje)
        alert(res.data.mensaje)
    }
    const seleccionarTablas = (e) => {
        if (e === 'allActualizar') {
            console.log("entraaa")
            if (selected.actualizar) {
                setSelected({...selected, actualizar:false});
                return setTablas([])
            }
            setSelected({...selected, actualizar:true});
            return setTablas(estado.existentes)
        }
        if (e === 'allAgregar') {
            console.log("entraaa")
            if (selected.agregar) {
                setSelected({...selected, agregar:false});
                return setTablas([])
            }
            setSelected({...selected, agregar:true});
            return setTablas(estado.noExistentes)
        }
        setSelected(false);
        console.log(e)
        setTablas(e)

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
                <Grid justify='center' direction='column' xs={12} sm={6} md={6} lg={6} xl={6}>
                    {
                        estado.BD1 && estado.BD2 && verTablasEstado ?
                            <>
                                <Text h1>Actualizar tablas</Text>
                                <Container fluid css={{ height: "30vh", overflow: "auto" }}>
                                    <Checkbox value="allActualizar" isSelected={selected.actualizar} color="primary" onChange={() => seleccionarTablas('allActualizar')}>Seleccionar todas</Checkbox>
                                    <Checkbox.Group
                                        color="success"
                                        label="Selecionar tablas"
                                        value={tablas}
                                        css={{ padding: "$1" }}
                                        onChange={seleccionarTablas}
                                    >
                                        {
                                            estado.existentes.map((t) => {
                                                return (
                                                    <Checkbox value={t}>{t}</Checkbox>
                                                )
                                            })
                                        }
                                    </Checkbox.Group>
                                </Container>
                            </>
                            : ""
                    }
                </Grid>
                <Grid justify='center' direction='column' xs={12} sm={6} md={6} lg={6} xl={6}>
                    {
                        estado.BD1 && estado.BD2 && verTablasEstado ?
                            <>
                                <Text h1>Añadir Tablas</Text>
                                <Container fluid css={{ height: "30vh", overflow: "auto" }}>
                                    {/* <Checkbox value="allAgregar" isSelected={selected.agregar} color="primary" onChange={()=>seleccionarTablas('allAgregar')}>Seleccionar todas</Checkbox> */}
                                    <Checkbox.Group
                                        color="success"
                                        label="Selecionar tablas"
                                        value={tablas}
                                        css={{ padding: "$1" }}
                                        onChange={seleccionarTablas}
                                    >
                                        {
                                            estado.noExistentes.map((t) => {
                                                return (
                                                    <Checkbox value={t}>{t}</Checkbox>
                                                )
                                            })
                                        }
                                    </Checkbox.Group>
                                </Container>
                            </>
                            : ""
                    }

                    <Spacer x={15} />
                </Grid>
                <Grid justify='center' xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Button flat size="xs" disabled={estado.BD1 && estado.BD2 === false ? true : estado.BD1 && estado.BD2 === true ? false : true} color="primary" onPress={Extencion} >
                        Crear Extencion
                    </Button>
                </Grid>
                <Spacer x={15} />
                <Grid justify='center' xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Button flat disabled={estado.BD1 && estado.BD2 === false ? true : estado.BD1 && estado.BD2 === true ? false : true} color="primary"
                        onPress={Sincronizar} >
                        Sincronizar
                    </Button>
                </Grid>
            </Grid.Container>

            <Spacer x={15} />
        </>
    )
}