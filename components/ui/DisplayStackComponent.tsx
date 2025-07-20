import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const DisplayStackComponent = ({
  stack,
  maxItems,
}: {
  stack: string[];
  maxItems: number;
}) => {
  const displayedStack = stack.slice(0, maxItems);
  const hasMoreStack = stack.length > maxItems;
  const [isStackModalOpen, setIsStackModalOpen] = React.useState(false);

  return (
    <div>
      <div className="flex flex-wrap gap-1">
        {displayedStack.map((tech) => (
          <Badge key={tech} variant="outline" className="text-xs">
            {tech}
          </Badge>
        ))}
        {hasMoreStack && (
          <Dialog open={isStackModalOpen} onOpenChange={setIsStackModalOpen}>
            <DialogTrigger asChild>
              <Badge
                variant="outline"
                className="text-xs cursor-pointer hover:bg-muted"
                onClick={() => setIsStackModalOpen(true)}
              >
                +{stack.length - maxItems} más...
              </Badge>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Stack Tecnológico Completo</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                {stack.map((tech) => (
                  <Badge
                    key={tech}
                    variant="outline"
                    className="text-xs justify-center"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default DisplayStackComponent;
