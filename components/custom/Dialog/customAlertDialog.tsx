import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { BadgeAlert, Check, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type Props = {
  open: boolean;
  onOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  children?: React.ReactNode;
  onAction: () => void;
};

function CustomAlertDialog({ open, onOpen, title, children, onAction }: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex flex-row gap-2 items-center">
            <BadgeAlert />
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{children}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button size="sm" variant="outline">
              <X />
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button size="sm" variant="default" onClick={onAction}>
              <Check />
              Proceed
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CustomAlertDialog;
