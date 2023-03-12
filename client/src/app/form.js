import React from 'react'
import Axios from "axios";
import { Input, Grid, Text, Button, Spacer } from '@nextui-org/react'
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
        data1: null,
        BD2: null,
        data2: null
    })
    const [tabla, setTabla] = React.useState('')
    const CBD1 = (e) => {
        const name = e.target.name;
        setBD1({ ...BD1, [name]: e.target.value })
    }
    const CBD2 = (e) => {
        const name = e.target.name;
        setBD2({ ...BD2, [name]: e.target.value })
    }
    React.useEffect(() => {
        setEstado({ ...estado, BD1: null })
    }, [BD1])

    React.useEffect(() => {
        setEstado({ ...estado, BD2: null })
    }, [BD2])
    const Conect = async (origin) => {
        if (origin === 1) {
            const res = await Axios.post('http://localhost:4000/conectarbd?origin=1', { BDS: BD1 });
            const data = res.data.data;
            if (res.data.access === false) {
                setEstado({ ...estado, BD1: false });
                return alert(res.data.mensaje)

            }
            return setEstado({ ...estado, BD1: true, data1: data });
        }
        if (origin === 2) {
            const res = await Axios.post('http://localhost:4000/conectarbd?origin=2', { BDS: BD2 });
            console.log(res.data)
            const data = res.data.data;
            if (res.data.access === false) {
                setEstado({ ...estado, BD2: false });
                return alert(res.data.mensaje);
            }
            console.log(data)
            return setEstado({ ...estado, BD2: true, data2: data })
        }
    }
    const Extencion = async () => {
        const res = await Axios.post('http://localhost:4000/crearExtencion', { BDS: BD2 });
        console.log(res.data)
        if (res.data.access === false) return alert(res.data.mensaje)
        alert(res.data.mensaje)
    }
    const Sincronizar = async () => {
        const res = await Axios.post('http://localhost:4000/sincronizar', { BD1, BD2, tabla });
        console.log(res.data)
        if (res.data.access === false) return alert(res.data.mensaje)
        alert(res.data.mensaje)
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
                <Grid justify='center' xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Input
                        name="tabla"
                        clearable
                        size="xl"
                        onChange={(e) => setTabla(e.target.value)}
                        type="text"
                        aria-label="tabla"
                        labelLeft="Tabla"
                    />
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