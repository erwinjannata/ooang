// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { SavingsRow } from "@/types/savings";
// import { ColumnDef } from "@tanstack/react-table";
// import { Captions, CaptionsOff, MoreHorizontal, PenLine } from "lucide-react";

// // type Props = {
// //   handleEdit: (selected: SavingsUpdate) => void;
// //   handleDisable: (selected: SavingsRow) => Promise<void>;
// // };

// export function getDebtsColumns(): ColumnDef<SavingsRow>[] {
//   return [
//     {
//       id: "actions",
//       enableHiding: false,
//       cell: ({ row }) => {
//         const saving = row.original;
//         return (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="h-8 w-8 p-0">
//                 <span className="sr-only">Open menu</span>
//                 <MoreHorizontal />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel className="capitalize">
//                 {saving.name}
//               </DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem onClick={() => handleEdit(saving)}>
//                 <PenLine />
//                 Edit
//               </DropdownMenuItem>
//               <DropdownMenuItem
//                 variant={saving.is_active ? "destructive" : "default"}
//                 onClick={() => handleDisable(saving)}
//               >
//                 {saving.is_active ? <CaptionsOff /> : <Captions />}
//                 {saving.is_active ? "Disable" : "Enable"}
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         );
//       },
//     },
//   ];
// }
