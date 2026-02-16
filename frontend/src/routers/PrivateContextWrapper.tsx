import { AuthProvider } from "src/context/AuthContext/AuthProvider";
import { CRMCommonProvider } from "src/context/CRMCommonContext/CRMCommonProvider";
import { CRMTagProvider } from "src/context/CRMTagContext/CRMTagProvider";
import { CRMUsersProvider } from "src/context/CRMUsersContext/CRMUsersProvider";
import PrivateRoute from "./PrivateRoute";
import { Outlet } from "react-router-dom";


const PrivateContextWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <CRMCommonProvider>

            <CRMUsersProvider>
                <CRMTagProvider>
                     <>
                        {children}
                    </>
                </CRMTagProvider>
            </CRMUsersProvider>
        </CRMCommonProvider>
    );
};

export default PrivateContextWrapper;

export const CRMRouteWrapper = () => {

  return (
    <AuthProvider >
      <PrivateRoute>
        <PrivateContextWrapper>
          <Outlet />
        </PrivateContextWrapper>
      </PrivateRoute>
    </AuthProvider>
  );
};
