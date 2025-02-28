import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import MDDashboard from "./Components/MDDashboard";

import Home from "./Components/Home";
import Departments from "./Components/Departments";
import Employee from "./Components/Employee";
import Assets from "./Components/Assets";
import Attendance from "./Components/Attendance";
import AddDepartment from "./Components/AddDepartment";
import AddEmployee from "./Components/AddEmployee";
import EditEmployee from "./Components/EditEmployee";
import AddAsset from "./Components/AddAsset";
import EditAsset from "./Components/EditAsset";
import ViewEmployee from "./Components/ViewEmployee";
import AssetLog from "./Components/AssetLog";
import Tasks from "./Components/Tasks";

// ✅ New Components for View More Functionality
import ViewDepartmentEmployees from "./Components/ViewDepartmentEmployees";
import ViewInterns from "./Components/ViewInterns";
import ViewEmployeeDetails from "./Components/ViewEmployeeDetails";
import ViewInternDetails from "./Components/ViewInternDetails";

// ✅ MD Components
import Approvals from "./Components/Approvals";

// ✅ Accounts TL Components
import AccountsDashboard from "./Components/Accounts/Dashboard";
import AccountsExpenses from "./Components/Accounts/Expenses";
import AccountsSalaries from "./Components/Accounts/Salaries";
import AccountsVendorPayments from "./Components/Accounts/VendorPayments";
import AccountsAssetRequests from "./Components/Accounts/AssetRequests";

// ✅ Finance TL Components
import FinanceDashboard from "./Components/FinanceDashboard";
import FinanceExpenses from "./Components/Accounts/Expenses";
import FinanceSalaries from "./Components/Accounts/Salaries";
import FinanceVendorPayments from "./Components/Accounts/VendorPayments";
import FinanceAssetRequests from "./Components/Accounts/AssetRequests";

/// ✅ Procurement TL Components
import ProcurementDashboard from "./Components/Procurement/Dashboard";
import ProcurementAssetRequests from "./Components/Procurement/AssetRequests";
import ProcurementInventory from "./Components/Procurement/Inventory";
import ProcurementPurchaseOrders from "./Components/Procurement/PurchaseOrders";
import ProcurementVendorManagement from "./Components/Procurement/VendorManagement";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Default Home should redirect to Admin Login */}
        <Route path="/" element={<Login />} />
        <Route path="/adminlogin" element={<Login />} />

        {/* ✅ Admin Dashboard Section */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="departments" element={<Departments />} />
          <Route path="employee" element={<Employee />} />
          <Route path="assets" element={<Assets />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="assetlogs" element={<AssetLog />} />
          <Route path="add_department" element={<AddDepartment />} />
          <Route path="add_employee" element={<AddEmployee />} />
          <Route path="edit_employee/:id" element={<EditEmployee />} />
          <Route path="add_asset" element={<AddAsset />} />
          <Route path="edit_asset/:id" element={<EditAsset />} />
          <Route path="employee/:id" element={<ViewEmployee />} />
          <Route path="tasks" element={<Tasks />} />

          {/* ✅ New Routes for View More Functionality */}
          <Route path="view_department/:id" element={<ViewDepartmentEmployees />} />
          <Route path="view_interns" element={<ViewInterns />} />
          <Route path="view_employee/:id" element={<ViewEmployeeDetails />} />
          <Route path="view_intern/:id" element={<ViewInternDetails />} />
        </Route>

        {/* ✅ MD Dashboard Section */}
        <Route path="/md-dashboard" element={<MDDashboard />}>
          <Route index element={<Home />} />
          <Route path="departments" element={<Departments />} />
          <Route path="employees" element={<Employee />} />
          <Route path="assets" element={<Assets />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="assetlogs" element={<AssetLog />} />
          <Route path="approvals" element={<Approvals />} />
        </Route>

        {/* ✅ Accounts TL Dashboard Section */}
        <Route path="/accounts-dashboard" element={<AccountsDashboard />}>
          <Route index element={<Home />} />
          <Route path="expenses" element={<AccountsExpenses />} />
          <Route path="salaries" element={<AccountsSalaries />} />
          <Route path="vendor-payments" element={<AccountsVendorPayments />} />
          <Route path="asset-requests" element={<AccountsAssetRequests />} />
        </Route>

        {/* ✅ Finance TL Dashboard Section */}
        <Route path="/finance-dashboard" element={<FinanceDashboard />}>
          <Route index element={<Home />} />
          <Route path="expenses" element={<FinanceExpenses />} />
          <Route path="salaries" element={<FinanceSalaries />} />
          <Route path="vendor-payments" element={<FinanceVendorPayments />} />
          <Route path="asset-requests" element={<FinanceAssetRequests />} />
        </Route>

        {/* ✅ Procurement TL Dashboard Section */}
        <Route path="/procurement-dashboard" element={<ProcurementDashboard />}>
          <Route index element={<Home />} />
          <Route path="asset-requests" element={<ProcurementAssetRequests />} />
          <Route path="inventory" element={<ProcurementInventory />} />
          <Route path="purchase-orders" element={<ProcurementPurchaseOrders />} />
          <Route path="vendor-management" element={<ProcurementVendorManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
