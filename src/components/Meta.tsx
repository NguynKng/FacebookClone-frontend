import { Helmet, HelmetProvider } from "react-helmet-async";

function Meta({ title } : {title: string}) {
    return (
        <HelmetProvider>
            <Helmet>
                <title>{title}</title>
            </Helmet>
        </HelmetProvider>
    )
}

export default Meta;