import React, { createContext, useContext, useReducer } from "react";

type FieldType = "string" | "number" | "boolean" | "date";

interface Field {
  name: string;
  type: FieldType;
}

type RelationType = "one-to-one" | "one-to-many";

interface Relationship {
  from: string;
  to: string;
  type: RelationType;
}

interface Table {
  name: string;
  fields: Field[];
}

interface AppState {
  tables: Table[];
  relationships: Relationship[];
  selectedTable: string | null;
  tableData: { [tableName: string]: any[] };
}

type Action =
  | { type: "ADD_TABLE"; payload: Table }
  | { type: "ADD_RELATIONSHIP"; payload: Relationship }
  | { type: "SELECT_TABLE"; payload: string }
  | { type: "ADD_DATA"; payload: { tableName: string; data: any } }
  | {
      type: "UPDATE_DATA";
      payload: { tableName: string; index: number; data: any };
    }
  | { type: "DELETE_DATA"; payload: { tableName: string; index: number } };

const initialState: AppState = {
  tables: [
    {
      name: "Category",
      fields: [
        { name: "id", type: "number" },
        { name: "name", type: "string" },
        { name: "description", type: "string" },
      ],
    },
    {
      name: "Product",
      fields: [
        { name: "id", type: "number" },
        { name: "name", type: "string" },
        { name: "description", type: "string" },
        { name: "price", type: "number" },
        { name: "categoryId", type: "number" },
      ],
    },
  ],
  relationships: [
    {
      from: "Category",
      to: "Product",
      type: "one-to-many",
    },
  ],
  selectedTable: null,
  tableData: {
    Category: [
      {
        id: 1,
        name: "Electronics",
        description: "Electronic devices and accessories",
      },
      { id: 2, name: "Books", description: "Physical and digital books" },
    ],
    Product: [
      {
        id: 1,
        name: "Smartphone",
        description: "Latest model smartphone",
        price: 699.99,
        categoryId: 1,
      },
      {
        id: 2,
        name: "Laptop",
        description: "High-performance laptop",
        price: 1299.99,
        categoryId: 1,
      },
      {
        id: 3,
        name: "Novel",
        description: "Bestselling fiction novel",
        price: 14.99,
        categoryId: 2,
      },
    ],
  },
};

const AppContext = createContext<
  | {
      state: AppState;
      dispatch: React.Dispatch<Action>;
    }
  | undefined
>(undefined);

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "ADD_TABLE":
      return { ...state, tables: [...state.tables, action.payload] };
    case "ADD_RELATIONSHIP":
      return {
        ...state,
        relationships: [...state.relationships, action.payload],
      };
    case "SELECT_TABLE":
      return { ...state, selectedTable: action.payload };
    case "ADD_DATA":
      return {
        ...state,
        tableData: {
          ...state.tableData,
          [action.payload.tableName]: [
            ...(state.tableData[action.payload.tableName] || []),
            action.payload.data,
          ],
        },
      };
    case "UPDATE_DATA":
      return {
        ...state,
        tableData: {
          ...state.tableData,
          [action.payload.tableName]: state.tableData[
            action.payload.tableName
          ].map((item, index) =>
            index === action.payload.index ? action.payload.data : item
          ),
        },
      };
    case "DELETE_DATA":
      return {
        ...state,
        tableData: {
          ...state.tableData,
          [action.payload.tableName]: state.tableData[
            action.payload.tableName
          ].filter((_, index) => index !== action.payload.index),
        },
      };
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
