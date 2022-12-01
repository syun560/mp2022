import Head from 'next/head'
import Header from './Header'

interface Props {
    title: string
    navNum: number
    children: any
}

export default function Layout(props:Props) {
    return <div className="">
        <Head>
            <title>{props.title}</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossOrigin="anonymous"></link>
        </Head>
        <Header navNum={props.navNum} />
        <div className="container-fluid">
            {props.children}
        </div>
    </div>
}