import CRUDPage from "./CRUDPage";
import { CrudProvider } from "./CRUDStore";
import DatabasePage from "./DatabasePage";
import { DatabaseProvider } from "./DatabaseStore";

export function CMSPage() {
  return (
    <DatabaseProvider>
      <CrudProvider>
        <div className="flex">
          <div className="my-4">
            <h2 className="text-xl font-bold p-2">Database Configuration</h2>
            <DatabasePage />
          </div>
          <hr className="my-4 border h-1 border-gray-200" />

          <div className="my-4 flex-1">
            <h2 className="text-xl font-bold p-2">Crud Operations</h2>

            <CRUDPage />
          </div>
        </div>
      </CrudProvider>
    </DatabaseProvider>
  );
}
