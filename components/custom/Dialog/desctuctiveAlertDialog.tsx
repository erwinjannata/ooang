import { Check, TriangleAlertIcon, X } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";

type Props = {
  open: boolean;
  onOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  onAction: () => void;
};

const DestructiveAlertDialog = ({ open, onOpen, title, onAction }: Props) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpen}>
      <AlertDialogContent>
        <AlertDialogHeader className="place-items-center! items-center">
          <div className="bg-destructive/10 mx-auto mb-2 flex size-12 items-center justify-center rounded-full">
            <TriangleAlertIcon className="text-destructive size-6" />
          </div>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            This action cannot be undone. This will permanently affect your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">
              <X />
              Cancel
            </Button>
          </AlertDialogCancel>
          <Button variant="destructive" onClick={onAction}>
            <Check />
            Proceed
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DestructiveAlertDialog;
