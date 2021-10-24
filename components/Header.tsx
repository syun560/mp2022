import Link from 'next/link'

interface Props {
    navNum: number
}
interface NavPage {
    url: string
    name: string
}

export default function Header(props:Props) {
    const navPages:NavPage[] = [
        {
            url: '/',
            name: 'Home'
        },
        {
            url: '/fingering',
            name: 'Fingering'
        },
    ]
    const navItem = navPages.map((navPage, i)=> <li key={i} className="nav-item">
        <Link href={navPage.url}><a className={'nav-link' + (props.navNum === i ? ' active':'')}>{navPage.name}</a></Link>
    </li>)

    return <header>
        <nav className="navbar navbar-dark navbar-expand-sm navbar-light bg-dark">
            <div className="container-fluid shadow">
                <Link href='/'><a className="navbar-brand">Guitar Tab Generator</a></Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-sm-0">
                        {navItem}
                    </ul>
                </div>
            </div>
        </nav>
    </header>
}