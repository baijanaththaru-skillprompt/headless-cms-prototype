import React, { useState } from "react";
import { useAppContext } from "../AppContext";

const TableDesigner: React.FC = () => {
  const { dispatch } = useAppContext();
  const [tableName, setTableName] = useState("");
  const [fields, setFields] = useState<{ name: string; type: string }[]>([]);
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState("string");

  const addField = () => {
    if (fieldName && fieldType) {
      setFields([...fields, { name: fieldName, type: fieldType }]);
      setFieldName("");
      setFieldType("string");
    }
  };

  const createTable = () => {
    if (tableName && fields.length > 0) {
      dispatch({
        type: "ADD_TABLE",
        payload: { name: tableName, fields },
      });
      setTableName("");
      setFields([]);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create Table</h2>
      <input
        type="text"
        placeholder="Table Name"
        value={tableName}
        onChange={(e) => setTableName(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      />
      <div className="mb-4">
        <input
          type="text"
          placeholder="Field Name"
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
        />
        <select
          value={fieldType}
          onChange={(e) => setFieldType(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
        >
          <option value="string">String</option>
          <option value="number">Number</option>
          <option value="boolean">Boolean</option>
          <option value="date">Date</option>
        </select>
        <button
          onClick={addField}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Field
        </button>
      </div>
      <ul className="mb-4">
        {fields.map((field, index) => (
          <li key={index} className="mb-1">
            {field.name} ({field.type})
          </li>
        ))}
      </ul>
      <button
        onClick={createTable}
        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
      >
        Create Table
      </button>
    </div>
  );
};

export default TableDesigner;
