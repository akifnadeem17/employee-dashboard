import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Loader2, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Employee } from "@/types";

type SortField = "name" | "email" | "age";

interface EmployeeTableProps {
  employees: Employee[];
  sortField: SortField;
  onSort: (field: SortField) => void;
  onEdit: (employee: Employee) => Promise<void>;
  onFlag: (employee: Employee) => Promise<void>;
  onDelete: (employee: Employee) => Promise<void>;
  loadingState: {
    type: "edit" | "flag" | "delete";
    employeeId: string;
  } | null;
}

export function EmployeeTable({ employees, sortField, onSort, onEdit, onFlag, onDelete, loadingState }: EmployeeTableProps) {
  const isActionLoading = (employee: Employee, action: "edit" | "flag" | "delete") => {
    return loadingState?.employeeId === employee.login.uuid && loadingState?.type === action;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button variant="ghost" onClick={() => onSort("name")}>
                Name
                {sortField === "name" && <ArrowUpDown className="ml-2 h-4 w-4" />}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => onSort("email")}>
                Email
                {sortField === "email" && <ArrowUpDown className="ml-2 h-4 w-4" />}
              </Button>
            </TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => onSort("age")}>
                Age
                {sortField === "age" && <ArrowUpDown className="ml-2 h-4 w-4" />}
              </Button>
            </TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Nationality</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.login.uuid}>
              <TableCell>{`${employee.name.first} ${employee.name.last}`}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.phone}</TableCell>
              <TableCell>{`${employee.location.city}, ${employee.location.country}`}</TableCell>
              <TableCell>{employee.dob.age}</TableCell>
              <TableCell>{employee.gender}</TableCell>
              <TableCell>{employee.nat}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>{`${employee.name.first} ${employee.name.last}`}</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <img
                          src={employee.picture.large}
                          alt={`${employee.name.first} ${employee.name.last}`}
                          className="w-32 h-32 rounded-full mx-auto"
                        />
                        <div className="grid grid-cols-4 items-center gap-4">
                          <span className="font-semibold">Email:</span>
                          <span className="col-span-3">{employee.email}</span>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <span className="font-semibold">Phone:</span>
                          <span className="col-span-3">{employee.phone}</span>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <span className="font-semibold">Location:</span>
                          <span className="col-span-3">{`${employee.location.city}, ${employee.location.country}`}</span>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <span className="font-semibold">Age:</span>
                          <span className="col-span-3">{employee.dob.age}</span>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <span className="font-semibold">Gender:</span>
                          <span className="col-span-3">{employee.gender}</span>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <span className="font-semibold">Nationality:</span>
                          <span className="col-span-3">{employee.nat}</span>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={loadingState?.employeeId === employee.login.uuid}>
                        {loadingState?.employeeId === employee.login.uuid ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <MoreHorizontal className="h-4 w-4" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(employee)} disabled={isActionLoading(employee, "edit")}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onFlag(employee)} disabled={isActionLoading(employee, "flag")}>
                        Flag
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(employee)}
                        className="text-destructive"
                        disabled={isActionLoading(employee, "delete")}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
