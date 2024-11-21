// CRUDPage.tsx
import React, { useState, useEffect } from "react";
import { useAppContext } from "./DatabaseStore";
import {
  useCrudContext,
  setEntries,
  createEntry,
  updateEntry,
  deleteEntry,
} from "./CRUDStore";

// Define form data
interface FormData {
  [key: string]: any;
}

const CRUDPage: React.FC = () => {
  const { state: databaseState } = useAppContext();
  const { state: crudState, dispatch: crudDispatch } = useCrudContext();
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  // When table is selected, load the data
  useEffect(() => {
    if (selectedTableId) {
      const table = databaseState.tables.find((t) => t.id === selectedTableId);
      if (table) {
        setEntries(crudDispatch, table.entries);
        setFormData({});
      }
    }
  }, [selectedTableId, databaseState.tables, crudDispatch]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const parsedValue = type === "number" ? parseInt(value) : value;
    setFormData((prevData) => ({ ...prevData, [name]: parsedValue }));
  };

  const handleSave = () => {
    if (selectedTableId) {
      const newEntry = editingId
        ? { id: editingId, ...formData }
        : { id: Date.now().toString(), ...formData };
      if (editingId) {
        updateEntry(crudDispatch, newEntry);
        setEditingId(null);
      } else {
        createEntry(crudDispatch, newEntry);
      }
      setFormData({});
    }
  };

  const handleEdit = (entry: FormData) => {
    setFormData(entry);
    setEditingId(entry.id);
  };

  const handleDelete = (id: string) => {
    deleteEntry(crudDispatch, id);
  };

  const selectedTable = databaseState.tables.find(
    (table) => table.id === selectedTableId
  );

  const getRelatedEntries = (relatedTableId: string) => {
    return (
      databaseState.tables.find((table) => table.id === relatedTableId)
        ?.entries || []
    );
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">
      <h2 className="text-2xl font-semibold mb-4">Manage Entries in Tables</h2>

      {/* Table Selection */}
      <div className="bg-white p-4 mb-6 shadow rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Select Table</h3>
        <select
          value={selectedTableId || ""}
          onChange={(e) => setSelectedTableId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2"
        >
          <option value="">Select Table</option>
          {databaseState.tables.map((table) => (
            <option key={table.id} value={table.id}>
              {table.name}
            </option>
          ))}
        </select>
      </div>

      {/* Entry Form */}
      {selectedTable && (
        <div className="bg-white p-4 mb-6 shadow rounded-lg">
          <h3 className="text-lg font-semibold mb-2">
            {editingId ? "Edit Entry" : "Add New Entry"}
          </h3>
          {selectedTable.fields.map((field) => (
            <div key={field.id} className="mb-2">
              <input
                name={field.name}
                type={field.type === "number" ? "number" : "text"}
                placeholder={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          ))}
          <button
            onClick={handleSave}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            {editingId ? "Update Entry" : "Add Entry"}
          </button>
        </div>
      )}

      {/* Entries List */}
      {selectedTable && (
        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Entries</h3>
          {crudState.entries.length > 0 ? (
            <ul>
              {crudState.entries.map((entry) => (
                <li key={entry.id} className="mb-2">
                  {selectedTable.fields.map((field) => (
                    <span key={field.id} className="mr-4">
                      {field.name}: {entry[field.name]}
                    </span>
                  ))}
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={() => handleEdit(entry)}
                      className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500">No entries available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CRUDPage;
