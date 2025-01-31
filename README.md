# Mini Projeto: Integração de TanStack Query e TanStack Table

Este projeto demonstra como integrar as bibliotecas **TanStack Query** para buscar dados de uma API ou banco de dados e **TanStack Table** para exibir, filtrar e ordenar esses dados em uma tabela interativa.

## Funcionalidades

- Busca de dados usando o **TanStack Query**.
- Exibição dos dados em uma tabela usando o **TanStack Table**.
- Recursos de filtragem e ordenação na tabela.

## Tecnologias Utilizadas

- **React**: Framework principal para construção da interface.
- **TanStack Query**: Gerenciamento de dados assíncronos (fetching e caching).
- **TanStack Table**: Criação de tabelas avançadas e interativas.

## Pré-requisitos

Certifique-se de ter o seguinte instalado:

- Node.js (v14 ou superior)
- npm ou yarn

## Configuração do Projeto

1. Clone o repositório:

   ```bash
   git clone https://github.com/Jay-Ubisse/tanstack-query-table.git
   cd tanstack-query-table
   ```

2. Instale as dependências:

   ```bash
   npm install
   # ou
   yarn install
   ```

3. Execute o projeto:

   ```bash
   npm run dev
   # ou
   yarn dev
   ```

4. Abra no navegador em `http://localhost:5173`.

## Estrutura de Arquivos

```plaintext
src/
├── components/table
│   ├── table-instance.jsx   # Componente principal da tabela (usando Tanstack table)
│   ├── index.jsx      # Componente para carregamento dos dados (usando Tanstack query)
├── providers/
│   ├── react-query.tsx # Hook para poder usar o react-query no projecto (usando no main.tsx)
├── App.jsx             # Componente principal
├── main.jsx            # Arquivo de entrada
├── index.css           # Estilos globais
```

## Como Funciona

### 1. Busca de Dados com TanStack Query

Usamos o hook `useQuery` do TanStack Query para buscar dados de uma API:

```javascript
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../services/users";
import { TableInstance } from "./table-instance";

export function TanstckTable() {
  const { isPending, error, data } = useQuery({
    queryKey: ["repoData"],
    queryFn: () => getUsers(),
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  if (!data || data.length === 0 || data.length < 0)
    return "No available data to display";

  return (
    <div>
      <TableInstance data={data} />
    </div>
  );
}
```

### 2. Configuração da Tabela com TanStack Table

Criamos as colunas e definimos os dados para exibição:

```javascript
import { useEffect, useMemo, useReducer, useState } from "react";
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  RowData,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { UserProps } from "../../types/users";

declare module "@tanstack/react-table" {
  //allows us to define custom properties for our columns
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "range" | "select";
  }
}

export function TableInstance({ data }: { data: UserProps[] }) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const rerender = useReducer(() => ({}), {})[1];

  const columns = useMemo<ColumnDef<UserProps, any>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: (info) => info.getValue(),
      },
      {
        accessorFn: (row) => row.name,
        id: "name",
        cell: (info) => info.getValue(),
        header: () => <span>Name</span>,
      },
      {
        accessorFn: (row) => row.email,
        id: "email",
        cell: (info) => info.getValue(),
        header: () => <span>Email</span>,
      },
      {
        accessorFn: (row) => row.phone,
        id: "phone",
        cell: (info) => info.getValue(),
        header: () => <span>Phone</span>,
      },
      {
        accessorFn: (row) => row.website,
        id: "website",
        cell: (info) => info.getValue(),
        header: () => <span>Website</span>,
      },
      {
        accessorKey: "username",
        header: "Username",
        meta: {
          filterVariant: "select",
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    filterFns: {},
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client side filtering
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  return (
    <div className="p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} />
                          </div>
                        ) : null}
                      </>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="h-2" />
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div>{table.getPrePaginationRowModel().rows.length} Rows</div>
      <div>
        <button onClick={() => rerender()}>Force Rerender</button>
      </div>
      <div>
        <button onClick={() => console.log("Add a function to refresh data")}>
          Refresh Data
        </button>
      </div>
      <pre>
        {JSON.stringify(
          { columnFilters: table.getState().columnFilters },
          null,
          2
        )}
      </pre>
    </div>
  );
}

function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta ?? {};

  return filterVariant === "range" ? (
    <div>
      <div className="flex space-x-2">
        {/* See faceted column filters example for min max values functionality */}
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min`}
          className="w-24 border shadow rounded"
        />
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max`}
          className="w-24 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : filterVariant === "select" ? (
    <select
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}
    >
      {/* See faceted column filters example for dynamic select options */}
      <option value="">All</option>
      <option value="Samantha">Samantha</option>
      <option value="Bret">Bret</option>
      <option value="Antonette">Antonette</option>
    </select>
  ) : (
    <DebouncedInput
      className="w-36 border shadow rounded"
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search...`}
      type="text"
      value={(columnFilterValue ?? "") as string}
    />
    // See faceted column filters example for datalist search suggestions
  );
}

// A typical debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

```

### 3. Integração no Componente Principal

```javascript
import { TanstckTable } from "./components/table";

function App() {
  return (
    <>
      <TanstckTable />
    </>
  );
}

export default App;
```

## Recursos Adicionais

- [TanStack Query Documentation](https://tanstack.com/query/latest/docs/framework/react/overview)
- [TanStack Table Documentation](https://tanstack.com/table/latest/docs/introduction)
- [Vite Documentation](https://vitejs.dev/)

---

[Link para visualização do projecto](https://tanstack-query-table.vercel.app/)
Desenvolvido com ❤️ por [Jay-Ubisse](https://github.com/Jay-Ubisse/).
