
import LandingPage from "./pages/user"
import Userlayout from "./layouts/user-layout"
import { RequireAuth } from "./context/auth-context"
import FacilitatorLayout from "./layouts/facilitator-layout"
import Home from "./pages/facilitator"
import Cohorts from "./pages/facilitator/cohorts/cohorts"
import ManageCohort from "./pages/facilitator/cohorts/manage"
import Settings from "./pages/facilitator/settings"
import Profile from "./pages/user/profile"

const routes = [
    {
        path: "/",
        element:<RequireAuth> <Userlayout /></RequireAuth>,
        children:[
            {
                path: "/",
                element: <LandingPage />,
            },
            {
                path: "/profile",
                element: <Profile />,
            },

        ]
    },
    {
        path: "/facilitator",
        element:<RequireAuth> <FacilitatorLayout /></RequireAuth>,
        children:[
            {
                path: "/facilitator",
                element: <Home />,
            },
            {
                path: "/facilitator/cohorts",
                element: <Cohorts />,
            },
            {
                path: "/facilitator/cohorts/manage/:id/:name",
                element: <ManageCohort />,
            },
            {
                path: "/facilitator/settings",
                element: <Settings />,
            },
        ]
    },
]

export default routes