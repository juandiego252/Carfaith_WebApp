import { AuthLayout } from "@/modules/auth/layout/AuthLayout"
import { LoginPage } from "@/modules/auth/pages/LoginPage"
import { lazy, Suspense } from "react"

const DashboardLayout = lazy(() => import('../modules/dashboard/layout/DashBoardLayout'));

import { BrowserRouter, Navigate, Route, Routes } from "react-router"

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Auth */}
                <Route path="/auth" element={<AuthLayout />}>
                    <Route index element={<LoginPage />} />
                </Route>

                {/* Dashboard */}
                <Route path="/dashboard" element={
                    <Suspense
                        fallback={
                            <div className="flex h-screen w-full items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                            </div>
                        }
                    >
                        <DashboardLayout />
                    </Suspense>
                }>

                </Route>


                <Route path="*" element={<Navigate to="/auth" />} />
            </Routes>
        </BrowserRouter>
    )
}
