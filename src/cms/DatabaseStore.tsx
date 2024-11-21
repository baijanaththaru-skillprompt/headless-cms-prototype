// DatabaseStore.tsx
import React, { createContext, useReducer, useContext } from "react";
import { DatabaseState, initialState, Field, Table, Relation } from "./types";

// Action Types
type Action =
  | { type: "ADD_TABLE"; payload: Table }
  | { type: "ADD_FIELD"; tableId: string; payload: Field }
  | { type: "ADD_RELATION"; payload: Relation }
  | { type: "ADD_ENTRY"; tableId: string; payload: { [key: string]: any } }
  | {
      type: "UPDATE_ENTRY";
      tableId: string;
      payload: { id: string; data: { [key: string]: any } };
    }
  | { type: "DELETE_ENTRY"; tableId: string; payload: string };

const DatabaseContext = createContext<
  { state: DatabaseState; dispatch: React.Dispatch<Action> } | undefined
>(undefined);

export const useAppContext = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error("useAppContext must be used within a DatabaseProvider");
  }
  return context;
};

const databaseReducer = (
  state: DatabaseState,
  action: Action
): DatabaseState => {
  switch (action.type) {
    case "ADD_TABLE":
      return { ...state, tables: [...state.tables, action.payload] };

    case "ADD_FIELD": {
      const tableIndex = state.tables.findIndex(
        (table) => table.id === action.tableId
      );
      const updatedTable = {
        ...state.tables[tableIndex],
        fields: [...state.tables[tableIndex].fields, action.payload],
      };
      const updatedTables = [...state.tables];
      updatedTables[tableIndex] = updatedTable;
      return { ...state, tables: updatedTables };
    }

    case "ADD_RELATION":
      return { ...state, relations: [...state.relations, action.payload] };

    case "ADD_ENTRY": {
      const addTableIndex = state.tables.findIndex(
        (table) => table.id === action.tableId
      );
      const tableWithNewEntry = {
        ...state.tables[addTableIndex],
        entries: [...state.tables[addTableIndex].entries, action.payload],
      };
      const updatedTablesAddEntry = [...state.tables];
      updatedTablesAddEntry[addTableIndex] = tableWithNewEntry;
      return { ...state, tables: updatedTablesAddEntry };
    }

    case "UPDATE_ENTRY": {
      const updateTableIndex = state.tables.findIndex(
        (table) => table.id === action.tableId
      );
      const tableWithUpdatedEntry = {
        ...state.tables[updateTableIndex],
        entries: state.tables[updateTableIndex].entries.map((entry) =>
          entry.id === action.payload.id
            ? { ...entry, ...action.payload.data }
            : entry
        ),
      };
      const updatedTablesUpdateEntry = [...state.tables];
      updatedTablesUpdateEntry[updateTableIndex] = tableWithUpdatedEntry;
      return { ...state, tables: updatedTablesUpdateEntry };
    }

    case "DELETE_ENTRY": {
      const deleteTableIndex = state.tables.findIndex(
        (table) => table.id === action.tableId
      );
      const tableWithDeletedEntry = {
        ...state.tables[deleteTableIndex],
        entries: state.tables[deleteTableIndex].entries.filter(
          (entry) => entry.id !== action.payload
        ),
      };
      const updatedTablesDeleteEntry = [...state.tables];
      updatedTablesDeleteEntry[deleteTableIndex] = tableWithDeletedEntry;
      return { ...state, tables: updatedTablesDeleteEntry };
    }

    default:
      return state;
  }
};

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(databaseReducer, initialState);
  return (
    <DatabaseContext.Provider value={{ state, dispatch }}>
      {children}
    </DatabaseContext.Provider>
  );
};
