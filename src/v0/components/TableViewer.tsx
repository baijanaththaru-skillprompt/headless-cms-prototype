import React, { useState } from "react";
import { useAppContext } from "../AppContext";

const TableViewer: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [fromTable, setFromTable] = useState("");
  const [toTable, setToTable] = useState("");
  const [relationType, setRelationType] = useState<
    "one-to-one" | "one-to-many"
  >("one-to-one");

  const addRelationship = () => {
    if (fromTable && toTable) {
      dispatch({
        type: "ADD_RELATIONSHIP",
        payload: { from: fromTable, to: toTable, type: relationType },
      });
      setFromTable("");
      setToTable("");
      setRelationType("one-to-one");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Tables and Relationships</h2>
      <div className="mb-4">
        <h3 className="font-bold mb-2">Tables</h3>
        <ul>
          {state.tables.map((table, index) => (
            <li key={index} className="mb-2">
              <strong>{table.name}</strong>
              <ul className="ml-4">
                {table.fields.map((field, fieldIndex) => (
                  <li key={fieldIndex}>
                    {field.name}: {field.type}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <h3 className="font-bold mb-2">Relationships</h3>
        <ul>
          {state.relationships.map((rel, index) => (
            <li key={index}>
              {rel.from} → {rel.to} ({rel.type})
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-bold mb-2">Add Relationship</h3>
        <select
          value={fromTable}
          onChange={(e) => setFromTable(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
        >
          <option value="">Select From Table</option>
          {state.tables.map((table, index) => (
            <option key={index} value={table.name}>
              {table.name}
            </option>
          ))}
        </select>
        <select
          value={toTable}
          onChange={(e) => setToTable(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
        >
          <option value="">Select To Table</option>
          {state.tables.map((table, index) => (
            <option key={index} value={table.name}>
              {table.name}
            </option>
          ))}
        </select>
        <select
          value={relationType}
          onChange={(e) =>
            setRelationType(e.target.value as "one-to-one" | "one-to-many")
          }
          className="w-full p-2 mb-2 border rounded"
        >
          <option value="one-to-one">One-to-One</option>
          <option value="one-to-many">One-to-Many</option>
        </select>
        <button
          onClick={addRelationship}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Relationship
        </button>
      </div>
    </div>
  );
};

export default TableViewer;
