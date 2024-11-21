import React from "react";
import { AppProvider } from "./AppContext";
import TableDesigner from "./components/TableDesigner";
import TableViewer from "./components/TableViewer";
import DataManager from "./components/DataManager";
import HotelManagementSystem from "./examples/HotelManagementSystem";
import HospitalManagementSystem from "./examples/HospitalManagementSystem";

const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Database Designer</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <TableDesigner />
          <TableViewer />
        </div>
        <DataManager />

        <h2 className="text-2xl font-bold mt-12 mb-4">Example Applications</h2>
        <div className="space-y-8">
          <HotelManagementSystem />
          <HospitalManagementSystem />
        </div>
      </div>
    </AppProvider>
  );
};

export default App;
