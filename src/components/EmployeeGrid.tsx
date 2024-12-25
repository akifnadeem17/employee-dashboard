import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Employee } from "@/types";

interface EmployeeGridProps {
  employees: Employee[];
  onEdit: (employee: Employee) => Promise<void>;
  onFlag: (employee: Employee) => Promise<void>;
  onDelete: (employee: Employee) => Promise<void>;
  loadingState: {
    type: "edit" | "flag" | "delete";
    employeeId: string;
  } | null;
}

export function EmployeeGrid({ employees, onEdit, onFlag, onDelete, loadingState }: EmployeeGridProps) {
  const isActionLoading = (employee: Employee, action: "edit" | "flag" | "delete") => {
    return loadingState?.employeeId === employee.login.uuid && loadingState?.type === action;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {employees.map((employee) => (
        <Card key={employee.login.uuid} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              <img src={employee.picture.large} alt={`${employee.name.first} ${employee.name.last}`} className="w-full h-48 object-cover" />
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0" disabled={loadingState?.employeeId === employee.login.uuid}>
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
                    <DropdownMenuItem onClick={() => onDelete(employee)} className="text-destructive" disabled={isActionLoading(employee, "delete")}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{`${employee.name.first} ${employee.name.last}`}</h3>
              <p className="text-sm text-gray-500 mb-1">{employee.email}</p>
              <p className="text-sm text-gray-500">{`${employee.location.city}, ${employee.location.country}`}</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full mt-4">View Details</Button>
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
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
