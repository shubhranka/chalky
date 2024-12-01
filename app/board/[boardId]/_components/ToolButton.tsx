import Hint from "@/app/(dashboard)/_components/Hint";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ToolButtonProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}
const ToolButton = (
  { label, icon: Icon, onClick, active, disabled }: ToolButtonProps
) => {
  return (
    <Hint content={label} side="right">
      <Button 
        onClick={onClick} 
        disabled={disabled} 
        // className={`h-10 w-10 flex items-center justify-center rounded-md ${active ? "bg-gray-200" : ""}`}    
        variant={active ? "boardActive" : "board"}
        size={"icon"}                     
      >           
        <Icon size={40} />
      </Button>
    </Hint>
  );
};

export default ToolButton;