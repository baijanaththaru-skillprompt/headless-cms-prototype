import React, { useState } from "react";
import { useAppContext } from "../AppContext";

const DataManager: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [selectedTable, setSelectedTable] = useState("");
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleTableSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTable(e.target.value);
    setFormData({});
    setEditIndex(null);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editIndex !== null) {
      dispatch({
        type: "UPDATE_DATA",
        payload: { tableName: selectedTable, index: editIndex, data: formData },
      });
      setEditIndex(null);
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
    setEditIndex(index);
  };

  const handleDelete = (index: number) => {
    dispatch({
      type: "DELETE_DATA",
      payload: { tableName: selectedTable, index },
    });
  };

  const selectedTableFields =
    state.tables.find((t) => t.name === selectedTable)?.fields || [];

  return (
    <div className="mt-8 bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Data Manager</h2>
      <select
        value={selectedTable}
        onChange={handleTableSelect}
        className="w-full p-2 mb-4 border rounded"
      >
        <option value="">Select a table</option>
        {state.tables.map((table, index) => (
          <option key={index} value={table.name}>
            {table.name}
          </option>
        ))}
      </select>
      {selectedTable && (
        <form onSubmit={handleSubmit} className="mb-4">
          {selectedTableFields.map((field, index) => (
            <div key={index} className="mb-2">
              <label className="block mb-1">{field.name}</label>
              <input
                type={field.type === "date" ? "date" : "text"}
                value={formData[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            {editIndex !== null ? "Update" : "Add"} Entry
          </button>
        </form>
      )}
      {selectedTable && state.tableData[selectedTable] && (
        <div>
          <h3 className="font-bold mb-2">Table Data</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {selectedTableFields.map((field, index) => (
                  <th key={index} className="border p-2">
                    {field.name}
                  </th>
                ))}
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.tableData[selectedTable].map((entry, index) => (
                <tr key={index}>
                  {selectedTableFields.map((field, fieldIndex) => (
                    <td key={fieldIndex} className="border p-2">
                      {entry[field.name]}
                    </td>
                  ))}
                  <td className="border p-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
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

export default DataManager;
