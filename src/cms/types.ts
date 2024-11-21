export interface Field {
  id: string;
  name: string;
  type: "string" | "number" | "boolean";
}

export interface Table {
  id: string;
  name: string;
  fields: Field[];
  entries: { [key: string]: any }[]; // Each entry is a dictionary of field values
}

export interface Relation {
  id: string;
  fromTableId: string; // Table ID where the relation starts
  toTableId: string; // Table ID where the relation points
  type: "ONE_TO_ONE" | "ONE_TO_MANY" | "MANY_TO_MANY"; // Relationship type
}

export interface DatabaseState {
  tables: Table[];
  relations: Relation[];
}

export const initialState: DatabaseState = {
  tables: [],
  relations: [],
};
