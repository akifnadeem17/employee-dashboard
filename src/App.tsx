import { useState, useEffect } from "react";
import { Layout } from "./components/Layout";
import { EmployeeTable } from "./components/EmployeeTable";
import { EmployeeGrid } from "./components/EmployeeGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ViewIcon, GridIcon, Loader2 } from "lucide-react";
import { Employee, SortField, SortOrder, ViewMode } from "./types";
import { toast } from "sonner";
import { Toaster } from "sonner";

type LoadingState = {
  type: "edit" | "flag" | "delete";
  employeeId: string;
} | null;

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [totalResults, setTotalResults] = useState(0);
  const [loadingState, setLoadingState] = useState<LoadingState>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchEmployees(currentPage);
  }, [currentPage]);

  const fetchEmployees = async (pageNum: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://randomuser.me/api/?page=${pageNum}&results=50&seed=abc`);
      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }
      const data = await response.json();
      setEmployees(data.results);
      setTotalResults(1000); // Using 1000 as max results
      setCurrentPage(pageNum);
    } catch (err) {
      setError("An error occurred while fetching employees. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    if (sortField === "name") {
      return sortOrder === "asc" ? a.name.last.localeCompare(b.name.last) : b.name.last.localeCompare(a.name.last);
    } else if (sortField === "email") {
      return sortOrder === "asc" ? a.email.localeCompare(b.email) : b.email.localeCompare(a.email);
    } else if (sortField === "age") {
      return sortOrder === "asc" ? a.dob.age - b.dob.age : b.dob.age - a.dob.age;
    }
    return 0;
  });

  const filteredEmployees = sortedEmployees.filter(
    (employee) =>
      `${employee.name.first} ${employee.name.last}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleEdit = async (employee: Employee) => {
    setLoadingState({ type: "edit", employeeId: employee.login.uuid });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(`Edited employee: ${employee.name.first} ${employee.name.last}`);
    } catch (error) {
      setError("Failed to edit employee");
      toast.error("Failed to edit employee");
    } finally {
      setLoadingState(null);
    }
  };

  const handleFlag = async (employee: Employee) => {
    setLoadingState({ type: "flag", employeeId: employee.login.uuid });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(`Flagged employee: ${employee.name.first} ${employee.name.last}`);
    } catch (error) {
      setError("Failed to flag employee");
      toast.error("Failed to flag employee");
    } finally {
      setLoadingState(null);
    }
  };

  const handleDelete = async (employee: Employee) => {
    setLoadingState({ type: "delete", employeeId: employee.login.uuid });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setEmployees(employees.filter((e) => e.login.uuid !== employee.login.uuid));
      toast.success(`Deleted employee: ${employee.name.first} ${employee.name.last}`);
    } catch (error) {
      setError("Failed to delete employee");
      toast.error("Failed to delete employee");
    } finally {
      setLoadingState(null);
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(totalResults / itemsPerPage)));
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center text-red-500">{error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Toaster />
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Employee Dashboard</h1>
          <Button onClick={() => setViewMode(viewMode === "grid" ? "tiles" : "grid")} variant="outline">
            {viewMode === "grid" ? <ViewIcon className="mr-2 h-4 w-4" /> : <GridIcon className="mr-2 h-4 w-4" />}
            {viewMode === "grid" ? "Tile View" : "Grid View"}
          </Button>
        </div>
        <Input placeholder="Search employees..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" />
        {viewMode === "grid" ? (
          <EmployeeGrid employees={filteredEmployees} onEdit={handleEdit} onFlag={handleFlag} onDelete={handleDelete} loadingState={loadingState} />
        ) : (
          <EmployeeTable
            employees={filteredEmployees}
            sortField={sortField}
            onSort={handleSort}
            onEdit={handleEdit}
            onFlag={handleFlag}
            onDelete={handleDelete}
            loadingState={loadingState}
          />
        )}
        <div className="flex justify-between items-center">
          <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </Button>
          <span>
            Page {currentPage} of {Math.ceil(totalResults / itemsPerPage)}
          </span>
          <Button onClick={handleNextPage} disabled={currentPage >= Math.ceil(totalResults / itemsPerPage)}>
            Next
          </Button>
        </div>
      </div>
    </Layout>
  );
}
