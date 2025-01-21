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
