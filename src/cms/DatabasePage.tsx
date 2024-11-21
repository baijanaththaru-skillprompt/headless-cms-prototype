import React, { useState } from "react";
import { useAppContext } from "./DatabaseStore";
import { Field, Table, Relation } from "./types";

const DatabasePage: React.FC = () => {
  const { state: databaseState, dispatch } = useAppContext();

  // State for managing form data
  const [tableName, setTableName] = useState<string>("");
  const [fieldName, setFieldName] = useState<string>("");
  const [fieldType, setFieldType] = useState<"string" | "number" | "boolean">(
    "string"
  );
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [relationshipType, setRelationshipType] = useState<
    "ONE_TO_ONE" | "ONE_TO_MANY" | "MANY_TO_MANY" | ""
  >("");
  const [relatedTableId, setRelatedTableId] = useState<string | null>(null);

  // Create a new table
  const handleCreateTable = () => {
    if (tableName) {
      const newTable: Table = {
        id: Date.now().toString(),
        name: tableName,
        fields: [],
        entries: [],
      };
      dispatch({ type: "ADD_TABLE", payload: newTable });
      setTableName("");
    }
  };

  // Add a new field to a table
  const handleAddField = () => {
    if (fieldName && selectedTableId) {
      const newField: Field = {
        id: Date.now().toString(),
        name: fieldName,
        type: fieldType,
      };
      dispatch({
        type: "ADD_FIELD",
        tableId: selectedTableId,
        payload: newField,
      });
      setFieldName("");
    }
  };

  // Create a relationship between tables
  const handleCreateRelation = () => {
    if (selectedTableId && relatedTableId && relationshipType) {
      const newRelation: Relation = {
        id: Date.now().toString(),
        fromTableId: selectedTableId,
        toTableId: relatedTableId,
        type: relationshipType,
      };
      dispatch({ type: "ADD_RELATION", payload: newRelation });
      setRelationshipType("");
      setRelatedTableId(null);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">
      <h2 className="text-2xl font-semibold mb-4">Database Management</h2>

      {/* Table Creation */}
      <div className="bg-white p-4 mb-6 shadow rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Create Table</h3>
        <input
          type="text"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          placeholder="Table Name"
          className="w-full p-2 border border-gray-300 rounded mb-2"
        />
        <button
          onClick={handleCreateTable}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Create Table
        </button>
      </div>

      {/* Fields Creation */}

      <div className="bg-white p-4 mb-6 shadow rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Add Fields to Table</h3>
        <select
          value={selectedTableId}
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

        <input
          type="text"
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          placeholder="Field Name"
          className="w-full p-2 border border-gray-300 rounded mb-2"
        />

        <select
          value={fieldType}
          onChange={(e) =>
            setFieldType(e.target.value as "string" | "number" | "boolean")
          }
          className="w-full p-2 border border-gray-300 rounded mb-2"
        >
          <option value="string">String</option>
          <option value="number">Number</option>
          <option value="boolean">Boolean</option>
        </select>

        <button
          onClick={handleAddField}
          className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Add Field
        </button>
      </div>

      {/* Relationship Creation */}
      {databaseState.tables.length > 1 && (
        <div className="bg-white p-4 mb-6 shadow rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Create Relationship</h3>
          <select
            value={relationshipType}
            onChange={(e) =>
              setRelationshipType(
                e.target.value as "ONE_TO_ONE" | "ONE_TO_MANY" | "MANY_TO_MANY"
              )
            }
            className="w-full p-2 border border-gray-300 rounded mb-2"
          >
            <option value="">Select Relationship Type</option>
            <option value="ONE_TO_ONE">One-to-One</option>
            <option value="ONE_TO_MANY">One-to-Many</option>
            <option value="MANY_TO_MANY">Many-to-Many</option>
          </select>

          <select
            value={relatedTableId || ""}
            onChange={(e) => setRelatedTableId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2"
          >
            <option value="">Select Related Table</option>
            {databaseState.tables
              .filter((table) => table.id !== selectedTableId)
              .map((table) => (
                <option key={table.id} value={table.id}>
                  {table.name}
                </option>
              ))}
          </select>

          <button
            onClick={handleCreateRelation}
            className="w-full p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
          >
            Create Relationship
          </button>
        </div>
      )}

      {/* Tables List */}
      <div className="bg-white p-4 shadow rounded-lg">
        <h3 className="text-lg font-semibold mb-2">All Tables</h3>
        {databaseState.tables.length === 0 ? (
          <p>No tables created yet.</p>
        ) : (
          <ul>
            {databaseState.tables.map((table) => (
              <li key={table.id} className="mb-4">
                <div className="font-semibold text-lg">{table.name}</div>
                <div>
                  <strong>Fields:</strong>{" "}
                  {table.fields.length > 0
                    ? table.fields.map((field) => field.name).join(", ")
                    : "No fields"}
                </div>
                <div>
                  <strong>Relations:</strong>
                  {databaseState.relations
                    .filter(
                      (relation) =>
                        relation.fromTableId === table.id ||
                        relation.toTableId === table.id
                    )
                    .map((relation) => (
                      <div key={relation.id} className="text-sm text-gray-600">
                        {relation.type} with{" "}
                        {
                          databaseState.tables.find(
                            (relatedTable) =>
                              relatedTable.id ===
                              (relation.fromTableId === table.id
                                ? relation.toTableId
                                : relation.fromTableId)
                          )?.name
                        }
                      </div>
                    ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DatabasePage;
