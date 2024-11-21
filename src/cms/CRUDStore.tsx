// CRUDStore.tsx
import React, { createContext, useContext, useReducer, Dispatch } from "react";

interface Entry {
  id: string;
  [key: string]: any; // Fields can have dynamic keys and values
}

interface CrudState {
  entries: Entry[];
}

type CrudAction =
  | { type: "CREATE_ENTRY"; payload: Entry }
  | { type: "UPDATE_ENTRY"; payload: Entry }
  | { type: "DELETE_ENTRY"; payload: string }
  | { type: "SET_ENTRIES"; payload: Entry[] };

const initialState: CrudState = {
  entries: [],
};

const CrudContext = createContext<
  { state: CrudState; dispatch: Dispatch<CrudAction> } | undefined
>(undefined);

function crudReducer(state: CrudState, action: CrudAction): CrudState {
  switch (action.type) {
    case "CREATE_ENTRY":
      return { ...state, entries: [...state.entries, action.payload] };
    case "UPDATE_ENTRY":
      return {
        ...state,
        entries: state.entries.map((entry) =>
          entry.id === action.payload.id ? action.payload : entry
        ),
      };
    case "DELETE_ENTRY":
      return {
        ...state,
        entries: state.entries.filter((entry) => entry.id !== action.payload),
      };
    case "SET_ENTRIES":
      return { ...state, entries: action.payload };
    default:
      return state;
  }
}

export const CrudProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(crudReducer, initialState);
  return (
    <CrudContext.Provider value={{ state, dispatch }}>
      {children}
    </CrudContext.Provider>
  );
};

export function useCrudContext() {
  const context = useContext(CrudContext);
  if (!context) {
    throw new Error("useCrudContext must be used within a CrudProvider");
  }
  return context;
}

// Action creators
export function createEntry(dispatch: Dispatch<CrudAction>, entry: Entry) {
  dispatch({ type: "CREATE_ENTRY", payload: entry });
}

export function updateEntry(dispatch: Dispatch<CrudAction>, entry: Entry) {
  dispatch({ type: "UPDATE_ENTRY", payload: entry });
}

export function deleteEntry(dispatch: Dispatch<CrudAction>, id: string) {
  dispatch({ type: "DELETE_ENTRY", payload: id });
}

export function setEntries(dispatch: Dispatch<CrudAction>, entries: Entry[]) {
  dispatch({ type: "SET_ENTRIES", payload: entries });
}
