
import LandingPage from "./pages/user"
import Userlayout from "./layouts/user-layout"

const routes = [
    {
        path: "/",
        element: <Userlayout />,
        children:[
            {
                path: "/",
                element: <LandingPage />,
            },
        ]
    },
]

export default routes