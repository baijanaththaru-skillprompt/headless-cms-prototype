import React, { useState } from "react";
import { useAppContext } from "../AppContext";

const HospitalManagementSystem: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  React.useEffect(() => {
    // Create tables
    dispatch({
      type: "ADD_TABLE",
      payload: {
        name: "Patient",
        fields: [
          { name: "id", type: "number" },
          { name: "name", type: "string" },
          { name: "dateOfBirth", type: "date" },
          { name: "gender", type: "string" },
          { name: "contactNumber", type: "string" },
        ],
      },
    });

    dispatch({
      type: "ADD_TABLE",
      payload: {
        name: "Doctor",
        fields: [
          { name: "id", type: "number" },
          { name: "name", type: "string" },
          { name: "specialization", type: "string" },
          { name: "contactNumber", type: "string" },
        ],
      },
    });

    dispatch({
      type: "ADD_TABLE",
      payload: {
        name: "Appointment",
        fields: [
          { name: "id", type: "number" },
          { name: "patientId", type: "number" },
          { name: "doctorId", type: "number" },
          { name: "dateTime", type: "date" },
          { name: "reason", type: "string" },
        ],
      },
    });

    // Create relationships
    dispatch({
      type: "ADD_RELATIONSHIP",
      payload: { from: "Patient", to: "Appointment", type: "one-to-many" },
    });

    dispatch({
      type: "ADD_RELATIONSHIP",
      payload: { from: "Doctor", to: "Appointment", type: "one-to-many" },
    });

    // Add sample data
    dispatch({
      type: "ADD_DATA",
      payload: {
        tableName: "Patient",
        data: {
          id: 1,
          name: "Alice Johnson",
          dateOfBirth: "1990-05-15",
          gender: "Female",
          contactNumber: "123-456-7890",
        },
      },
    });

    dispatch({
      type: "ADD_DATA",
      payload: {
        tableName: "Doctor",
        data: {
          id: 1,
          name: "Dr. Smith",
          specialization: "Cardiology",
          contactNumber: "987-654-3210",
        },
      },
    });

    dispatch({
      type: "ADD_DATA",
      payload: {
        tableName: "Appointment",
        data: {
          id: 1,
          patientId: 1,
          doctorId: 1,
          dateTime: "2023-05-10T10:00:00",
          reason: "Annual checkup",
        },
      },
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIndex !== null) {
      dispatch({
        type: "UPDATE_DATA",
        payload: {
          tableName: selectedTable,
          index: editingIndex,
          data: formData,
        },
      });
      setEditingIndex(null);
    } else {
      dispatch({
        type: "ADD_DATA",
        payload: { tableName: selectedTable, data: formData },
      });
    }
    setFormData({});
  };

  const handleEdit = (index: number) => {
    setFormData(state.tableData[selectedTable][index]);
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    dispatch({
      type: "DELETE_DATA",
      payload: { tableName: selectedTable, index },
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Hospital Management System</h3>
      <p className="mb-4">
        This example demonstrates how to use the database designer to create a
        simple hospital management system.
      </p>
      <div className="space-y-4 mb-4">
        <div>
          <h4 className="font-semibold">Tables:</h4>
          <ul className="list-disc list-inside">
            <li>Patient (id, name, dateOfBirth, gender, contactNumber)</li>
            <li>Doctor (id, name, specialization, contactNumber)</li>
            <li>Appointment (id, patientId, doctorId, dateTime, reason)</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Relationships:</h4>
          <ul className="list-disc list-inside">
            <li>Patient to Appointment (one-to-many)</li>
            <li>Doctor to Appointment (one-to-many)</li>
          </ul>
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="tableSelect" className="block font-semibold mb-2">
          Select a table:
        </label>
        <select
          id="tableSelect"
          className="w-full p-2 border rounded"
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
        >
          <option value="">Select a table</option>
          <option value="Patient">Patient</option>
          <option value="Doctor">Doctor</option>
          <option value="Appointment">Appointment</option>
        </select>
      </div>
      {selectedTable && (
        <div>
          <h4 className="font-semibold mb-2">Add/Edit {selectedTable}</h4>
          <form onSubmit={handleSubmit} className="space-y-2 mb-4">
            {state.tables
              .find((table) => table.name === selectedTable)
              ?.fields.map((field) => (
                <div key={field.name}>
                  <label htmlFor={field.name} className="block">
                    {field.name}:
                  </label>
                  <input
                    type={field.type === "number" ? "number" : "text"}
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              ))}
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {editingIndex !== null ? "Update" : "Add"}
            </button>
          </form>
          <h4 className="font-semibold mb-2">{selectedTable} Data</h4>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {state.tables
                  .find((table) => table.name === selectedTable)
                  ?.fields.map((field) => (
                    <th key={field.name} className="border p-2">
                      {field.name}
                    </th>
                  ))}
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.tableData[selectedTable]?.map((row, index) => (
                <tr key={index}>
                  {state.tables
                    .find((table) => table.name === selectedTable)
                    ?.fields.map((field) => (
                      <td key={field.name} className="border p-2">
                        {row[field.name]}
                      </td>
                    ))}
                  <td className="border p-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HospitalManagementSystem;
